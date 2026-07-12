import { useSyncExternalStore, useCallback, type ReactNode, type MouseEvent } from 'react';

/**
 * A tiny hash router. Hash routing keeps the app a single static file that works
 * at the GitHub Pages sub-path with no server rewrites. Routes are just paths:
 * "/" (contents) and "/<chapterId>".
 */

function currentPath(): string {
  const h = window.location.hash.replace(/^#/, '');
  return h || '/';
}

function subscribe(cb: () => void): () => void {
  window.addEventListener('hashchange', cb);
  return () => window.removeEventListener('hashchange', cb);
}

export function useRoute(): string {
  return useSyncExternalStore(subscribe, currentPath, () => '/');
}

export function navigate(path: string): void {
  if (currentPath() === path) return;
  window.location.hash = path;
  window.scrollTo(0, 0);
}

export function Link({
  to,
  children,
  className,
  style,
  onNavigate,
}: {
  to: string;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onNavigate?: () => void;
}) {
  const handle = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      navigate(to);
      onNavigate?.();
    },
    [to, onNavigate],
  );
  return (
    <a href={`#${to}`} onClick={handle} className={className} style={style}>
      {children}
    </a>
  );
}
