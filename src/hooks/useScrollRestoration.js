import { useEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

const KEY = 'rc:scroll-positions';
// Pages are code-split, so on a refresh the real content lands a few frames after
// the first paint. Keep retrying the restore until the document is tall enough.
const RESTORE_TIMEOUT = 3000;

const readPositions = () => {
  try {
    return JSON.parse(sessionStorage.getItem(KEY)) || {};
  } catch {
    return {};
  }
};

const writePositions = (positions) => {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(positions));
  } catch {
    /* private mode / storage full — restoring is optional, so ignore */
  }
};

export default function useScrollRestoration() {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();

  const target = useRef(null);
  const restored = useRef(false);

  // Read the stored offset during render, before any effect runs. StrictMode mounts
  // effects twice in dev, and the throwaway cleanup would otherwise save the fresh
  // page's scrollY of 0 over the position we're about to restore.
  if (!target.current || target.current.pathname !== pathname) {
    // A refresh, or back/forward, arrives as POP: go back to where the user was.
    // Anything else is a fresh navigation and should start at the top.
    const offset = navigationType === 'POP' ? readPositions()[pathname] || 0 : 0;
    target.current = { pathname, offset };
    restored.current = false;
  }

  useEffect(() => {
    if (!('scrollRestoration' in window.history)) return undefined;
    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';
    return () => { window.history.scrollRestoration = previous; };
  }, []);

  // Remember where the user is, but only once this page has settled where it belongs.
  useEffect(() => {
    let frame = 0;

    const save = () => {
      if (!restored.current) return;
      writePositions({ ...readPositions(), [pathname]: window.scrollY });
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => { frame = 0; save(); });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pagehide', save);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pagehide', save);
      if (frame) cancelAnimationFrame(frame);
      save();
    };
  }, [pathname]);

  useEffect(() => {
    const { offset } = target.current;

    if (!offset) {
      window.scrollTo(0, 0);
      restored.current = true;
      return undefined;
    }

    let frame = 0;
    let done = false;

    const finish = () => {
      done = true;
      restored.current = true;
    };

    // If the user starts scrolling while we're waiting, leave them alone.
    const abort = () => { if (!done) finish(); };
    const events = ['wheel', 'touchstart', 'keydown'];
    events.forEach((e) => window.addEventListener(e, abort, { passive: true }));

    const startedAt = Date.now();
    const attempt = () => {
      if (done) return;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll >= offset) {
        window.scrollTo(0, offset);
        finish();
        return;
      }
      if (Date.now() - startedAt > RESTORE_TIMEOUT) {
        window.scrollTo(0, Math.max(maxScroll, 0));
        finish();
        return;
      }
      frame = requestAnimationFrame(attempt);
    };
    attempt();

    return () => {
      if (frame) cancelAnimationFrame(frame);
      events.forEach((e) => window.removeEventListener(e, abort));
    };
  }, [pathname]);
}
