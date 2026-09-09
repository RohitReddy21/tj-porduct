import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { getPostBySlug } from '../lib/posts.js';
import { renderArticleBody } from '../lib/richtext.jsx';

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
  return parsed.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function BlogPostPage() {
  const { slug } = useParams();
  const [state, setState] = useState({ status: 'loading', post: null });

  useEffect(() => {
    let cancelled = false;
    setState({ status: 'loading', post: null });

    getPostBySlug(slug)
      .then((post) => {
        if (cancelled) return;
        setState(post ? { status: 'ready', post } : { status: 'missing', post: null });
      })
      .catch(() => {
        if (!cancelled) setState({ status: 'missing', post: null });
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    if (state.post) document.title = `${state.post.title} | AFSv5`;
  }, [state.post]);

  if (state.status === 'loading') {
    return (
      <main data-page-root>
        <section className="hero-inner">
          <div className="container">
            <div className="breadcrumb">AFSv5 / Blog</div>
            <h1>Loading…</h1>
          </div>
        </section>
      </main>
    );
  }

  if (state.status === 'missing') {
    return (
      <main data-page-root>
        <section className="hero-inner">
          <div className="container">
            <div className="breadcrumb">AFSv5 / Blog</div>
            <h1>Article not found.</h1>
            <p className="lead">This post may have been unpublished or the link is out of date.</p>
            <div className="hero-actions" style={{ marginTop: 32 }}>
              <Link className="btn btn-primary" to="/blog">
                <ArrowLeft size={16} />
                Back to the blog
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  const { post } = state;

  return (
    <main data-page-root>
      <section className="hero-inner">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/blog" style={{ color: 'inherit' }}>
              AFSv5 / Blog
            </Link>
          </div>
          {post.tags?.length ? (
            <span className="eyebrow" style={{ color: '#93c5fd' }}>
              {post.tags.join(' · ')}
            </span>
          ) : null}
          <h1>{post.title}</h1>
          {post.excerpt ? <p className="lead">{post.excerpt}</p> : null}
          <div
            style={{
              marginTop: 28,
              display: 'flex',
              flexWrap: 'wrap',
              gap: 20,
              color: '#cbd5e1',
              fontSize: '0.86rem',
              fontWeight: 700,
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
              <Calendar size={15} />
              {formatDate(post.published_at ?? post.created_at)}
            </span>
            {post.reading_time ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
                <Clock size={15} />
                {post.reading_time}
              </span>
            ) : null}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <article className="article-body">
            {post.cover_image ? (
              <figure className="article-cover">
                <img src={post.cover_image} alt="" />
              </figure>
            ) : null}

            {renderArticleBody(post.body) ?? (
              <p className="muted">This article has no body content yet.</p>
            )}

            <div className="article-footer">
              <Link className="btn btn-light" to="/blog">
                <ArrowLeft size={16} />
                All articles
              </Link>
              {post.linkedin_url ? (
                <a
                  className="btn btn-primary"
                  href={post.linkedin_url}
                  target="_blank"
                  rel="noreferrer"
                >
                  <LinkedinIcon size={17} />
                  Discuss on LinkedIn
                </a>
              ) : null}
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
