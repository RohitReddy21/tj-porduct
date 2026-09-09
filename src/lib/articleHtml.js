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

export function sanitizeArticleHtml(body) {
  if (!body) return '';
  installHooks();
  return DOMPurify.sanitize(body, CONFIG);
}

/** Plain text of an article body, for excerpts and reading time. */
export function articleToText(body) {
  if (!body) return '';
  if (!isHtmlBody(body)) return body;
  const doc = new DOMParser().parseFromString(body, 'text/html');
  return doc.body.textContent || '';
}
