import { useState } from 'react';
import { Box, Slider, Typography } from '@mui/material';
import { sup } from '../physics';

/**
 * The end of the story that began with a steam engine. Entropy has only ever
 * risen; wound all the way forward, it reaches a maximum. Stars gutter out;
 * matter decays; black holes become the last structures in the cosmos and then,
 * over unimaginable spans, evaporate too — until nothing is left but cold, even
 * radiation, and no difference anywhere to do any work. This is the "heat death"
 * Kelvin and Clausius foresaw in the 1850s: the entropy of the universe tending,
 * at last, to its maximum.
 */

const AXIS = { x0: 46, x1: 604, yTop: 40, yBot: 210, min: 6, max: 104 }; // log10 years

const ERAS = [
  { name: 'Stelliferous', from: 6, to: 14, color: '#ffd27a', desc: 'Stars shine and forge the elements. We stand near its dawn, only ~10¹⁰ years in.' },
  { name: 'Degenerate', from: 14, to: 40, color: '#9d7bff', desc: 'The last stars die. White dwarfs, neutron stars and dark matter drift and cool in the dark.' },
  { name: 'Black Hole', from: 40, to: 100, color: '#6a5acd', desc: 'Black holes are the final structures — then even they evaporate by Hawking radiation.' },
  { name: 'Dark', from: 100, to: 104, color: '#3a3a52', desc: 'Only cold, thinning radiation remains, drifting forever toward maximum entropy.' },
];

const X = (logt: number) => AXIS.x0 + ((logt - AXIS.min) / (AXIS.max - AXIS.min)) * (AXIS.x1 - AXIS.x0);
const entropyFrac = (logt: number) => 0.15 + 0.85 * (1 / (1 + Math.exp(-(logt - 38) / 14)));
const Y = (f: number) => AXIS.yBot - f * (AXIS.yBot - AXIS.yTop);

const NOW = Math.log10(1.38e10); // ≈ 10.14

export function HeatDeath() {
  const [logt, setLogt] = useState(NOW);
  const era = ERAS.find((e) => logt >= e.from && logt < e.to) ?? ERAS[ERAS.length - 1];
  const f = entropyFrac(logt);

  const curve = [];
  for (let lt = AXIS.min; lt <= AXIS.max; lt += 2) curve.push(`${X(lt).toFixed(1)},${Y(entropyFrac(lt)).toFixed(1)}`);

  const timeLabel = logt < 10 ? `10${sup(Math.round(logt))} yr` : `10${sup(Math.round(logt))} years`;

  return (
    <Box sx={{ width: '100%' }}>
      <svg viewBox="0 0 640 250" width="100%" style={{ display: 'block' }}>
        {/* era bands */}
        {ERAS.map((e) => (
          <g key={e.name}>
            <rect x={X(e.from)} y={AXIS.yTop} width={X(Math.min(e.to, AXIS.max)) - X(e.from)} height={AXIS.yBot - AXIS.yTop} fill={e.color} opacity={e.name === era.name ? 0.16 : 0.06} />
            <line x1={X(e.from)} y1={AXIS.yTop} x2={X(e.from)} y2={AXIS.yBot} stroke="rgba(255,255,255,0.08)" />
            <text x={X(e.from) + 5} y={AXIS.yTop + 14} fill={e.color} fontSize="10.5" fontFamily="'JetBrains Mono Variable', monospace" opacity={0.9}>{e.name}</text>
          </g>
        ))}

        {/* entropy curve */}
        <polyline points={curve.join(' ')} fill="none" stroke="#c4adff" strokeWidth="2.5" />
        <line x1={AXIS.x0} y1={Y(1) - 2} x2={AXIS.x1} y2={Y(1) - 2} stroke="rgba(255,171,94,0.5)" strokeDasharray="4 4" />
        <text x={AXIS.x1} y={Y(1) - 6} fill="#ffab5e" fontSize="10" textAnchor="end">maximum entropy — heat death</text>

        {/* axis */}
        <line x1={AXIS.x0} y1={AXIS.yBot} x2={AXIS.x1} y2={AXIS.yBot} stroke="rgba(255,255,255,0.25)" />
        {[6, 14, 40, 70, 100].map((lt) => (
          <text key={lt} x={X(lt)} y={AXIS.yBot + 16} fill="#6b7280" fontSize="10" textAnchor="middle" fontFamily="'JetBrains Mono Variable', monospace">10{sup(lt)}</text>
        ))}
        <text x={AXIS.x1} y={AXIS.yBot + 32} fill="#9aa3b8" fontSize="11" textAnchor="end">time (years, log scale)</text>

        {/* you are here */}
        <line x1={X(NOW)} y1={AXIS.yTop} x2={X(NOW)} y2={AXIS.yBot} stroke="#ffd27a" strokeWidth="1" strokeDasharray="2 2" opacity="0.7" />
        <text x={X(NOW)} y={AXIS.yTop - 4} fill="#ffd27a" fontSize="9.5" textAnchor="middle">you are here</text>

        {/* marker */}
        <line x1={X(logt)} y1={AXIS.yTop - 12} x2={X(logt)} y2={AXIS.yBot} stroke="#c4adff" strokeWidth="2.5" />
        <circle cx={X(logt)} cy={Y(f)} r="6" fill="#c4adff" stroke="#05060b" strokeWidth="1.5" />
      </svg>

      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', px: 1, mt: 0.5 }}>
        <Stat label="Cosmic time" value={timeLabel} color="#c4adff" />
        <Stat label="Era" value={era.name} color={era.color} />
        <Stat label="Entropy toward maximum" value={`${Math.round(f * 100)}%`} color="#ffab5e" />
      </Box>
      <Typography sx={{ mt: 1, px: 1, fontSize: 12.5, color: 'text.secondary', minHeight: 34 }}>{era.desc}</Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 0.5, px: 1 }}>
        <Typography sx={{ fontSize: 13, color: 'text.secondary', minWidth: 44 }}>Scrub</Typography>
        <Slider value={logt} min={AXIS.min} max={AXIS.max} step={0.5} onChange={(_, v) => setLogt(v as number)} sx={{ color: '#9d7bff', flex: 1 }} />
      </Box>
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
