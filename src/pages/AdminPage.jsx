import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Check,
  Copy,
  Eye,
  ImagePlus,
  Loader2,
  LogOut,
  Plus,
  Star,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { isSupabaseConfigured, supabase } from '../lib/supabase.js';
import {
  createPost,
  deletePost,
  deletePostImage,
  estimateReadingTime,
  listAllPosts,
  slugify,
  updatePost,
  uploadPostImage,
} from '../lib/posts.js';
import { PLACEMENTS, renderArticleBody } from '../lib/richtext.jsx';
import RichTextEditor, { insertImageIntoEditor } from '../components/RichTextEditor.jsx';

const EMPTY_POST = {
  id: null,
  title: '',
  slug: '',
  excerpt: '',
  body: '',
  cover_image: null,
  images: [],
  tags: [],
  linkedin_url: '',
  reading_time: null,
  published: false,
  published_at: null,
};

const input =
  'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20';
const label = 'mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-500';

/**
 * The public site sets a dark body background and styles `main > section`.
 * The admin screens are a light UI, so everything renders inside this shell to
 * get its own background rather than inheriting the marketing theme.
 */
function AdminShell({ children }) {
  return (
    <div className="min-h-[calc(100vh-108px)] bg-gray-50 text-gray-900">{children}</div>
  );
}

