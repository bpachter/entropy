import { useRef, useState } from 'react';
import { Box, Slider, Typography } from '@mui/material';
import { useRaf } from '@/hooks/useRaf';

/**
 * A working single-cylinder steam engine as an SVG slider-crank: the firebox
 * boils water, steam drives the piston, the connecting rod turns the flywheel.
 * The one knob — firebox heat — sets how fast the whole thing runs, making the
 * chapter's core idea physical: fire in, motion out.
 */

const C = { x: 700, y: 200 }; // crank (flywheel) centre
const RC = 52; // crank radius
const L = 150; // connecting-rod length
const IRON = '#454b55';
const IRON_D = '#2b3037';
const BRASS = '#d9a441';
const FIRE = '#ff8a3d';

export function SteamEngine() {
  const [heat, setHeat] = useState(0.6);
  const theta = useRef(Math.PI);
  const flick = useRef(0);

  const spokes = useRef<SVGGElement>(null);
  const pin = useRef<SVGCircleElement>(null);
  const rod = useRef<SVGLineElement>(null);
  const piston = useRef<SVGRectElement>(null);
  const pistonRod = useRef<SVGLineElement>(null);
  const flames = useRef<SVGGElement>(null);
  const steam = useRef<SVGGElement>(null);
  const rpmText = useRef<SVGTextElement>(null);
  const rpmAccum = useRef(0);

  useRaf((dt) => {
    const omega = 1.1 + heat * 5.2; // rad/s
    theta.current = (theta.current + omega * dt) % (Math.PI * 2);
    flick.current += dt;
    const th = theta.current;

    const px = C.x + RC * Math.cos(th);
    const py = C.y + RC * Math.sin(th);
    const qx = px - Math.sqrt(Math.max(0, L * L - (py - C.y) * (py - C.y)));

    spokes.current?.setAttribute('transform', `rotate(${(th * 180) / Math.PI} ${C.x} ${C.y})`);
    pin.current?.setAttribute('cx', String(px));
    pin.current?.setAttribute('cy', String(py));
    rod.current?.setAttribute('x1', String(px));
    rod.current?.setAttribute('y1', String(py));
    rod.current?.setAttribute('x2', String(qx));
    piston.current?.setAttribute('x', String(qx - 34));
    pistonRod.current?.setAttribute('x1', String(qx));
    pistonRod.current?.setAttribute('x2', String(qx - 34));

    // Firebox flicker + steam breathing scale with heat.
    if (flames.current) {
      const f = 0.55 + 0.45 * Math.abs(Math.sin(flick.current * 9)) * heat;
      const sy = 0.7 + f * 0.5;
      flames.current.setAttribute('opacity', String(0.35 + 0.65 * heat));
      // Scale about the flame base (y=320) so they lick upward in place — pivot
      // baked into the transform, not a flaky CSS transform-origin.
      flames.current.setAttribute('transform', `translate(110 320) scale(1 ${sy}) translate(-110 -320)`);
    }
    if (steam.current) steam.current.setAttribute('opacity', String(0.25 + 0.5 * heat * (0.6 + 0.4 * Math.sin(flick.current * 4))));

    rpmAccum.current += dt;
    if (rpmAccum.current > 0.15 && rpmText.current) {
      rpmAccum.current = 0;
      rpmText.current.textContent = `${Math.round((omega / (2 * Math.PI)) * 60)} rpm`;
    }
  });

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderRadius: 3, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.09)', background: 'radial-gradient(120% 130% at 30% 20%, #17110a, #0b0806)' }}>
        <svg viewBox="0 0 820 380" width="100%" style={{ display: 'block' }}>
          {/* ground */}
          <rect x="0" y="330" width="820" height="50" fill="#0a0a0c" />
          <line x1="0" y1="330" x2="820" y2="330" stroke="rgba(255,255,255,0.08)" />

          {/* firebox + flames */}
          <rect x="40" y="250" width="150" height="80" rx="6" fill={IRON_D} stroke={IRON} />
          <g ref={flames}>
            <path d="M70 320 Q80 275 96 320 Z" fill={FIRE} />
            <path d="M96 322 Q110 262 128 322 Z" fill="#ffb15a" />
            <path d="M124 320 Q140 278 156 320 Z" fill={FIRE} />
          </g>
          <rect x="40" y="316" width="150" height="14" fill="#1c1206" />

          {/* boiler */}
          <rect x="60" y="150" width="360" height="96" rx="48" fill={IRON} stroke={IRON_D} strokeWidth="3" />
          <rect x="60" y="150" width="360" height="96" rx="48" fill="url(#boilerSheen)" opacity="0.25" />
          {/* steam dome + steam */}
          <rect x="150" y="120" width="60" height="40" rx="8" fill={IRON} stroke={IRON_D} />
          <g ref={steam} opacity="0.4">
            <circle cx="180" cy="104" r="14" fill="#cfd8e6" />
            <circle cx="196" cy="92" r="11" fill="#cfd8e6" />
            <circle cx="166" cy="90" r="9" fill="#cfd8e6" />
          </g>
          <text x="240" y="204" fill="rgba(255,255,255,0.35)" fontSize="13" fontFamily="'JetBrains Mono Variable', monospace">boiler</text>

          {/* steam pipe to cylinder */}
          <rect x="418" y="188" width="54" height="24" fill={IRON_D} />

          {/* cylinder */}
          <rect x="466" y="170" width="170" height="60" rx="10" fill={IRON_D} stroke={IRON} strokeWidth="3" />
          <rect ref={piston} x="520" y="178" width="34" height="44" rx="4" fill={BRASS} />
          <line ref={pistonRod} x1="554" y1="200" x2="520" y2="200" stroke={BRASS} strokeWidth="7" />

          {/* connecting rod + crank */}
          <line ref={rod} x1="648" y1="200" x2="520" y2="200" stroke="#9aa3b8" strokeWidth="6" strokeLinecap="round" />

          {/* flywheel */}
          <circle cx={C.x} cy={C.y} r="86" fill="none" stroke={IRON} strokeWidth="14" />
          <circle cx={C.x} cy={C.y} r="86" fill="none" stroke={IRON_D} strokeWidth="2" />
          <g ref={spokes}>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <line key={i} x1={C.x} y1={C.y} x2={C.x + 78 * Math.cos((i * Math.PI) / 3)} y2={C.y + 78 * Math.sin((i * Math.PI) / 3)} stroke={IRON} strokeWidth="5" />
            ))}
            <circle cx={C.x + RC} cy={C.y} r="7" fill={BRASS} />
          </g>
          <circle cx={C.x} cy={C.y} r="12" fill={IRON} stroke={IRON_D} strokeWidth="2" />
          <circle ref={pin} cx={C.x + RC} cy={C.y} r="8" fill={BRASS} stroke="#7a5a1f" />

          <text ref={rpmText} x={C.x} y="322" textAnchor="middle" fill={FIRE} fontSize="16" fontFamily="'JetBrains Mono Variable', monospace">— rpm</text>

          <defs>
            <linearGradient id="boilerSheen" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#fff" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2, px: 1 }}>
        <Typography sx={{ fontSize: 13, color: 'text.secondary', minWidth: 96 }}>Firebox heat</Typography>
        <Slider value={heat} min={0.15} max={1} step={0.01} onChange={(_, v) => setHeat(v as number)} sx={{ color: FIRE }} />
      </Box>
    </Box>
  );
}
