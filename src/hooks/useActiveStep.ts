import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Tracks which narrative step is currently in the reader's focus band (~45% down
 * the viewport). Returns the active index and a ref-setter to tag each step.
 */
export function useActiveStep(count: number) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = Number((entry.target as HTMLElement).dataset.step);
            if (!Number.isNaN(idx)) setActive(idx);
          }
        }
      },
      // A thin activation band near the upper-middle of the viewport.
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    );
    refs.current.slice(0, count).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [count]);

  const setRef = useCallback(
    (i: number) => (el: HTMLElement | null) => {
      refs.current[i] = el;
    },
    [],
  );

  return { active, setRef };
}