/* -------------------------------------------------------------------------- */
/* Setup notice, shown when the env vars are missing                          */
/* -------------------------------------------------------------------------- */
function SetupNotice() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-20">
      <h1 className="mb-3 text-2xl font-black text-gray-900">Connect Supabase to use /admin</h1>
      <p className="mb-6 text-sm leading-relaxed text-gray-600">
        The editor needs a Supabase project to store articles and images. Create a free one at{' '}
        <a
          className="font-semibold text-blue-600 hover:underline"
          href="https://supabase.com/dashboard"
          target="_blank"
          rel="noreferrer"
        >
          supabase.com/dashboard
        </a>
        , then follow the three steps below.
      </p>
      <ol className="space-y-4 text-sm text-gray-700">
        <li>
          <strong className="text-gray-900">1. Run the schema.</strong> Open your project&apos;s SQL
          Editor and run the contents of <code className="rounded bg-gray-100 px-1.5 py-0.5">supabase/schema.sql</code>{' '}
          from this repo. It creates the <code className="rounded bg-gray-100 px-1.5 py-0.5">posts</code>{' '}
          table and its security rules.
        </li>
        <li>
          <strong className="text-gray-900">2. Create the image bucket.</strong> Storage → New
          bucket → name it{' '}
          <code className="rounded bg-gray-100 px-1.5 py-0.5">post-images</code> and turn{' '}
          <strong>Public</strong> on.
        </li>
        <li>
          <strong className="text-gray-900">3. Add your keys.</strong> Create{' '}
          <code className="rounded bg-gray-100 px-1.5 py-0.5">.env.local</code> in the project root:
          <pre className="mt-2 overflow-x-auto rounded-lg bg-gray-900 p-4 text-xs leading-relaxed text-gray-100">
            {`VITE_SUPABASE_URL=https://xxxxx.supabase.co\nVITE_SUPABASE_ANON_KEY=eyJhbGci...`}
          </pre>
          <span className="mt-2 block text-gray-600">
            Both are in Project Settings → API. Restart <code className="rounded bg-gray-100 px-1.5 py-0.5">npm run dev</code>{' '}
            afterwards, and add the same two variables in Vercel → Settings → Environment Variables.
          </span>
        </li>
      </ol>
      <p className="mt-8 text-sm text-gray-600">
        Until then <Link className="font-semibold text-blue-600 hover:underline" to="/blog">/blog</Link>{' '}
        keeps showing the manual list from{' '}
        <code className="rounded bg-gray-100 px-1.5 py-0.5">src/data/blogPosts.js</code>.
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Login                                                                       */
/* -------------------------------------------------------------------------- */
function LoginForm({ onSignedIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setBusy(false);
    if (signInError) {
      setError(signInError.message);
      return;
    }
    onSignedIn(data.session);
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-6">
      <h1 className="mb-1 text-2xl font-black text-gray-900">Sign in</h1>
      <p className="mb-6 text-sm text-gray-600">Admin access for the AFSv5 blog.</p>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className={label} htmlFor="admin-email">Email</label>
          <input
            id="admin-email"
            className={input}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            required
          />
        </div>
        <div>
          <label className={label} htmlFor="admin-password">Password</label>
          <input
            id="admin-password"
            className={input}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>
        {error ? (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        ) : null}
        <button
          type="submit"
          disabled={busy}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700 disabled:opacity-60"
        >
          {busy ? <Loader2 size={16} className="animate-spin" /> : null}
          Sign in
        </button>
      </form>
      <p className="mt-6 text-xs leading-relaxed text-gray-500">
        No account yet? Create one in Supabase → Authentication → Users → Add user, with
        &ldquo;Auto Confirm User&rdquo; ticked.
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Editor                                                                      */
/* -------------------------------------------------------------------------- */
function Editor({ post, onChange, onSaved, onDeleted, setToast }) {
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(0);
  const [preview, setPreview] = useState(false);
  const [dragging, setDragging] = useState(false);
  const editorRef = useRef(null);
  const fileRef = useRef(null);
  const coverRef = useRef(null);

  const set = (patch) => onChange({ ...post, ...patch });

  const handleTitle = (title) => {
    // Keep the slug in step with the title until the post has been published once.
    const shouldSync = !post.id || !post.published;
    set({ title, slug: shouldSync ? slugify(title) : post.slug });
  };

  const uploadFiles = useCallback(
    async (files) => {
      const list = [...files].filter((f) => f.type.startsWith('image/'));
      if (!list.length) return;
      setUploading(list.length);
      const uploaded = [];
      for (const file of list) {
        try {
          uploaded.push(await uploadPostImage(file));
        } catch (error) {
          setToast({ kind: 'error', text: `${file.name}: ${error.message}` });
        }
      }
      setUploading(0);
      if (!uploaded.length) return;
      const images = [...post.images, ...uploaded];
      set({ images, cover_image: post.cover_image ?? uploaded[0].url });
      setToast({ kind: 'ok', text: `Uploaded ${uploaded.length} image(s).` });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [post],
  );

  /** Drop an image into the article at the cursor, in the chosen placement. */
  const insertImage = (image, placement) => {
    insertImageIntoEditor(editorRef.current, image, placement);
  };

  /**
   * Files dropped or pasted straight into the article: upload them, then place
   * them at the position they were dropped rather than at the end.
   */
  const uploadIntoEditor = useCallback(
    async (files, position) => {
      setUploading(files.length);
      const uploaded = [];
      for (const file of files) {
        try {
          uploaded.push(await uploadPostImage(file));
        } catch (error) {
          setToast({ kind: 'error', text: `${file.name}: ${error.message}` });
        }
      }
      setUploading(0);
      if (!uploaded.length) return;

      const editor = editorRef.current;
      let at = position;
      uploaded.forEach((image) => {
        editor
          ?.chain()
          .focus()
          .insertContentAt(at, {
            type: 'image',
            attrs: { src: image.url, alt: image.name, placement: 'full' },
          })
          .run();
        at += 1; // keep multiple drops in the order they were selected
      });

      set({
        images: [...post.images, ...uploaded],
        cover_image: post.cover_image ?? uploaded[0].url,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [post],
  );

  const removeImage = async (image) => {
    // Pull any copies out of the article body too, so nothing 404s.
    const body = post.body ?? '';
    let nextBody = body;
    if (body.includes(image.url)) {
      const doc = new DOMParser().parseFromString(body, 'text/html');
      doc.querySelectorAll(`img[src="${CSS.escape(image.url)}"]`).forEach((img) =>
        img.closest('figure')?.remove() ?? img.remove(),
      );
      nextBody = doc.body.innerHTML;
    }
    set({
      images: post.images.filter((i) => i.url !== image.url),
      cover_image: post.cover_image === image.url ? null : post.cover_image,
      body: nextBody,
    });
    await deletePostImage(image.path);
  };

  const save = async (publish) => {
    if (!post.title.trim()) {
      setToast({ kind: 'error', text: 'Give the article a title first.' });
      return;
    }
    setBusy(true);
    const payload = {
      title: post.title.trim(),
      slug: post.slug || slugify(post.title),
      excerpt: post.excerpt?.trim() || null,
      body: post.body ?? '',
      cover_image: post.cover_image,
      images: post.images,
      tags: post.tags,
      linkedin_url: post.linkedin_url?.trim() || null,
      reading_time: estimateReadingTime(post.body ?? ''),
      published: publish,
      published_at: publish ? post.published_at ?? new Date().toISOString() : post.published_at,
    };
    try {
      const saved = post.id ? await updatePost(post.id, payload) : await createPost(payload);
      onSaved(saved);
      setToast({
        kind: 'ok',
        text: publish ? 'Published — live on /blog now.' : 'Draft saved.',
      });
    } catch (error) {
      setToast({
        kind: 'error',
        text: /duplicate key/i.test(error.message)
          ? 'That URL slug is already taken. Change it and save again.'
          : error.message,
      });
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!post.id) return;
    if (!window.confirm(`Delete “${post.title}”? This cannot be undone.`)) return;
    setBusy(true);
    try {
      await deletePost(post.id);
      onDeleted(post.id);
      setToast({ kind: 'ok', text: 'Article deleted.' });
    } catch (error) {
      setToast({ kind: 'error', text: error.message });
    } finally {
      setBusy(false);
    }
  };

  const tagText = useMemo(() => post.tags.join(', '), [post.tags]);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="sticky top-0 z-10 flex flex-wrap items-center gap-2 border-b border-gray-200 bg-white/95 px-6 py-3 backdrop-blur">
        <span className="mr-auto text-sm font-bold text-gray-900">
          {post.id ? 'Edit article' : 'New article'}
          {post.id ? (
            <span
              className={`ml-2 rounded-full px-2 py-0.5 text-[11px] font-bold ${
                post.published ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
              }`}
            >
              {post.published ? 'Published' : 'Draft'}
            </span>
          ) : null}
        </span>
        <button
          type="button"
          onClick={() => setPreview((p) => !p)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 transition hover:border-blue-600 hover:text-blue-600"
        >
          <Eye size={15} />
          {preview ? 'Edit' : 'Preview'}
        </button>
        {post.id ? (
          <button
            type="button"
            onClick={remove}
            disabled={busy}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-red-600 transition hover:border-red-500 hover:bg-red-50 disabled:opacity-60"
          >
            <Trash2 size={15} />
            Delete
          </button>
        ) : null}
        <button
          type="button"
          onClick={() => save(false)}
          disabled={busy}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 transition hover:border-blue-600 hover:text-blue-600 disabled:opacity-60"
        >
          Save draft
        </button>
        <button
          type="button"
          onClick={() => save(true)}
          disabled={busy}
          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-700 disabled:opacity-60"
        >
          {busy ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
          {post.published ? 'Update' : 'Publish'}
        </button>
      </div>

      {preview ? (
        <article className="article-body mx-auto max-w-3xl px-6 py-10">
          <h1>{post.title || 'Untitled'}</h1>
          {post.excerpt ? <p className="lead-text">{post.excerpt}</p> : null}
          {post.cover_image ? (
            <figure className="article-cover">
              <img src={post.cover_image} alt="" />
            </figure>
          ) : null}
          {renderArticleBody(post.body)}
        </article>
      ) : (
        <div className="mx-auto max-w-3xl space-y-6 px-6 py-6">
          <div>
            <label className={label} htmlFor="post-title">Title</label>
            <input
              id="post-title"
              className={`${input} text-lg font-bold`}
              value={post.title}
              onChange={(e) => handleTitle(e.target.value)}
              placeholder="How AFSv5 cuts agent runtime cost by 40%"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={label} htmlFor="post-slug">URL slug</label>
              <input
                id="post-slug"
                className={input}
                value={post.slug}
                onChange={(e) => set({ slug: slugify(e.target.value) })}
              />
              <p className="mt-1 text-xs text-gray-500">/blog/{post.slug || '…'}</p>
            </div>
            <div>
              <label className={label} htmlFor="post-tags">Tags (comma separated)</label>
              <input
                id="post-tags"
                className={input}
                defaultValue={tagText}
                onBlur={(e) =>
                  set({
                    tags: e.target.value
                      .split(',')
                      .map((t) => t.trim())
                      .filter(Boolean),
                  })
                }
                placeholder="Governance, Automation"
              />
            </div>
          </div>

          <div>
            <label className={label} htmlFor="post-excerpt">Excerpt (shows on the blog card)</label>
            <textarea
              id="post-excerpt"
              className={`${input} h-20 resize-y`}
              value={post.excerpt ?? ''}
              onChange={(e) => set({ excerpt: e.target.value })}
              placeholder="One or two sentences for someone scanning the page."
            />
          </div>

          {/* Cover image ----------------------------------------------------- */}
          <div>
            <span className={label}>Cover image</span>
            {post.cover_image ? (
              <div className="relative overflow-hidden rounded-xl border border-gray-200">
                <img src={post.cover_image} alt="" className="h-48 w-full object-cover" />
                <div className="flex items-center justify-between gap-2 bg-white px-3 py-2">
                  <span className="text-xs text-gray-500">
                    Shown on the blog card and at the top of the article.
                  </span>
                  <button
                    type="button"
                    onClick={() => set({ cover_image: null })}
                    className="shrink-0 text-xs font-semibold text-gray-600 transition hover:text-red-600"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => coverRef.current?.click()}
                className="flex w-full flex-col items-center gap-1 rounded-xl border-2 border-dashed border-gray-300 py-8 text-sm text-gray-500 transition hover:border-blue-600 hover:text-blue-600"
              >
                <ImagePlus size={20} />
                Upload a cover image
                <span className="text-xs text-gray-400">
                  Or pick one below with the star button
                </span>
              </button>
            )}
            <input
              ref={coverRef}
              type="file"
              accept="image/*"
              hidden
              onChange={async (e) => {
                const [file] = e.target.files ?? [];
                e.target.value = '';
                if (!file) return;
                setUploading(1);
                try {
                  const uploaded = await uploadPostImage(file);
                  set({ cover_image: uploaded.url, images: [...post.images, uploaded] });
                } catch (error) {
                  setToast({ kind: 'error', text: error.message });
                } finally {
                  setUploading(0);
                }
              }}
            />
          </div>

          {/* Images ---------------------------------------------------------- */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className={`${label} mb-0`}>Images in the article</span>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:underline"
              >
                <ImagePlus size={15} />
                Add images
              </button>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={(e) => {
                uploadFiles(e.target.files);
                e.target.value = '';
              }}
            />

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                uploadFiles(e.dataTransfer.files);
              }}
              className={`rounded-xl border-2 border-dashed p-4 transition ${
                dragging ? 'border-blue-600 bg-blue-50' : 'border-gray-300'
              }`}
            >
              {post.images.length ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {post.images.map((image) => {
                    const isCover = post.cover_image === image.url;
                    const inBody = (post.body ?? '').includes(image.url);
                    return (
                      <figure
                        key={image.url}
                        className="group relative overflow-hidden rounded-lg border border-gray-200"
                      >
                        <img src={image.url} alt="" className="h-28 w-full object-cover" />
                        {isCover ? (
                          <span className="absolute left-1.5 top-1.5 rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-bold text-white">
                            Cover
                          </span>
                        ) : null}
                        <figcaption className="bg-white px-1.5 pb-1.5 pt-1">
                          {/* Insert at the cursor, in the chosen placement */}
                          <div className="mb-1 flex flex-wrap gap-1">
                            {Object.entries(PLACEMENTS).map(([key, meta]) => (
                              <button
                                key={key}
                                type="button"
                                title={`Insert here — ${meta.hint}`}
                                onClick={() => insertImage(image, key)}
                                className="rounded border border-gray-200 px-1.5 py-0.5 text-[10px] font-bold text-gray-600 transition hover:border-blue-600 hover:bg-blue-50 hover:text-blue-600"
                              >
                                {meta.label}
                              </button>
                            ))}
                          </div>
                          <div className="flex items-center justify-between gap-1 border-t border-gray-100 pt-1">
                            <span
                              className={`text-[10px] font-bold ${
                                inBody ? 'text-blue-600' : 'text-gray-400'
                              }`}
                            >
                              {inBody ? 'In article' : 'Not placed'}
                            </span>
                            <span className="flex items-center gap-0.5">
                              <button
                                type="button"
                                title="Use as cover image"
                                onClick={() => set({ cover_image: image.url })}
                                className={`rounded p-1 transition hover:bg-blue-50 ${
                                  isCover ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'
                                }`}
                              >
                                <Star size={14} />
                              </button>
                              <button
                                type="button"
                                title="Copy URL"
                                onClick={() => navigator.clipboard?.writeText(image.url)}
                                className="rounded p-1 text-gray-500 transition hover:bg-blue-50 hover:text-blue-600"
                              >
                                <Copy size={14} />
                              </button>
                              <button
                                type="button"
                                title="Remove"
                                onClick={() => removeImage(image)}
                                className="rounded p-1 text-gray-500 transition hover:bg-red-50 hover:text-red-600"
                              >
                                <X size={14} />
                              </button>
                            </span>
                          </div>
                        </figcaption>
                      </figure>
                    );
                  })}
                </div>
              ) : (
                <p className="py-4 text-center text-sm text-gray-500">
                  <Upload size={18} className="mx-auto mb-2 text-gray-400" />
                  Drop images here, or use “Add images”. The first one becomes the cover.
                </p>
              )}
              {uploading ? (
                <p className="mt-3 flex items-center justify-center gap-2 text-sm text-blue-600">
                  <Loader2 size={14} className="animate-spin" />
                  Uploading {uploading} image(s)…
                </p>
              ) : null}
            </div>
            <p className="mt-2 text-xs leading-relaxed text-gray-500">
              Click into the article text where you want an image, then hit a placement button.
              <strong className="text-gray-700"> Full width</strong> fills the column,
              <strong className="text-gray-700"> Wide</strong> breaks out past it,
              <strong className="text-gray-700"> Float left/right</strong> lets text wrap
              alongside. <Star size={11} className="inline" /> sets the cover.
            </p>
          </div>

          <div>
            <span className={label}>Article body</span>
            <RichTextEditor
              editorRef={editorRef}
              value={post.body ?? ''}
              onChange={(html) => set({ body: html })}
              onUploadImage={uploadIntoEditor}
              placeholder="Write your article, or paste it in from anywhere…"
            />
            <p className="mt-2 text-xs leading-relaxed text-gray-500">
              Drag an image file straight into the text to place it exactly there. Click any image
              to change how it sits, or drag it to move it.
            </p>
          </div>

          <div>
            <label className={label} htmlFor="post-linkedin">
              LinkedIn post URL (optional — adds a “Discuss on LinkedIn” link)
            </label>
            <input
              id="post-linkedin"
              className={input}
              value={post.linkedin_url ?? ''}
              onChange={(e) => set({ linkedin_url: e.target.value })}
              placeholder="https://www.linkedin.com/posts/…"
            />
          </div>
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Page                                                                        */
/* -------------------------------------------------------------------------- */
export default function AdminPage() {
  const [session, setSession] = useState(null);
  const [checking, setChecking] = useState(true);
  const [posts, setPosts] = useState([]);
  const [current, setCurrent] = useState(EMPTY_POST);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    document.title = 'Admin | AFSv5';
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setChecking(false);
      return undefined;
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setChecking(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => setSession(next));
    return () => sub.subscription.unsubscribe();
  }, []);

  const refresh = useCallback(async () => {
    try {
      setPosts(await listAllPosts());
    } catch (error) {
      setToast({ kind: 'error', text: error.message });
    }
  }, []);

  useEffect(() => {
    if (session) refresh();
  }, [session, refresh]);

  useEffect(() => {
    if (!toast) return undefined;
    const id = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(id);
  }, [toast]);

  if (!isSupabaseConfigured) {
    return (
      <AdminShell>
        <SetupNotice />
      </AdminShell>
    );
  }
  if (checking) {
    return (
      <AdminShell>
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="animate-spin text-blue-600" />
        </div>
      </AdminShell>
    );
  }
  if (!session) {
    return (
      <AdminShell>
        <LoginForm onSignedIn={setSession} />
      </AdminShell>
    );
  }

  return (
    <AdminShell>
    <div className="flex min-h-[calc(100vh-108px)] flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="w-full shrink-0 border-b border-gray-200 bg-white lg:w-72 lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <span className="text-sm font-black text-gray-900">Articles</span>
          <button
            type="button"
            onClick={() => setCurrent(EMPTY_POST)}
            className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-2.5 py-1.5 text-xs font-bold text-white transition hover:bg-blue-700"
          >
            <Plus size={14} />
            New
          </button>
        </div>
        <ul className="max-h-72 overflow-y-auto lg:max-h-[calc(100vh-220px)]">
          {posts.map((post) => (
            <li key={post.id}>
              <button
                type="button"
                onClick={() => setCurrent(post)}
                className={`flex w-full flex-col gap-1 border-b border-gray-100 px-4 py-3 text-left transition hover:bg-blue-50 ${
                  current.id === post.id ? 'bg-blue-50' : ''
                }`}
              >
                <span className="line-clamp-2 text-sm font-semibold text-gray-900">
                  {post.title}
                </span>
                <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide">
                  <span className={post.published ? 'text-green-600' : 'text-amber-600'}>
                    {post.published ? 'Published' : 'Draft'}
                  </span>
                  <span className="font-normal normal-case text-gray-400">
                    {new Date(post.updated_at).toLocaleDateString()}
                  </span>
                </span>
              </button>
            </li>
          ))}
          {!posts.length ? (
            <li className="px-4 py-6 text-center text-sm text-gray-500">
              No articles yet. Hit <strong>New</strong>.
            </li>
          ) : null}
        </ul>
        <div className="flex items-center justify-between gap-2 border-t border-gray-200 px-4 py-3">
          <span className="truncate text-xs text-gray-500">{session.user.email}</span>
          <button
            type="button"
            onClick={() => supabase.auth.signOut()}
            className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-gray-600 transition hover:text-red-600"
          >
            <LogOut size={13} />
            Sign out
          </button>
        </div>
      </aside>

      <Editor
        key={current.id ?? 'new'}
        post={current}
        onChange={setCurrent}
        setToast={setToast}
        onSaved={(saved) => {
          setCurrent(saved);
          refresh();
        }}
        onDeleted={() => {
          setCurrent(EMPTY_POST);
          refresh();
        }}
      />

      {toast ? (
        <div
          className={`fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white shadow-lg ${
            toast.kind === 'error' ? 'bg-red-600' : 'bg-gray-900'
          }`}
          role="status"
        >
          {toast.text}
        </div>
      ) : null}
    </div>
    </AdminShell>
  );
}
