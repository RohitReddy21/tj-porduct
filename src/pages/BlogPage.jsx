import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Calendar, Clock } from 'lucide-react';
import { LINKEDIN_PROFILE_URL } from '../data/blogPosts.js';
import { listPublishedPosts } from '../lib/posts.js';

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

const cardStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: 14,
  padding: 0,
  overflow: 'hidden',
};

function CardInner({ post }) {
  const onSite = Boolean(post.slug);

  return (
    <>
      {post.cover_image ? (
        <img
          src={post.cover_image}
          alt=""
          loading="lazy"
          style={{
            width: '100%',
            height: 180,
            objectFit: 'cover',
            display: 'block',
            borderBottom: '1px solid var(--line)',
          }}
        />
      ) : null}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: 32, flex: 1 }}>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: 14,
            fontSize: '0.82rem',
            fontWeight: 700,
            color: 'var(--muted)',
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Calendar size={14} />
            {formatDate(post.published_at)}
          </span>
          {post.reading_time ? (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Clock size={14} />
              {post.reading_time}
            </span>
          ) : null}
        </div>

        <h3 style={{ margin: 0, lineHeight: 1.3 }}>{post.title}</h3>

        {post.excerpt ? (
          <p className="muted" style={{ margin: 0, lineHeight: 1.65 }}>
            {post.excerpt}
          </p>
        ) : null}

        {post.tags?.length ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {post.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  padding: '4px 12px',
                  borderRadius: 999,
                  border: '1px solid rgba(37, 99, 235, 0.16)',
                  background: 'var(--blue-soft-2)',
                  color: 'var(--blue-strong)',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  letterSpacing: '0.02em',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}

        <span
          style={{
            marginTop: 'auto',
            paddingTop: 6,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            color: 'var(--blue-strong)',
            fontWeight: 800,
            fontSize: '0.9rem',
          }}
        >
          {onSite ? 'Read article' : 'Read on LinkedIn'}
          {onSite ? <ArrowRight size={16} /> : <ArrowUpRight size={16} />}
        </span>
      </div>
    </>
  );
}

function PostCard({ post }) {
  // Posts written in /admin open on the site; manual entries link out to LinkedIn.
  if (post.slug) {
    return (
      <Link className="card" to={`/blog/${post.slug}`} style={cardStyle}>
        <CardInner post={post} />
      </Link>
    );
  }
  return (
    <a
      className="card"
      href={post.linkedin_url}
      target="_blank"
      rel="noreferrer"
      style={cardStyle}
    >
      <CardInner post={post} />
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
              <div className="grid-3">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
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
