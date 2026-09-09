import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Calendar, Clock } from 'lucide-react';
import { LINKEDIN_PROFILE_URL } from '../data/blogPosts.js';
import { displayPostTags, listPublishedPosts } from '../lib/posts.js';

function LinkedinIcon({ size = 18, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13Zm1.78 13.02H3.55V9h3.57v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0Z" />
    </svg>
  );
}

function formatDate(value) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function CardInner({ post, index }) {
  const onSite = Boolean(post.slug);
  const tags = displayPostTags(post.tags);

  return (
    <>
      {post.cover_image ? (
        <div className="blog-card-media">
          <img src={post.cover_image} alt="" loading="lazy" />
        </div>
      ) : (
        <div className="blog-card-media blog-card-media-fallback" aria-hidden="true">
          <span>AFSv5</span>
          <strong>{String(index + 1).padStart(2, '0')}</strong>
        </div>
      )}

      <div className="blog-card-content">
        <div className="blog-card-meta">
          <span>
            <Calendar size={14} />
            {formatDate(post.published_at)}
          </span>
          {post.reading_time ? (
            <span>
              <Clock size={14} />
              {post.reading_time}
            </span>
          ) : null}
        </div>

        <h3>{post.title}</h3>

        {post.excerpt ? (
          <p className="muted blog-card-excerpt">
            {post.excerpt}
          </p>
        ) : null}

        {tags.length ? (
          <div className="blog-card-tags">
            {tags.map((tag) => (
              <span key={tag}>
                {tag}
              </span>
            ))}
          </div>
        ) : null}

        <span className="blog-card-link">
          {onSite ? 'Read article' : 'Read on LinkedIn'}
          {onSite ? <ArrowRight size={16} /> : <ArrowUpRight size={16} />}
        </span>
      </div>
    </>
  );
}

function PostCard({ post, index }) {
  // Posts written in /admin open on the site; manual entries link out to LinkedIn.
  if (post.slug) {
    return (
      <Link className={`card blog-card${index === 0 ? ' blog-card-featured' : ''}`} to={`/blog/${post.slug}`}>
        <CardInner post={post} index={index} />
      </Link>
    );
  }
  return (
    <a
      className={`card blog-card${index === 0 ? ' blog-card-featured' : ''}`}
      href={post.linkedin_url}
      target="_blank"
      rel="noreferrer"
    >
      <CardInner post={post} index={index} />
    </a>
  );
}

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Blog | AFSv5';
  }, []);

  useEffect(() => {
    let cancelled = false;
    listPublishedPosts()
      .then(({ posts: rows }) => {
        if (cancelled) return;
        setPosts(rows);
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main data-page-root>
      <section className="hero-inner">
        <div className="container">
          <div className="breadcrumb">AFSv5 / Blog</div>
          <span className="eyebrow" style={{ color: '#93c5fd' }}>
            Insights &amp; field notes
          </span>
          <h1>Field notes on enterprise AI.</h1>
          <p className="lead">
            What we are learning about orchestration, governance and grounded knowledge in
            production — written here, shared on LinkedIn.
          </p>
          <div className="hero-actions" style={{ marginTop: 32 }}>
            <a
              className="btn btn-primary"
              href={LINKEDIN_PROFILE_URL}
              target="_blank"
              rel="noreferrer"
            >
              <LinkedinIcon size={18} />
              Follow on LinkedIn
            </a>
            <Link className="btn btn-secondary" to="/demo">
              Request a demo
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {loading ? (
            <p className="muted">Loading articles…</p>
          ) : posts.length ? (
            <>
              <span className="eyebrow">Latest articles</span>
              <h2 style={{ marginBottom: 40 }}>Recent writing</h2>
              <div className={`grid-3 blog-grid${posts.length === 1 ? ' blog-grid-single' : ''}`}>
                {posts.map((post, index) => (
                  <PostCard key={post.id} post={post} index={index} />
                ))}
              </div>
            </>
          ) : (
            <div className="center">
              <h2>No articles published yet.</h2>
              <p className="copy" style={{ marginInline: 'auto' }}>
                Everything is on LinkedIn for now.
              </p>
              <a
                className="btn btn-primary"
                href={LINKEDIN_PROFILE_URL}
                target="_blank"
                rel="noreferrer"
                style={{ marginTop: 24 }}
              >
                <LinkedinIcon size={18} />
                Read on LinkedIn
              </a>
            </div>
          )}
        </div>
      </section>

      <section className="section alt">
        <div className="container center">
          <span className="eyebrow">Never miss a post</span>
          <h2>Follow the work as it happens.</h2>
          <p className="copy">
            Articles, build notes and the occasional post-mortem go out on LinkedIn as they publish.
          </p>
          <div
            className="hero-actions"
            style={{ marginTop: 32, justifyContent: 'center', display: 'flex' }}
          >
            <a
              className="btn btn-primary"
              href={LINKEDIN_PROFILE_URL}
              target="_blank"
              rel="noreferrer"
            >
              <LinkedinIcon size={18} />
              Follow on LinkedIn
            </a>
            <Link className="btn btn-light" to="/demo">
              Talk to us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
