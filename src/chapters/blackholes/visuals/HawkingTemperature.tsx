import { useState } from 'react';
import { Box, Slider, Typography } from '@mui/material';
import { hawkingT, lifetimeYears, MSUN, T_CMB, YEAR_NOW, sci } from '../physics';

/**
 * Hawking's shock: a black hole is not black. Quantum theory forces its horizon
 * to glow with a real temperature T = ħc³ / 8πGMk — inversely proportional to
 * mass. A tiny hole is blindingly hot and evaporates in a flash; a star-sized
 * one is colder than deep space and will outlast the stars by unimaginable
 * spans, shrinking only once the cosmos itself cools below it. With a
 * temperature, a black hole becomes a true thermodynamic object — heat and all.
 */

const LADDER = { x0: 40, x1: 600, y: 250, min: -9, max: 12 }; // log10 K
const MARKS = [
  { logT: -8, label: 'stellar BH' },
  { logT: Math.log10(T_CMB), label: 'CMB 2.7 K' },
  { logT: Math.log10(300), label: 'room' },
  { logT: Math.log10(5778), label: 'Sun' },
];

/** Blackbody-ish colour ramp by log₁₀ temperature. */
function tempColor(logT: number): string {
  const stops: [number, [number, number, number]][] = [
    [-9, [42, 26, 74]],
    [Math.log10(T_CMB), [90, 70, 150]],
    [2.5, [255, 90, 60]],
    [3.8, [255, 200, 120]],
    [5, [220, 235, 255]],
    [8, [158, 197, 255]],
    [12, [120, 160, 255]],
  ];
  let lo = stops[0], hi = stops[stops.length - 1];
  for (let i = 0; i < stops.length - 1; i++) {
    if (logT >= stops[i][0] && logT <= stops[i + 1][0]) { lo = stops[i]; hi = stops[i + 1]; break; }
  }
  const t = (logT - lo[0]) / (hi[0] - lo[0] || 1);
  const c = lo[1].map((v, i) => Math.round(v + (hi[1][i] - v) * Math.max(0, Math.min(1, t))));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
}

const X = (logT: number) => LADDER.x0 + ((Math.max(LADDER.min, Math.min(LADDER.max, logT)) - LADDER.min) / (LADDER.max - LADDER.min)) * (LADDER.x1 - LADDER.x0);

export function HawkingTemperature() {
  const [logM, setLogM] = useState(-9); // log10(M / M_sun) — a small hole, warmer than space and already shrinking
  const M = MSUN * Math.pow(10, logM);
  const T = hawkingT(M);
  const life = lifetimeYears(M);
  const logT = Math.log10(T);
  const color = tempColor(logT);

  const verdict = T > 1e4 ? 'blazing — evaporating in a cosmic instant' : T > T_CMB ? 'warmer than space — already shrinking' : 'colder than the CMB — still growing, not yet decaying';

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'auto 1fr' }, gap: 3, alignItems: 'center' }}>
        {/* glowing orb */}
        <Box sx={{ justifySelf: 'center' }}>
          <Box sx={{ width: 120, height: 120, borderRadius: '50%', background: `radial-gradient(circle at 40% 38%, ${color}, #000 72%)`, boxShadow: `0 0 60px -6px ${color}`, border: '1px solid rgba(255,255,255,0.15)' }} />
        </Box>

        {/* temperature ladder */}
        <svg viewBox="0 0 640 290" width="100%" style={{ display: 'block' }}>
          <line x1={LADDER.x0} y1={LADDER.y} x2={LADDER.x1} y2={LADDER.y} stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
          {[-9, -6, -3, 0, 3, 6, 9, 12].map((lt) => (
            <g key={lt}>
              <line x1={X(lt)} y1={LADDER.y - 5} x2={X(lt)} y2={LADDER.y + 5} stroke="rgba(255,255,255,0.3)" />
              <text x={X(lt)} y={LADDER.y + 20} fill="#6b7280" fontSize="10" textAnchor="middle" fontFamily="'JetBrains Mono Variable', monospace">10{supTiny(lt)}</text>
            </g>
          ))}
          <text x={LADDER.x1} y={LADDER.y + 38} fill="#9aa3b8" fontSize="11" textAnchor="end">temperature (K)</text>
          {MARKS.map((m) => (
            <g key={m.label}>
              <line x1={X(m.logT)} y1={LADDER.y - 30} x2={X(m.logT)} y2={LADDER.y} stroke="rgba(196,173,255,0.35)" strokeDasharray="2 3" />
              <text x={X(m.logT)} y={LADDER.y - 34} fill="#9aa3b8" fontSize="9.5" textAnchor="middle">{m.label}</text>
            </g>
          ))}
          {/* current T marker */}
          <line x1={X(logT)} y1={LADDER.y - 60} x2={X(logT)} y2={LADDER.y + 8} stroke={color} strokeWidth="2.5" />
          <circle cx={X(logT)} cy={LADDER.y - 60} r="6" fill={color} />
          <text x={X(logT)} y={LADDER.y - 70} fill={color} fontSize="12" textAnchor="middle" fontFamily="'JetBrains Mono Variable', monospace">{sci(T)} K</text>
        </svg>
      </Box>

      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', px: 1, mt: 0.5 }}>
        <Stat label="Hawking temperature" value={`${sci(T)} K`} color={color} />
        <Stat label="Evaporation lifetime · ∝ M³" value={`${sci(life)} yr`} color={life < YEAR_NOW ? '#ff6a6a' : '#ffab5e'} />
        <Stat label="vs age of universe" value={`${sci(life / YEAR_NOW)}×`} color="#9d7bff" />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1.5, px: 1 }}>
        <Typography sx={{ fontSize: 13, color: 'text.secondary', minWidth: 44 }}>Mass</Typography>
        <Slider value={logM} min={-16} max={9} step={0.05} onChange={(_, v) => setLogM(v as number)} sx={{ color: '#9d7bff', flex: 1 }} />
        <Typography sx={{ fontFamily: "'JetBrains Mono Variable', monospace", fontSize: 12.5, color: '#c4adff', minWidth: 90, textAlign: 'right' }}>{sci(Math.pow(10, logM))} M☉</Typography>
      </Box>
      <Typography sx={{ mt: 0.5, px: 1, fontSize: 12.5, color: 'text.secondary' }}>{verdict}.</Typography>
    </Box>
  );
}

const SUPS = '⁰¹²³⁴⁵⁶⁷⁸⁹';
function supTiny(n: number): string {
  const s = Math.abs(n).toString().split('').map((d) => SUPS[+d]).join('');
  return (n < 0 ? '⁻' : '') + s;
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <Box sx={{ minWidth: 140 }}>
      <Typography variant="overline" sx={{ color: 'text.secondary', display: 'block', lineHeight: 1.2 }}>{label}</Typography>
      <Typography sx={{ fontFamily: "'JetBrains Mono Variable', monospace", fontSize: 15, color }}>{value}</Typography>
    </Box>
  );
}
