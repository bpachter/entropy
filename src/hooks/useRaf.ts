import { useContext, useEffect, useRef } from 'react';
import { AnimationActiveContext } from '@/anim/gate';

/**
 * Run a callback every animation frame with a clamped delta (seconds). Pass
 * `active=false` to pause. The loop also pauses automatically when the nearest
 * <VisualGate> reports the visual is off-screen (mobile-scroll optimization).
 * The callback is kept in a ref so changing it doesn't restart the loop.
 */
export function useRaf(cb: (dt: number) => void, active = true): void {
  const cbRef = useRef(cb);
  cbRef.current = cb;
  const inView = useContext(AnimationActiveContext);
  const run = active && inView;
  useEffect(() => {
    if (!run) return;
    let raf = 0;
    let last = performance.now();
    const loop = (t: number) => {
      const dt = Math.min(0.05, (t - last) / 1000);
      last = t;
      cbRef.current(dt);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [run]);
}
