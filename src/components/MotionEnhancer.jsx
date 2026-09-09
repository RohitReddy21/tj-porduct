import { useLayoutEffect } from 'react';

const revealSelector = [
  '.section',
  '.card',
  '.side-item',
  '.dashboard',
  '.metric',
  '.graph',
  '.cta-band',
  '.logo-strip > div',
].join(',');

const reducedMotionQuery = '(prefers-reduced-motion: reduce)';

const isElementNearViewport = (element) => {
  const rect = element.getBoundingClientRect();
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
  return rect.bottom >= 0 && rect.right >= 0 && rect.top <= viewportHeight * 0.92 && rect.left <= viewportWidth;
};

/** 3D card tilt effect driven by mousemove */
function setupCardTilt(root, shouldReduceMotion) {
  if (shouldReduceMotion) return () => {};

  const handlers = new Map();

  const onEnter = (e) => {
    const card = e.currentTarget;
    card.style.transition = 'transform 0.1s ease, box-shadow 0.1s ease';
  };

  const onMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    // Max 6deg tilt — subtle and professional
    const rotX = -dy * 5;
    const rotY = dx * 5;
    card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px) scale(1.01)`;
    card.style.boxShadow = `${dx * -6}px ${dy * -6}px 30px rgba(37, 99, 235, 0.12), 0 20px 50px rgba(15, 23, 42, 0.14)`;
  };

  const onLeave = (e) => {
    const card = e.currentTarget;
    card.style.transition = 'transform 0.45s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.45s ease';
    card.style.transform = '';
    card.style.boxShadow = '';
  };

  const cards = Array.from(root.querySelectorAll('.card, .side-item'));
  cards.forEach((card) => {
    card.addEventListener('mouseenter', onEnter);
    card.addEventListener('mousemove', onMove);
    card.addEventListener('mouseleave', onLeave);
    handlers.set(card, { onEnter, onMove, onLeave });
  });

  return () => {
    cards.forEach((card) => {
      const h = handlers.get(card);
      if (!h) return;
      card.removeEventListener('mouseenter', h.onEnter);
      card.removeEventListener('mousemove', h.onMove);
      card.removeEventListener('mouseleave', h.onLeave);
      card.style.transform = '';
      card.style.boxShadow = '';
      card.style.transition = '';
    });
  };
}

/** Magnetic button effect */
function setupMagneticButtons(root, shouldReduceMotion) {
  if (shouldReduceMotion) return () => {};

  const handlers = new Map();

  const onMove = (e) => {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    // Magnetic pull — max 5px movement
    btn.style.transform = `translate(${dx * 5}px, ${dy * 4}px) translateY(-1px)`;
    btn.style.transition = 'transform 0.15s ease, box-shadow 0.15s ease';
  };

  const onLeave = (e) => {
    const btn = e.currentTarget;
    btn.style.transform = '';
    btn.style.transition = 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.4s ease';
  };

  const btns = Array.from(root.querySelectorAll('.btn'));
  btns.forEach((btn) => {
    btn.addEventListener('mousemove', onMove);
    btn.addEventListener('mouseleave', onLeave);
    handlers.set(btn, { onMove, onLeave });
  });

  return () => {
    btns.forEach((btn) => {
      const h = handlers.get(btn);
      if (!h) return;
      btn.removeEventListener('mousemove', h.onMove);
      btn.removeEventListener('mouseleave', h.onLeave);
      btn.style.transform = '';
      btn.style.transition = '';
    });
  };
}

export default function MotionEnhancer({ rootRef }) {
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    let observer;
    const elements = Array.from(root.querySelectorAll(revealSelector));

    elements.forEach((element, index) => {
      element.classList.add('motion-reveal');
      element.style.setProperty('--motion-index', String(Math.min(index, 10)));
    });

    // Content that arrives after this first pass — blog posts fetched from
    // Supabase, for instance — would otherwise keep `.motion-reveal`'s
    // opacity:0 forever, because nothing is watching to reveal it.
    const trackLateElement = (element) => {
      if (elements.includes(element)) return;
      elements.push(element);
      element.classList.add('motion-reveal');
      element.style.setProperty('--motion-index', '0');
      if (!observer || isElementNearViewport(element)) {
        element.classList.add('motion-visible');
      } else {
        observer.observe(element);
      }
    };

    const mutationObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType !== 1) continue;
          if (node.matches?.(revealSelector)) trackLateElement(node);
          node.querySelectorAll?.(revealSelector).forEach(trackLateElement);
        }
      }
    });

    root.querySelectorAll('.graph').forEach((graph) => {
      graph.querySelectorAll('.node').forEach((node, index) => {
        node.style.setProperty('--node-index', String(index));
      });
    });

    const shouldReduceMotion = window.matchMedia(reducedMotionQuery).matches;

    if (shouldReduceMotion || !('IntersectionObserver' in window)) {
      elements.forEach((element) => element.classList.add('motion-visible'));
    } else {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('motion-visible');
            observer.unobserve(entry.target);
          });
        },
        {
          rootMargin: '0px 0px -8% 0px',
          threshold: 0.12,
        },
      );

      elements.forEach((element) => {
        if (isElementNearViewport(element)) {
          element.classList.add('motion-visible');
          return;
        }
        observer.observe(element);
      });
    }

    // Start watching only after the initial pass, so `observer` already exists.
    mutationObserver.observe(root, { childList: true, subtree: true });

    // 3D card tilt (waits a tick so dangerouslySetInnerHTML cards are rendered)
    const rafId = requestAnimationFrame(() => {
      // Re-query after render so dangerouslySetInnerHTML cards are picked up
      const cleanupTilt = setupCardTilt(root, shouldReduceMotion);
      const cleanupMagnetic = setupMagneticButtons(root, shouldReduceMotion);

      // Store cleanup functions on the root for the return cleanup
      root._cleanupTilt = cleanupTilt;
      root._cleanupMagnetic = cleanupMagnetic;
    });

    return () => {
      cancelAnimationFrame(rafId);
      mutationObserver.disconnect();
      observer?.disconnect();
      root._cleanupTilt?.();
      root._cleanupMagnetic?.();
      elements.forEach((element) => {
        element.classList.remove('motion-reveal', 'motion-visible');
        element.style.removeProperty('--motion-index');
      });
      root.querySelectorAll('.graph .node').forEach((node) => {
        node.style.removeProperty('--node-index');
      });
    };
  }, [rootRef]);

  return null;
}
