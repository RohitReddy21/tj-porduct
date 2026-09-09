import DOMPurify from 'dompurify';

/**
 * Article bodies are authored as HTML in /admin (TipTap). Even though only
 * allowlisted admins can write them, the stored HTML is sanitised before it is
 * rendered — a compromised account, or a bad paste, should never be able to run
 * script in a visitor's browser.
 */
const CONFIG = {
  ALLOWED_TAGS: [
    'p', 'br', 'hr',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'strong', 'b', 'em', 'i', 'u', 's', 'del', 'mark', 'sub', 'sup',
    'ul', 'ol', 'li',
    'blockquote', 'pre', 'code',
    'a', 'img', 'figure', 'figcaption',
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
    'span', 'div',
  ],
  ALLOWED_ATTR: [
    'href', 'target', 'rel',
    'src', 'alt', 'title', 'width', 'height', 'loading',
    'class', 'style',
    'data-placement',
    'colspan', 'rowspan',
  ],
  // Keep pasted content from reaching out to anything but http(s) and mailto.
  ALLOWED_URI_REGEXP: /^(?:https?:|mailto:|tel:|\/|#)/i,
  FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form', 'input'],
  FORBID_ATTR: ['srcset', 'formaction', 'xlink:href'],
};

let hooked = false;
function installHooks() {
  if (hooked) return;
  hooked = true;
  DOMPurify.addHook('afterSanitizeAttributes', (node) => {
    if (node.tagName === 'A' && node.getAttribute('href')) {
      // Anything leaving the site opens safely in a new tab.
      const href = node.getAttribute('href');
      if (/^https?:/i.test(href)) {
        node.setAttribute('target', '_blank');
        node.setAttribute('rel', 'noreferrer noopener');
      }
    }
    if (node.tagName === 'IMG') {
      node.setAttribute('loading', 'lazy');
      node.removeAttribute('style'); // placement is driven by data-placement
    }
    // A pasted style attribute can smuggle in positioning; drop all but a few.
    if (node.hasAttribute?.('style')) {
      const safe = (node.getAttribute('style') || '')
        .split(';')
        .map((rule) => rule.trim())
        .filter((rule) => /^(text-align|font-weight|font-style|text-decoration)\s*:/i.test(rule))
        .join('; ');
      if (safe) node.setAttribute('style', safe);
      else node.removeAttribute('style');
    }
  });
}

/** True when a stored body is HTML rather than the older markdown format. */
export function isHtmlBody(body) {
  if (!body) return false;
  return /<(p|h[1-6]|ul|ol|li|figure|img|blockquote|pre|div|span|strong|em|a)\b[^>]*>/i.test(body);
}

/**
 * Rescue lists that were flattened into paragraphs.
 *
 * Pasting plain text puts every line in its own <p>, so a bullet list arrives
 * as a run of paragraphs literally beginning "- ". Rendered that way they read
 * as loose, over-spaced prose. Consecutive runs are folded back into a real
 * <ul>/<ol> so they get list spacing and markers.
 */
const BULLET = /^\s*[-*•]\s+(.*)$/;
const NUMBERED = /^\s*\d+[.)]\s+(.*)$/;

export function normaliseArticleHtml(html) {
  if (!html) return html;
  const doc = new DOMParser().parseFromString(html, 'text/html');

  const flush = (run, kind, anchor) => {
    if (run.length < 2) return; // a single stray line is probably real prose
    const list = doc.createElement(kind);
    run.forEach(({ node, text }) => {
      const li = doc.createElement('li');
      // Keep any inline markup, minus the leading marker.
      const clone = node.cloneNode(true);
      const first = clone.firstChild;
      if (first?.nodeType === 3) {
        first.nodeValue = first.nodeValue.replace(/^\s*(?:[-*•]|\d+[.)])\s+/, '');
        while (clone.firstChild) li.appendChild(clone.firstChild);
      } else {
        li.textContent = text;
      }
      list.appendChild(li);
    });
    anchor.parentNode.insertBefore(list, anchor);
    run.forEach(({ node }) => node.remove());
  };

  // A paragraph that is nothing but an image URL — pasted before the editor
  // recognised those — should be the picture, not a blue link.
  const IMAGE_URL = /^https?:\/\/\S+\.(png|jpe?g|gif|webp|avif|svg|bmp)(\?\S*)?$/i;
  for (const p of [...doc.body.querySelectorAll('p')]) {
    const text = p.textContent.trim();
    if (!IMAGE_URL.test(text)) continue;
    const links = p.querySelectorAll('a');
    // Only when the paragraph holds nothing else.
    if (links.length > 1) continue;
    if (links.length === 1 && links[0].textContent.trim() !== text) continue;
    const img = doc.createElement('img');
    img.setAttribute('src', links.length ? links[0].getAttribute('href') || text : text);
    img.setAttribute('alt', '');
    img.setAttribute('data-placement', 'full');
    p.replaceWith(img);
  }

  // Group the top-level children into consecutive runs of the same marker type,
  // then convert each run in one pass. Collecting first keeps the DOM stable
  // while we are still walking it.
  const runs = [];
  let current = null;

  for (const node of doc.body.children) {
    const isP = node.tagName === 'P';
    const text = isP ? node.textContent : '';
    const bullet = isP ? BULLET.exec(text) : null;
    const numbered = isP && !bullet ? NUMBERED.exec(text) : null;
    const kind = bullet ? 'ul' : numbered ? 'ol' : null;

    if (!kind) {
      current = null;
      continue;
    }
    if (!current || current.kind !== kind) {
      current = { kind, items: [] };
      runs.push(current);
    }
    current.items.push({ node, text: (bullet ?? numbered)[1] });
  }

  for (const { kind, items } of runs) flush(items, kind, items[0].node);

  return doc.body.innerHTML;
}

export function sanitizeArticleHtml(body) {
  if (!body) return '';
  installHooks();
  return DOMPurify.sanitize(normaliseArticleHtml(body), CONFIG);
}

/** Plain text of an article body, for excerpts and reading time. */
export function articleToText(body) {
  if (!body) return '';
  if (!isHtmlBody(body)) return body;
  const doc = new DOMParser().parseFromString(body, 'text/html');
  return doc.body.textContent || '';
}
