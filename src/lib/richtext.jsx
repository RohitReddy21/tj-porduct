import React from 'react';
import { isHtmlBody, sanitizeArticleHtml } from './articleHtml.js';

/**
 * Minimal, safe Markdown subset for article bodies.
 *
 * Everything is parsed into React elements rather than an HTML string, so a
 * post body can never inject markup. Supported:
 *
 *   ## Heading            -> h2          ### Heading -> h3
 *   ![alt](url)           -> figure + img (on its own line)
 *   ![alt](url){wide}     -> same, but breaking out past the text column.
 *                            Also {left} {right} {small} — see PLACEMENTS.
 *   > quote               -> blockquote
 *   - item                -> unordered list
 *   1. item               -> ordered list
 *   blank-line separated  -> paragraph
 *   **bold**  *italic*  `code`  [text](url)
 */

const INLINE = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;

/** Optional {…} suffix on an image, controlling where it sits. */
export const PLACEMENTS = {
  full: { label: 'Full width', hint: 'Fills the text column' },
  wide: { label: 'Wide', hint: 'Breaks out wider than the text' },
  small: { label: 'Small', hint: 'Half width, centred' },
  left: { label: 'Float left', hint: 'Text wraps down the right' },
  right: { label: 'Float right', hint: 'Text wraps down the left' },
};

function renderInline(text, keyPrefix) {
  const parts = text.split(INLINE).filter(Boolean);
  return parts.map((part, i) => {
    const key = `${keyPrefix}-${i}`;
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={key}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={key}>{part.slice(1, -1)}</code>;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={key}>{part.slice(1, -1)}</em>;
    }
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      const href = link[2];
      const external = /^https?:\/\//i.test(href);
      return (
        <a
          key={key}
          href={href}
          target={external ? '_blank' : undefined}
          rel={external ? 'noreferrer' : undefined}
        >
          {link[1]}
        </a>
      );
    }
    return <React.Fragment key={key}>{part}</React.Fragment>;
  });
}

/**
 * Render a stored article body.
 *
 * New posts are HTML from the /admin rich text editor. Posts written before
 * that editor existed are markdown, so both are supported and the format is
 * detected per post.
 */
export function renderArticleBody(body) {
  if (!body?.trim()) return null;
  if (isHtmlBody(body)) {
    return (
      <div
        className="article-html"
        // Sanitised by DOMPurify immediately above — see lib/articleHtml.js.
        dangerouslySetInnerHTML={{ __html: sanitizeArticleHtml(body) }}
      />
    );
  }
  return renderMarkdownBody(body);
}

function renderMarkdownBody(body) {

  const blocks = body.replace(/\r\n/g, '\n').split(/\n{2,}/);

  return blocks.map((raw, index) => {
    const block = raw.trim();
    if (!block) return null;
    const key = `b${index}`;

    // Standalone image, with an optional {placement} suffix
    const image = block.match(/^!\[([^\]]*)\]\(([^)\s]+)\)(?:\{(\w+)\})?$/);
    if (image) {
      const [, alt, src, placement] = image;
      const variant = PLACEMENTS[placement] ? placement : 'full';
      return (
        <figure key={key} className={`article-figure article-figure--${variant}`}>
          <img src={src} alt={alt} loading="lazy" />
          {alt ? <figcaption>{alt}</figcaption> : null}
        </figure>
      );
    }

    if (block.startsWith('### ')) {
      return <h3 key={key}>{renderInline(block.slice(4), key)}</h3>;
    }
    if (block.startsWith('## ')) {
      return <h2 key={key}>{renderInline(block.slice(3), key)}</h2>;
    }
    if (block.startsWith('> ')) {
      return (
        <blockquote key={key}>
          {renderInline(block.replace(/^> ?/gm, ''), key)}
        </blockquote>
      );
    }

    const lines = block.split('\n');
    if (lines.every((l) => /^\s*[-*]\s+/.test(l))) {
      return (
        <ul key={key}>
          {lines.map((l, i) => (
            <li key={`${key}-${i}`}>{renderInline(l.replace(/^\s*[-*]\s+/, ''), `${key}-${i}`)}</li>
          ))}
        </ul>
      );
    }
    if (lines.every((l) => /^\s*\d+[.)]\s+/.test(l))) {
      return (
        <ol key={key}>
          {lines.map((l, i) => (
            <li key={`${key}-${i}`}>
              {renderInline(l.replace(/^\s*\d+[.)]\s+/, ''), `${key}-${i}`)}
            </li>
          ))}
        </ol>
      );
    }

    return <p key={key}>{renderInline(block, key)}</p>;
  });
}
