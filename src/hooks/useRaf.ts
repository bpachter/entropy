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
      // Clamp low as well as high. A requestAnimationFrame timestamp is the time
      // the frame *started*, which can predate the performance.now() captured
      // when this effect ran — so the first delta after a (re)mount can be
      // negative. Anything integrating dt then runs backwards past zero, and a
      // consumer doing `Math.floor(phase) % n` gets a NEGATIVE index, because
      // JavaScript's % keeps the sign of the dividend. That crashed the
      // Information chapter (STAGES[-1].sub) and blanked the whole route.
      const dt = Math.max(0, Math.min(0.05, (t - last) / 1000));
      last = t;
      cbRef.current(dt);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [run]);
}
