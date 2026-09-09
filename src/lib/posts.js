import { POST_IMAGE_BUCKET, isSupabaseConfigured, supabase } from './supabase.js';
import { sortedBlogPosts } from '../data/blogPosts.js';
import { articleToText } from './articleHtml.js';

/**
 * Data access for blog posts.
 *
 * Reads prefer Supabase. If Supabase is not configured (or a request fails),
 * they fall back to the hand-maintained list in src/data/blogPosts.js so the
 * blog page is never empty.
 */

// Shape the manual entries like database rows so the UI only handles one shape.
function fromManualList() {
  return sortedBlogPosts.map((post, index) => ({
    id: `manual-${index}`,
    slug: null, // manual entries link straight out to LinkedIn
    title: post.title,
    excerpt: post.excerpt ?? '',
    body: '',
    cover_image: post.image || null,
    images: [],
    tags: post.tags ?? [],
    linkedin_url: post.url,
    reading_time: post.readingTime ?? null,
    published: true,
    published_at: post.date,
    source: 'manual',
  }));
}

function normalise(row) {
  return {
    ...row,
    images: Array.isArray(row.images) ? row.images : [],
    tags: Array.isArray(row.tags) ? row.tags : [],
    source: 'supabase',
  };
}

/** Published posts, newest first. Used by the public blog page. */
export async function listPublishedPosts() {
  if (!isSupabaseConfigured) return { posts: fromManualList(), source: 'manual' };

  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('published', true)
    .order('published_at', { ascending: false });

  if (error) {
    console.error('[posts] falling back to the manual list:', error.message);
    return { posts: fromManualList(), source: 'manual', error };
  }

  // An empty table on a brand-new project should still show the seeded list.
  if (!data?.length) return { posts: fromManualList(), source: 'manual' };

  return { posts: data.map(normalise), source: 'supabase' };
}

/** Every post including drafts. Admin only — RLS blocks this when signed out. */
export async function listAllPosts() {
  if (!isSupabaseConfigured) throw new Error('Supabase is not configured.');
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('updated_at', { ascending: false });
  if (error) throw error;
  return data.map(normalise);
}

export async function getPostBySlug(slug) {
  if (!isSupabaseConfigured) return null;
  const { data, error } = await supabase.from('posts').select('*').eq('slug', slug).maybeSingle();
  if (error) throw error;
  return data ? normalise(data) : null;
}

export async function createPost(post) {
  const { data, error } = await supabase.from('posts').insert(post).select().single();
  if (error) throw error;
  return normalise(data);
}

export async function updatePost(id, patch) {
  const { data, error } = await supabase
    .from('posts')
    .update(patch)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return normalise(data);
}

export async function deletePost(id) {
  const { error } = await supabase.from('posts').delete().eq('id', id);
  if (error) throw error;
}

/** Upload one image and return its public URL. */
export async function uploadPostImage(file) {
  if (!isSupabaseConfigured) throw new Error('Supabase is not configured.');

  const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const path = `${new Date().getFullYear()}/${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage
    .from(POST_IMAGE_BUCKET)
    .upload(path, file, { cacheControl: '31536000', upsert: false });
  if (error) throw error;

  const { data } = supabase.storage.from(POST_IMAGE_BUCKET).getPublicUrl(path);
  return { url: data.publicUrl, path, name: file.name };
}

export async function deletePostImage(path) {
  if (!isSupabaseConfigured || !path) return;
  await supabase.storage.from(POST_IMAGE_BUCKET).remove([path]);
}

/** "My First Post!" -> "my-first-post" */
export function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);
}

/** Rough reading time from the body text. Handles HTML and markdown bodies. */
export function estimateReadingTime(body) {
  const words = articleToText(body).trim().split(/\s+/).filter(Boolean).length;
  if (!words) return null;
  return `${Math.max(1, Math.round(words / 220))} min read`;
}
