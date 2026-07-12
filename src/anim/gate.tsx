import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';

/**
 * Whether animations inside the current subtree should run. Provided by
 * <VisualGate> based on viewport visibility; consumed by useRaf and the R3F
 * canvas. Default true so anything not wrapped just animates normally.
 */
export const AnimationActiveContext = createContext(true);
export const useAnimationActive = () => useContext(AnimationActiveContext);

/** True while `ref`'s element is within `margin` of the viewport. */
export function useInView(ref: { current: Element | null }, margin = '300px 0px'): boolean {
  const [inView, setInView] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const obs = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin: margin });
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref, margin]);
  return inView;
}

/**
 * The core mobile-scroll optimization. Wraps a visual and pauses its per-frame
 * work (canvas draws, SVG ref updates, the WebGL frameloop) whenever it is
 * scrolled out of view — so only the visual you're actually looking at consumes
 * CPU/GPU. This keeps touch scrolling smooth and the battery cool on phones,
 * where a page mounts a dozen animation loops at once.
 *
 * A generous rootMargin means a visual wakes up just before it scrolls into
 * view, so there's never a cold-start flash.
 */
export function VisualGate({ children, margin = '300px 0px' }: { children: ReactNode; margin?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const obs = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), { rootMargin: margin });
    obs.observe(el);
    return () => obs.disconnect();
  }, [margin]);

  return (
    <div ref={ref} style={{ width: '100%' }}>
      <AnimationActiveContext.Provider value={active}>{children}</AnimationActiveContext.Provider>
    </div>
  );
}
