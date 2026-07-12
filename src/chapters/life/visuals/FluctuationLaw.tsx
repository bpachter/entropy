import { useRef, useState } from 'react';
import { Box, Slider, Typography } from '@mui/material';
import { useRaf } from '@/hooks/useRaf';

/**
 * Schrödinger's √n law. Count how many of n molecules land in the left half of
 * a box: on average exactly half, but any real count deviates. Schrödinger's
 * rule is that the relative deviation is of order 1/√n — a dozen molecules swing
 * wildly from 50/50, a mole (~10²³) never budges past the twelfth decimal. The
 * needle shows that deviation live; the shaded band is the ±1/√n envelope. It is
 * why the reliable machinery of life must be built from multitudes — and why a
 * gene of a few thousand atoms is a genuine scandal.
 */

const TRACK = { x0: 70, x1: 590, y: 96 };
const SPARK = { x0: 70, x1: 590, y0: 150, y1: 250 };
const HISTORY = 90;
const RANGE = 0.5; // gauge spans ±50% deviation

function gauss(): number {
  let u = 0, v = 0, s = 0;
  do {
    u = Math.random() * 2 - 1;
    v = Math.random() * 2 - 1;
    s = u * u + v * v;
  } while (s === 0 || s >= 1);
  return u * Math.sqrt((-2 * Math.log(s)) / s);
}

