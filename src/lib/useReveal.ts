import { useEffect } from 'react';

/**
 * Reveal-on-scroll. Any element with a data-reveal attribute fades in once it enters the viewport.
 * Elements added later (route changes) are picked up by a MutationObserver. Reduced-motion users
 * see everything immediately through CSS.
 */
export const useReveal = () => {
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') {
      document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => (el.dataset.reveal = 'in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).dataset.reveal = 'in';
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: '0px 0px -5% 0px', threshold: 0 },
    );
    const watch = (root: ParentNode) =>
      root.querySelectorAll<HTMLElement>('[data-reveal]:not([data-reveal="in"])').forEach((el) => io.observe(el));
    watch(document);
    const mo = new MutationObserver((records) => {
      for (const r of records) {
        r.addedNodes.forEach((n) => {
          if (n instanceof HTMLElement) {
            if (n.matches('[data-reveal]')) io.observe(n);
            watch(n);
          }
        });
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);
};
