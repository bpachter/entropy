import { useRef, useState } from 'react';
import { Box, Slider, Typography } from '@mui/material';
import { useRaf } from '@/hooks/useRaf';

/**
 * Carnot's own picture: heat does work by *falling* from a hot body to a cold
 * one, like water turning a mill wheel. Raise the hot reservoir or lower the
 * cold one and the fall grows — the wheel spins faster and yields more work.
 * (Carnot thought heat was a conserved fluid; that was wrong, but his insight
 * that the temperature drop sets the limit was exactly right.)
 */

const WHEEL = { x: 300, y: 232, r: 92 };
const DROPS = Array.from({ length: 8 }, (_, i) => i / 8);

export function HeatWaterfall() {
  const [th, setTh] = useState(760);
  const [tc, setTc] = useState(300);
  const gap = th - tc;

  const wheel = useRef<SVGGElement>(null);
  const dropG = useRef<(SVGCircleElement | null)[]>([]);
  const angle = useRef(0);
  const phase = useRef(0);

  useRaf((dt) => {
    const omega = 0.2 + (gap / 600) * 3.4;
    angle.current += omega * dt;
    // Negative: left-fed water pushes the left rim down (counter-clockwise).
    wheel.current?.setAttribute('transform', `rotate(${-(angle.current * 180) / Math.PI} ${WHEEL.x} ${WHEEL.y})`);
    phase.current += dt * (0.25 + (gap / 600) * 0.9);
    const top = 96, bottom = 356;
    DROPS.forEach((base, i) => {
      const p = (base + phase.current) % 1;
      const y = top + p * (bottom - top);
      const el = dropG.current[i];
      if (el) {
        el.setAttribute('cy', String(y));
        el.setAttribute('opacity', String(0.85 * (1 - Math.max(0, (y - 300) / 60))));
      }
    });
  });

  const hotColor = mix('#5a2418', '#ff6a3a', (th - 300) / 600);
  const coldColor = mix('#7ad3ff', '#173a6b', (tc - 100) / 500);
  const workPct = Math.round(Math.min(1, gap / 700) * 100);

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderRadius: 3, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.09)', background: 'radial-gradient(120% 130% at 50% 0%, #140f0a, #0b0806)' }}>
        <svg viewBox="0 0 620 420" width="100%" style={{ display: 'block' }}>
          {/* hot reservoir */}
          <rect x="40" y="44" width="250" height="64" rx="10" fill={hotColor} stroke="rgba(255,150,90,0.5)" />
          <text x="52" y="34" fill="#ff9166" fontSize="13" fontFamily="'JetBrains Mono Variable', monospace">hot reservoir · {th} K</text>
          {/* spout — aimed at the wheel's left rim so the falling heat drives the buckets */}
          <path d="M196 100 L224 100 L224 122 L208 122 Z" fill={hotColor} />

          {/* falling heat */}
          {DROPS.map((_, i) => (
            <circle key={i} ref={(el) => (dropG.current[i] = el)} cx={206 + (i % 3) * 5} cy={122} r={5} fill="#ffb15a" />
          ))}

          {/* waterwheel */}
          <g ref={wheel}>
            <circle cx={WHEEL.x} cy={WHEEL.y} r={WHEEL.r} fill="none" stroke="#6b7280" strokeWidth="6" />
            {Array.from({ length: 8 }).map((_, i) => {
              const a = (i * Math.PI) / 4;
              const x2 = WHEEL.x + WHEEL.r * Math.cos(a);
              const y2 = WHEEL.y + WHEEL.r * Math.sin(a);
              return (
                <g key={i}>
                  <line x1={WHEEL.x} y1={WHEEL.y} x2={x2} y2={y2} stroke="#565c66" strokeWidth="4" />
                  <rect x={x2 - 12} y={y2 - 12} width="24" height="24" rx="3" fill="#3a3f47" stroke="#6b7280" transform={`rotate(${(a * 180) / Math.PI + 45} ${x2} ${y2})`} />
                </g>
              );
            })}
          </g>
          <circle cx={WHEEL.x} cy={WHEEL.y} r="10" fill="#6b7280" />

          {/* cold pool */}
          <rect x="40" y="356" width="540" height="44" rx="8" fill={coldColor} stroke="rgba(120,190,255,0.4)" />
          <text x="52" y="386" fill="#173a6b" fontSize="13" fontFamily="'JetBrains Mono Variable', monospace" fontWeight="700">cold reservoir · {tc} K</text>

          {/* work take-off */}
          <line x1={WHEEL.x + WHEEL.r} y1={WHEEL.y} x2="540" y2={WHEEL.y} stroke="#d9a441" strokeWidth="4" strokeDasharray="2 6" />
          <rect x="536" y="150" width="46" height="164" rx="6" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.12)" />
          <rect x="540" y={314 - (workPct / 100) * 160} width="38" height={(workPct / 100) * 160} rx="4" fill="#d9a441" />
          <text x="559" y="140" textAnchor="middle" fill="#d9a441" fontSize="12" fontFamily="'JetBrains Mono Variable', monospace">work</text>
        </svg>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: { xs: 1, sm: 3 }, mt: 2, px: 1 }}>
        <SliderRow label="Hot Tₕ" value={th} min={320} max={900} color="#ff6a3a" onChange={(v) => setTh(Math.max(tc + 60, v))} />
        <SliderRow label="Cold T꜀" value={tc} min={100} max={520} color="#7ad3ff" onChange={(v) => setTc(Math.min(th - 60, v))} />
      </Box>
      <Typography sx={{ mt: 1.5, px: 1, fontSize: 13.5, color: 'text.secondary' }}>
        Temperature drop <b style={{ color: '#ffb15a' }}>ΔT = {gap} K</b>. The taller the fall, the more work — no drop, no work.
      </Typography>
    </Box>
  );
}

function SliderRow({ label, value, min, max, color, onChange }: { label: string; value: number; min: number; max: number; color: string; onChange: (v: number) => void }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      <Typography sx={{ fontSize: 13, color: 'text.secondary', minWidth: 58, fontFamily: "'JetBrains Mono Variable', monospace" }}>{label}</Typography>
      <Slider value={value} min={min} max={max} step={5} onChange={(_, v) => onChange(v as number)} sx={{ color }} />
    </Box>
  );
}

/** Linear blend between two #rrggbb colours. */
function mix(a: string, b: string, t: number): string {
  const c = Math.min(1, Math.max(0, t));
  const pa = [1, 3, 5].map((i) => parseInt(a.substr(i, 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.substr(i, 2), 16));
  const r = pa.map((v, i) => Math.round(v + (pb[i] - v) * c));
  return `rgb(${r[0]},${r[1]},${r[2]})`;
}
