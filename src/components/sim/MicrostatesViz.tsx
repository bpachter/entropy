import { useMemo, useState } from 'react';
import { Box, Slider, Typography } from '@mui/material';

const N = 60;

// Exact log-factorials so we can handle W = C(60,30) ≈ 1.18e17 without overflow.
const logFact: number[] = (() => {
  const f = [0];
  for (let i = 1; i <= N; i++) f[i] = f[i - 1] + Math.log(i);
  return f;
})();

const logChoose = (m: number) => logFact[N] - logFact[m] - logFact[N - m]; // natural log
const LOG2 = Math.log(2);
const LOG10 = Math.log(10);

function sci(logNat: number): string {
  const log10 = logNat / LOG10;
  const exp = Math.floor(log10);
  const mant = Math.pow(10, log10 - exp);
  if (exp < 3) return Math.round(Math.exp(logNat)).toLocaleString();
  return `${mant.toFixed(2)} × 10^${exp}`;
}

/**
 * Boltzmann's insight made playable: a macrostate ("m of 60 molecules on the
 * left") corresponds to W = C(60, m) microscopic arrangements. All-on-one-side
 * has W = 1; evenly spread has W in the tens of quadrillions. Entropy is just
 * S = k·log W — so systems drift toward the macrostate you can build the most
 * ways. Nothing pushes the gas to fill the room; there are simply overwhelmingly
 * more ways to be spread out.
 */
export function MicrostatesViz() {
  const [m, setM] = useState(6);

  const bars = useMemo(() => {
    const arr: number[] = [];
    let maxLog = 0;
    for (let i = 0; i <= N; i++) {
      const l = logChoose(i);
      arr.push(l);
      if (l > maxLog) maxLog = l;
    }
    return { arr, maxLog };
  }, []);

  const logW = logChoose(m);
  const bits = logW / LOG2;
  const chartW = 560;
  const chartH = 150;
  const barW = chartW / (N + 1);

  return (
    <Box sx={{ width: '100%', height: '100%', minHeight: 440, display: 'flex', flexDirection: 'column', justifyContent: 'center', p: { xs: 2, md: 3 }, gap: 2 }}>
      {/* The two chambers with a representative arrangement. */}
      <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'stretch', height: 150 }}>
        <Chamber count={m} accent="#42a6ff" label={`${m} left`} />
        <Chamber count={N - m} accent="#ff6a43" label={`${N - m} right`} />
      </Box>

      {/* Entropy curve: log₂W against the macrostate m. */}
      <Box sx={{ bgcolor: 'rgba(8,10,15,0.6)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 2, p: 1.5 }}>
        <svg viewBox={`0 0 ${chartW} ${chartH + 22}`} width="100%" style={{ display: 'block' }}>
          {bars.arr.map((l, i) => {
            const h = (l / bars.maxLog) * chartH;
            const active = i === m;
            return (
              <rect
                key={i}
                x={i * barW + 1}
                y={chartH - h}
                width={barW - 1.5}
                height={Math.max(h, 0.5)}
                rx={1}
                fill={active ? '#ffd27a' : 'url(#entGrad)'}
                opacity={active ? 1 : 0.5}
              />
            );
          })}
          <defs>
            <linearGradient id="entGrad" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="560" y2="0">
              <stop offset="0" stopColor="#42a6ff" />
              <stop offset="0.5" stopColor="#b9a6c9" />
              <stop offset="1" stopColor="#ff6a43" />
            </linearGradient>
          </defs>
          <text x={0} y={chartH + 16} fill="#9aa3b8" fontSize="11">all on the right</text>
          <text x={chartW / 2 - 40} y={chartH + 16} fill="#9aa3b8" fontSize="11">evenly spread</text>
          <text x={chartW - 74} y={chartH + 16} fill="#9aa3b8" fontSize="11">all on the left</text>
        </svg>
      </Box>

      <Box sx={{ px: 1 }}>
        <Slider
          value={m}
          min={0}
          max={N}
          onChange={(_, v) => setM(v as number)}
          sx={{ color: '#ffd27a' }}
        />
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mt: 0.5 }}>
          <Readout label="Microstates W" value={sci(logW)} />
          <Readout label="Entropy S = k log W" value={`${bits.toFixed(1)} bits`} />
        </Box>
      </Box>
    </Box>
  );
}

function Chamber({ count, accent, label }: { count: number; accent: string; label: string }) {
  const cols = 6;
  const dots = Array.from({ length: count });
  return (
    <Box sx={{ flex: 1, position: 'relative', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 2, bgcolor: 'rgba(255,255,255,0.02)', p: 1, overflow: 'hidden' }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 0.5, alignContent: 'flex-start', height: '100%' }}>
        {dots.map((_, i) => (
          <Box key={i} sx={{ width: 9, height: 9, borderRadius: '50%', bgcolor: accent, boxShadow: `0 0 6px ${accent}` }} />
        ))}
      </Box>
      <Typography sx={{ position: 'absolute', bottom: 6, right: 8, fontSize: 11, color: 'text.secondary', fontFamily: "'JetBrains Mono Variable', monospace" }}>{label}</Typography>
    </Box>
  );
}

function Readout({ label, value }: { label: string; value: string }) {
  return (
    <Box>
      <Typography variant="overline" sx={{ color: 'text.secondary', display: 'block', lineHeight: 1.2 }}>{label}</Typography>
      <Typography sx={{ fontFamily: "'JetBrains Mono Variable', monospace", fontSize: 16, color: '#ffd27a' }}>{value}</Typography>
    </Box>
  );
}
