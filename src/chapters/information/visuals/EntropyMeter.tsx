import { useRef, useState } from 'react';
import { Box, Slider, Typography, Button } from '@mui/material';
import { useRaf } from '@/hooks/useRaf';

/**
 * Shannon's entropy, H = −Σ pᵢ log₂ pᵢ, measured live. Stripped of all meaning,
 * the information in a message is just its surprise — and a source's average
 * surprise per symbol is its entropy, in bits. It is maximal when every symbol
 * is equally likely (nothing is predictable) and zero when one symbol is
 * certain (nothing is learned). The formula is Boltzmann's S = −k Σ p ln p, in
 * a new suit of clothes.
 */

const SYMBOLS = ['#2dd4bf', '#38bdf8', '#8fe9df', '#a3e0fc'];
const LETTERS = ['A', 'B', 'C', 'D'];
const N = 4;
const HMAX = Math.log2(N);

const PRESETS: { label: string; w: number[] }[] = [
  { label: 'Fair coin', w: [1, 1, 0, 0] },
  { label: 'Loaded (9:1)', w: [9, 1, 0, 0] },
  { label: 'Four, even', w: [1, 1, 1, 1] },
  { label: 'Nearly certain', w: [50, 1, 0, 0] },
];

const STREAM = 46;

export function EntropyMeter() {
  const [w, setW] = useState([1, 1, 1, 1]);

  const total = w.reduce((a, b) => a + b, 0) || 1;
  const p = w.map((x) => x / total);
  const H = p.reduce((acc, pi) => (pi > 0 ? acc - pi * Math.log2(pi) : acc), 0);
  const redundancy = HMAX - H;

  // A live stream of symbols drawn from the current distribution — the source talking.
  const [stream, setStream] = useState<number[]>([]);
  const acc = useRef(0);
  const pRef = useRef(p);
  pRef.current = p;
  useRaf((dt) => {
    acc.current += dt;
    if (acc.current < 0.13) return;
    acc.current = 0;
    const r = Math.random();
    let cum = 0, idx = 0;
    for (let i = 0; i < N; i++) { cum += pRef.current[i]; if (r <= cum) { idx = i; break; } }
    setStream((s) => [...s.slice(-(STREAM - 1)), idx]);
  });

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {LETTERS.map((L, i) => (
          <Box key={L} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 22, height: 22, borderRadius: 1, bgcolor: SYMBOLS[i], display: 'grid', placeItems: 'center', color: '#04121a', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>{L}</Box>
            <Box sx={{ position: 'relative', flex: 1, height: 22, borderRadius: 1, bgcolor: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
              <Box sx={{ position: 'absolute', inset: 0, width: `${p[i] * 100}%`, bgcolor: SYMBOLS[i], opacity: 0.55, transition: 'width 0.1s linear' }} />
              <Typography sx={{ position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)', fontFamily: "'JetBrains Mono Variable', monospace", fontSize: 11.5, color: '#eef1f8' }}>
                p = {p[i].toFixed(2)} · surprise {p[i] > 0 ? (-Math.log2(p[i])).toFixed(1) : '∞'} bits
              </Typography>
            </Box>
            <Slider value={w[i]} min={0} max={50} step={1} onChange={(_, v) => setW((prev) => prev.map((x, j) => (j === i ? (v as number) : x)))} sx={{ width: 120, color: SYMBOLS[i], flexShrink: 0 }} />
          </Box>
        ))}
      </Box>

      {/* Entropy gauge */}
      <Box sx={{ mt: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 0.5 }}>
          <Typography variant="overline" sx={{ color: 'text.secondary' }}>Entropy · H = −Σ pᵢ log₂ pᵢ</Typography>
          <Typography sx={{ fontFamily: "'JetBrains Mono Variable', monospace", fontSize: 22, color: '#2dd4bf' }}>
            {H.toFixed(3)} <span style={{ fontSize: 13, color: '#9aa3b8' }}>/ {HMAX.toFixed(2)} bits</span>
          </Typography>
        </Box>
        <Box sx={{ height: 12, borderRadius: 6, bgcolor: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
          <Box sx={{ height: '100%', width: `${(H / HMAX) * 100}%`, background: 'linear-gradient(90deg,#38bdf8,#2dd4bf)', transition: 'width 0.1s linear' }} />
        </Box>
        <Typography sx={{ mt: 0.75, fontSize: 12, color: 'text.secondary' }}>
          {H < 0.05 ? 'A certainty carries no information — you already knew the answer.' : H > HMAX - 0.05 ? 'Maximum uncertainty: every symbol equally likely, every message maximally surprising.' : 'Somewhere between certainty and chaos — the average surprise per symbol.'}
        </Typography>
      </Box>

      {/* Live stream — the source emitting symbols at these odds. */}
      <Box sx={{ mt: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 0.5 }}>
          <Typography variant="overline" sx={{ color: 'text.secondary' }}>The source, talking</Typography>
          <Typography sx={{ fontFamily: "'JetBrains Mono Variable', monospace", fontSize: 12.5, color: '#8fe9df' }}>redundancy · {redundancy.toFixed(2)} bits</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: '2px', flexWrap: 'wrap', minHeight: 20 }}>
          {stream.map((s, i) => (
            <Box key={i} sx={{ width: 16, height: 20, borderRadius: '2px', display: 'grid', placeItems: 'center', bgcolor: SYMBOLS[s], color: '#04121a', fontFamily: "'JetBrains Mono Variable', monospace", fontSize: 11, fontWeight: 700, opacity: 0.3 + 0.7 * (i / STREAM) }}>
              {LETTERS[s]}
            </Box>
          ))}
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2 }}>
        {PRESETS.map((pr) => (
          <Button key={pr.label} size="small" variant="outlined" onClick={() => setW(pr.w)} sx={{ color: '#8fe9df', borderColor: 'rgba(45,212,191,0.4)', fontSize: 12 }}>
            {pr.label}
          </Button>
        ))}
      </Box>
    </Box>
  );
}
