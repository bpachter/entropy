import { useRef, useState } from 'react';
import { Box, Slider, Typography, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { useRaf } from '@/hooks/useRaf';

/**
 * Cool a gas held at constant volume and its pressure falls in a dead-straight
 * line. Extend the line and it strikes zero pressure at −273.15 °C — a floor no
 * gas can go below. That is Kelvin's absolute zero, and it fixes a temperature
 * scale that needs no thermometer fluid, no substance at all: just the physics.
 */

const T0 = 0; // reference °C
const P0 = 100; // reference pressure (kPa)
const ABS = -273.15;
const TMIN = -300;
const TMAX = 160;
const PLOT = { x0: 72, x1: 560, y0: 40, y1: 300 };
const PMAX = 160; // kPa

const pressure = (tC: number) => (P0 * (tC + 273.15)) / (T0 + 273.15);
const X = (t: number) => PLOT.x0 + ((t - TMIN) / (TMAX - TMIN)) * (PLOT.x1 - PLOT.x0);
const Y = (p: number) => PLOT.y1 - (p / PMAX) * (PLOT.y1 - PLOT.y0);

// Deterministic per-particle jiggle offsets.
const PARTS = Array.from({ length: 20 }, (_, i) => ({
  bx: 40 + (i % 5) * 28,
  by: 38 + Math.floor(i / 5) * 32,
  fx: 5 + (i % 4) * 1.7,
  fy: 4 + (i % 3) * 1.9,
  ph: i * 1.7,
}));

export function AbsoluteZero() {
  const [t, setT] = useState(20);
  const [unit, setUnit] = useState<'C' | 'K'>('C');
  const clock = useRef(0);
  const dots = useRef<(SVGCircleElement | null)[]>([]);

  const p = pressure(t);
  const tAbs = t + 273.15;

  useRaf((dt) => {
    clock.current += dt;
    const amp = 5.5 * Math.min(1, Math.max(0, tAbs / 400));
    PARTS.forEach((pt, i) => {
      const el = dots.current[i];
      if (!el) return;
      el.setAttribute('cx', String(pt.bx + amp * Math.sin(clock.current * pt.fx + pt.ph)));
      el.setAttribute('cy', String(pt.by + amp * Math.cos(clock.current * pt.fy + pt.ph)));
    });
  });

  const label = unit === 'C' ? `${t.toFixed(0)} °C` : `${tAbs.toFixed(0)} K`;

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.5fr 1fr' }, gap: 1.5, alignItems: 'center' }}>
        {/* P–T graph */}
        <svg viewBox="0 0 600 330" width="100%" style={{ display: 'block' }}>
          {/* axes */}
          <line x1={PLOT.x0} y1={PLOT.y0} x2={PLOT.x0} y2={PLOT.y1} stroke="rgba(255,255,255,0.28)" />
          <line x1={PLOT.x0} y1={PLOT.y1} x2={PLOT.x1} y2={PLOT.y1} stroke="rgba(255,255,255,0.28)" />
          <text x={PLOT.x0 - 8} y={PLOT.y0 + 4} fill="#9aa3b8" fontSize="12" textAnchor="end">P</text>
          <text x={PLOT.x1} y={PLOT.y1 + 20} fill="#9aa3b8" fontSize="12" textAnchor="end">T (°C)</text>
          {/* zero-pressure axis + absolute zero marker */}
          <line x1={X(ABS)} y1={PLOT.y0} x2={X(ABS)} y2={PLOT.y1} stroke="#57c2e0" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.7" />
          <text x={X(ABS)} y={PLOT.y0 - 6} fill="#57c2e0" fontSize="11" textAnchor="middle">−273.15 °C</text>
          {[-273.15, -200, -100, 0, 100].map((tk) => (
            <text key={tk} x={X(tk)} y={PLOT.y1 + 16} fill="#6b7280" fontSize="10" textAnchor="middle">{tk === -273.15 ? '' : tk}</text>
          ))}
          {/* the line: solid over measured range, dashed as extrapolation */}
          <line x1={X(-40)} y1={Y(pressure(-40))} x2={X(TMAX)} y2={Y(pressure(TMAX))} stroke="#f5b73c" strokeWidth="2.5" />
          <line x1={X(ABS)} y1={Y(0)} x2={X(-40)} y2={Y(pressure(-40))} stroke="#f5b73c" strokeWidth="2" strokeDasharray="5 5" opacity="0.8" />
          <circle cx={X(ABS)} cy={Y(0)} r="4" fill="#57c2e0" />
          {/* current marker */}
          <line x1={X(t)} y1={PLOT.y1} x2={X(t)} y2={Y(p)} stroke="rgba(255,255,255,0.2)" />
          <circle cx={X(t)} cy={Y(p)} r="6" fill="#ffd27a" stroke="#0a090c" strokeWidth="1.5" />
        </svg>

        {/* gas cylinder + pressure gauge */}
        <svg viewBox="0 0 260 330" width="100%" style={{ display: 'block' }}>
          <rect x="20" y="20" width="150" height="150" rx="6" fill="rgba(87,194,224,0.04)" stroke="#565c66" strokeWidth="2" />
          {PARTS.map((_, i) => (
            <circle key={i} ref={(el) => (dots.current[i] = el)} cx={40} cy={40} r="4" fill="#7ad3ff" />
          ))}
          {/* pressure gauge */}
          <g transform="translate(95 250)">
            <path d="M -70 0 A 70 70 0 0 1 70 0" fill="none" stroke="#565c66" strokeWidth="3" />
            {[0, 0.25, 0.5, 0.75, 1].map((f) => {
              const a = Math.PI - f * Math.PI;
              return <line key={f} x1={62 * Math.cos(a)} y1={-62 * Math.sin(a)} x2={70 * Math.cos(a)} y2={-70 * Math.sin(a)} stroke="#6b7280" strokeWidth="2" />;
            })}
            {(() => {
              const f = Math.min(1, p / PMAX);
              const a = Math.PI - f * Math.PI;
              return <line x1="0" y1="0" x2={58 * Math.cos(a)} y2={-58 * Math.sin(a)} stroke="#f5b73c" strokeWidth="3" strokeLinecap="round" />;
            })()}
            <circle cx="0" cy="0" r="5" fill="#f5b73c" />
            <text x="0" y="26" textAnchor="middle" fill="#f5b73c" fontSize="14" fontFamily="'JetBrains Mono Variable', monospace">{p.toFixed(0)} kPa</text>
          </g>
        </svg>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1, px: 1, flexWrap: 'wrap' }}>
        <Typography sx={{ fontSize: 13, color: 'text.secondary', minWidth: 90 }}>Temperature</Typography>
        <Slider value={t} min={ABS} max={TMAX} step={1} onChange={(_, v) => setT(v as number)} sx={{ color: '#f5b73c', flex: 1, minWidth: 160 }} />
        <Typography sx={{ fontFamily: "'JetBrains Mono Variable', monospace", fontSize: 16, color: '#ffd27a', minWidth: 78, textAlign: 'right' }}>{label}</Typography>
        <ToggleButtonGroup size="small" exclusive value={unit} onChange={(_, v) => v && setUnit(v)}>
          <ToggleButton value="C" sx={{ py: 0.25, px: 1 }}>°C</ToggleButton>
          <ToggleButton value="K" sx={{ py: 0.25, px: 1 }}>K</ToggleButton>
        </ToggleButtonGroup>
      </Box>
    </Box>
  );
}
