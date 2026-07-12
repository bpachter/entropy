import { useEffect, useRef, useState } from 'react';
import { Box, Slider, Typography } from '@mui/material';
import { schwarzschild, entropyOverKb, horizonArea, LP, MSUN, fmtLength, sci } from '../physics';

/**
 * A black hole's entropy lives on its surface. Bekenstein saw that the one
 * quantity that never shrinks when things fall in is the event-horizon AREA, and
 * proposed the horizon carries entropy in proportion to it. Hawking fixed the
 * constant: S = k·A / 4l_P² — a quarter of the horizon, counted in Planck-sized
 * tiles. Because area grows as the square of the mass, the entropy is
 * staggering: a single sun's worth of black hole holds more of it than every
 * atom that ever formed the star.
 */

const W = 640;
const H = 340;

// Deterministic starfield.
const STARS = (() => {
  let s = 987654321;
  const out: { x: number; y: number; r: number }[] = [];
  for (let i = 0; i < 150; i++) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const x = (s % 10000) / 10000;
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const y = (s % 10000) / 10000;
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    out.push({ x: x * W, y: y * H, r: 0.4 + (s % 100) / 100 });
  }
  return out;
})();

export function EventHorizon() {
  const [logM, setLogM] = useState(0); // log10(M / M_sun)
  const M = MSUN * Math.pow(10, logM);
  const rs = schwarzschild(M);
  const S = entropyOverKb(M);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#05060b';
    ctx.fillRect(0, 0, W, H);

    const cx = W / 2, cy = H / 2;
    // Disk radius from log of the Schwarzschild radius.
    const R = 24 + ((Math.log10(rs) - 2.5) / 10) * 120;
    const Rr = Math.max(16, Math.min(150, R));

    // Starfield with mild lensing distortion near the hole.
    for (const st of STARS) {
      const dx = st.x - cx, dy = st.y - cy;
      const d = Math.hypot(dx, dy);
      if (d < Rr) continue;
      const push = 1 + (Rr * Rr) / (d * d) * 0.35;
      const sx = cx + dx * push;
      const sy = cy + dy * push;
      ctx.globalAlpha = 0.5 + 0.5 * st.r;
      ctx.fillStyle = d < Rr * 1.6 ? '#c4adff' : '#cfd4e6';
      ctx.beginPath();
      ctx.arc(sx, sy, st.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Accretion glow.
    const glow = ctx.createRadialGradient(cx, cy, Rr, cx, cy, Rr * 2.6);
    glow.addColorStop(0, 'rgba(255,171,94,0.55)');
    glow.addColorStop(0.35, 'rgba(157,123,255,0.28)');
    glow.addColorStop(1, 'rgba(157,123,255,0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(cx, cy, Rr * 2.6, 0, Math.PI * 2);
    ctx.fill();

    // The horizon (black disk) + photon ring.
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(cx, cy, Rr, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,210,150,0.9)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, Rr + 1, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = 'rgba(196,173,255,0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, Rr + 6, 0, Math.PI * 2);
    ctx.stroke();
  }, [logM, rs]);

  const label = logM < 0.5 ? 'stellar black hole' : logM < 3 ? 'heavy stellar remnant' : logM < 6.5 ? 'massive black hole' : 'supermassive black hole';

  return (
    <Box sx={{ width: '100%' }}>
      <canvas ref={canvasRef} width={W} height={H} style={{ width: '100%', display: 'block', borderRadius: 10 }} />

      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', px: 1, mt: 1.5 }}>
        <Stat label="Mass" value={`${sci(Math.pow(10, logM))} M☉`} color="#c4adff" />
        <Stat label="Horizon radius · 2GM/c²" value={fmtLength(rs)} color="#ffab5e" />
        <Stat label="Entropy · S/k = A/4l_P²" value={sci(S)} color="#9d7bff" />
        <Stat label="Planck tiles on the horizon" value={sci(horizonArea(M) / (LP * LP))} color="#8a8f99" />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1.5, px: 1 }}>
        <Typography sx={{ fontSize: 13, color: 'text.secondary', minWidth: 44 }}>Mass</Typography>
        <Slider value={logM} min={-1} max={9} step={0.05} onChange={(_, v) => setLogM(v as number)} sx={{ color: '#9d7bff', flex: 1 }} />
        <Typography sx={{ fontFamily: "'JetBrains Mono Variable', monospace", fontSize: 12.5, color: '#c4adff', minWidth: 130, textAlign: 'right' }}>{label}</Typography>
      </Box>
      <Typography sx={{ mt: 0.5, px: 1, fontSize: 12, color: 'text.secondary' }}>
        Entropy scales with area, and area with mass squared — so doubling the mass quadruples the information hidden behind the horizon.
      </Typography>
    </Box>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <Box sx={{ minWidth: 130 }}>
      <Typography variant="overline" sx={{ color: 'text.secondary', display: 'block', lineHeight: 1.2 }}>{label}</Typography>
      <Typography sx={{ fontFamily: "'JetBrains Mono Variable', monospace", fontSize: 15, color }}>{value}</Typography>
    </Box>
  );
}