export function FluctuationLaw() {
  const [logN, setLogN] = useState(1.6); // 10^logN
  const n = Math.round(Math.pow(10, logN));
  const rel = 1 / Math.sqrt(n); // Schrödinger's relative fluctuation, 1/√n

  const needle = useRef<SVGGElement>(null);
  const spark = useRef<SVGPolylineElement>(null);
  const bandRef = useRef<SVGRectElement>(null);
  const readout = useRef<SVGTextElement>(null);
  const hist = useRef<number[]>([]);
  const acc = useRef(0);
  const relRef = useRef(rel);
  relRef.current = rel;

  // Map a deviation δ∈[−RANGE, RANGE] to an x on the track.
  const X = (d: number) => TRACK.x0 + ((Math.max(-RANGE, Math.min(RANGE, d)) + RANGE) / (2 * RANGE)) * (TRACK.x1 - TRACK.x0);

  useRaf((dt) => {
    acc.current += dt;
    if (acc.current < 0.11) return;
    acc.current = 0;
    const d = gauss() * relRef.current; // relative deviation of the count from n/2
    hist.current.push(d);
    if (hist.current.length > HISTORY) hist.current.shift();

    needle.current?.setAttribute('transform', `translate(${X(d)} 0)`);
    if (readout.current) {
      const dc = Math.max(-RANGE, Math.min(RANGE, d)); // match the (clamped) needle
      readout.current.textContent = `${dc >= 0 ? '+' : ''}${(dc * 100).toFixed(1)}%${Math.abs(d) > RANGE ? '+' : ''}`;
    }

    const pts = hist.current.map((v, i) => {
      const x = SPARK.x0 + (i / (HISTORY - 1)) * (SPARK.x1 - SPARK.x0);
      const y = (SPARK.y0 + SPARK.y1) / 2 - (Math.max(-RANGE, Math.min(RANGE, v)) / RANGE) * ((SPARK.y1 - SPARK.y0) / 2);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });
    spark.current?.setAttribute('points', pts.join(' '));

    const bw = Math.min(TRACK.x1 - TRACK.x0, (relRef.current / RANGE) * (TRACK.x1 - TRACK.x0));
    bandRef.current?.setAttribute('x', String(X(0) - bw / 2));
    bandRef.current?.setAttribute('width', String(bw));
  });

  const relPct = rel * 100;

  return (
    <Box sx={{ width: '100%' }}>
      <svg viewBox="0 0 640 300" width="100%" style={{ display: 'block' }}>
        <text x={TRACK.x0} y="46" fill="#a7e0b3" fontSize="13" fontFamily="'Fraunces Variable', serif" fontStyle="italic">
          how far the left-half count of {n.toLocaleString()} molecules strays from 50/50
        </text>

        <line x1={TRACK.x0} y1={TRACK.y} x2={TRACK.x1} y2={TRACK.y} stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
        <rect ref={bandRef} x={X(0)} y={TRACK.y - 16} width="0" height="32" fill="rgba(94,194,127,0.16)" />
        <text x={TRACK.x1} y={TRACK.y - 26} fill="#5ec27f" fontSize="10" textAnchor="end" fontFamily="'JetBrains Mono Variable', monospace">shaded band = ±1σ (1/√n)</text>
        <line x1={X(0)} y1={TRACK.y - 22} x2={X(0)} y2={TRACK.y + 22} stroke="#b6d95a" strokeWidth="1.5" strokeDasharray="3 3" />
        <text x={X(0)} y={TRACK.y + 40} fill="#9aa3b8" fontSize="11" textAnchor="middle">exactly half</text>
        <text x={TRACK.x0} y={TRACK.y + 40} fill="#6b7280" fontSize="10" textAnchor="middle">−50%</text>
        <text x={TRACK.x1} y={TRACK.y + 40} fill="#6b7280" fontSize="10" textAnchor="middle">+50%</text>
        <g ref={needle} transform={`translate(${X(0)} 0)`}>
          <polygon points={`0,${TRACK.y - 22} -6,${TRACK.y - 34} 6,${TRACK.y - 34}`} fill="#5ec27f" />
          <line x1="0" y1={TRACK.y - 22} x2="0" y2={TRACK.y + 22} stroke="#5ec27f" strokeWidth="2.5" />
        </g>
        <text ref={readout} x={TRACK.x1} y="46" fill="#eef1f8" fontSize="15" textAnchor="end" fontFamily="'JetBrains Mono Variable', monospace">+0.00%</text>

        <rect x={SPARK.x0} y={SPARK.y0} width={SPARK.x1 - SPARK.x0} height={SPARK.y1 - SPARK.y0} fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.08)" />
        <line x1={SPARK.x0} y1={(SPARK.y0 + SPARK.y1) / 2} x2={SPARK.x1} y2={(SPARK.y0 + SPARK.y1) / 2} stroke="rgba(182,217,90,0.3)" strokeDasharray="3 3" />
        <polyline ref={spark} fill="none" stroke="#5ec27f" strokeWidth="1.5" opacity="0.9" />
        <text x={SPARK.x0 + 4} y={SPARK.y0 + 14} fill="#6b7280" fontSize="10" fontFamily="'JetBrains Mono Variable', monospace">last {HISTORY} counts</text>
      </svg>

      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', px: 1, mt: 0.5 }}>
        <Stat label="Molecules · n" value={n.toLocaleString()} color="#a7e0b3" />
        <Stat label="√n law · relative wobble = 1/√n" value={`± ${relPct < 0.01 ? relPct.toExponential(1) : relPct.toFixed(relPct < 1 ? 3 : 1)}%`} color="#5ec27f" />
        <Stat label="Verdict" value={n < 300 ? 'chaos — no law' : n < 100000 ? 'a rough tendency' : 'a sharp law'} color={n < 300 ? '#ff9166' : n < 100000 ? '#b6d95a' : '#5ec27f'} />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1.5, px: 1 }}>
        <Typography sx={{ fontSize: 13, color: 'text.secondary', minWidth: 90 }}>Number of molecules</Typography>
        <Slider value={logN} min={1} max={6} step={0.01} onChange={(_, v) => setLogN(v as number)} sx={{ color: '#5ec27f', flex: 1 }} />
        <Typography sx={{ fontFamily: "'JetBrains Mono Variable', monospace", fontSize: 13, color: '#a7e0b3', minWidth: 68, textAlign: 'right' }}>
          10^{logN.toFixed(1)}
        </Typography>
      </Box>
      <Typography sx={{ mt: 1, px: 1, fontSize: 12, color: 'text.secondary' }}>
        A hundred molecules wobble ~10%; a million, ~0.1%; a mole, twelve zeros of steadiness. Reliable physics needs the crowd.
      </Typography>
    </Box>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <Box sx={{ minWidth: 140 }}>
      <Typography variant="overline" sx={{ color: 'text.secondary', display: 'block', lineHeight: 1.2 }}>{label}</Typography>
      <Typography sx={{ fontFamily: "'JetBrains Mono Variable', monospace", fontSize: 15, color }}>{value}</Typography>
    </Box>
  );
}
