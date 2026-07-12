import { useRef, useState } from 'react';
import { Box, Slider, Typography, Switch, FormControlLabel } from '@mui/material';
import { useRaf } from '@/hooks/useRaf';

/**
 * Shannon's noisy-channel theorem, made visible. Bits cross a channel that
 * randomly flips each one with probability p. Naively, noise seems to doom
 * communication — yet Shannon proved that with enough clever redundancy you can
 * drive the error rate arbitrarily close to zero, so long as you transmit below
 * the channel capacity C = 1 − H(p). Here a crude 3× repetition code (majority
 * vote) already collapses the error from p to 3p² − 2p³.
 */

const M = 40; // message bits
const TICK = 0.7; // seconds between transmissions

// A fixed, recognizable-ish message pattern.
const MESSAGE: number[] = (() => {
  let s = 12345;
  const out: number[] = [];
  for (let i = 0; i < M; i++) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    out.push((s >> 16) & 1);
  }
  return out;
})();

const binEntropy = (p: number) => (p <= 0 || p >= 1 ? 0 : -p * Math.log2(p) - (1 - p) * Math.log2(1 - p));

export function NoisyChannel() {
  const [p, setP] = useState(0.1);
  const [coded, setCoded] = useState(false);
  const [rx, setRx] = useState<number[]>(MESSAGE.slice());
  const acc = useRef(0);
  const pRef = useRef(p);
  const codedRef = useRef(coded);
  pRef.current = p;
  codedRef.current = coded;

  const transmit = () => {
    const pp = pRef.current;
    const out: number[] = [];
    for (let i = 0; i < M; i++) {
      if (!codedRef.current) {
        out.push(MESSAGE[i] ^ (Math.random() < pp ? 1 : 0));
      } else {
        let ones = 0;
        for (let k = 0; k < 3; k++) ones += MESSAGE[i] ^ (Math.random() < pp ? 1 : 0);
        out.push(ones >= 2 ? 1 : 0); // majority vote of 3 copies
      }
    }
    setRx(out);
  };

  useRaf((dt) => {
    acc.current += dt;
    if (acc.current >= TICK) {
      acc.current = 0;
      transmit();
    }
  });

  const errors = rx.reduce((a, b, i) => a + (b !== MESSAGE[i] ? 1 : 0), 0);
  const C = 1 - binEntropy(p);
  const codedBER = 3 * p * p - 2 * p * p * p;
  const shownBER = coded ? codedBER : p;
  const rate = coded ? 1 / 3 : 1;

  const Row = ({ bits, compare }: { bits: number[]; compare?: boolean }) => (
    <Box sx={{ display: 'flex', gap: '2px' }}>
      {bits.map((b, i) => {
        const err = compare && b !== MESSAGE[i];
        return (
          <Box key={i} sx={{ flex: 1, height: 22, borderRadius: '2px', display: 'grid', placeItems: 'center', fontFamily: "'JetBrains Mono Variable', monospace", fontSize: 11, color: err ? '#04121a' : b ? '#2dd4bf' : '#3a5560', bgcolor: err ? '#ff5a6a' : b ? 'rgba(45,212,191,0.18)' : 'rgba(255,255,255,0.03)' }}>
            {b}
          </Box>
        );
      })}
    </Box>
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Typography sx={{ fontSize: 11, color: 'text.secondary', fontFamily: "'JetBrains Mono Variable', monospace", mb: 0.5 }}>SENT</Typography>
      <Row bits={MESSAGE} />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, my: 1.25 }}>
        <Box sx={{ flex: 1, borderTop: '1px dashed rgba(56,189,248,0.4)' }} />
        <Typography sx={{ fontFamily: "'JetBrains Mono Variable', monospace", fontSize: 12, color: '#38bdf8' }}>
          ▼ CHANNEL · noise p = {p.toFixed(2)} {coded && '· 3× repetition'}
        </Typography>
        <Box sx={{ flex: 1, borderTop: '1px dashed rgba(56,189,248,0.4)' }} />
      </Box>
      <Typography sx={{ fontSize: 11, color: 'text.secondary', fontFamily: "'JetBrains Mono Variable', monospace", mb: 0.5 }}>RECEIVED · {errors} error{errors === 1 ? '' : 's'}</Typography>
      <Row bits={rx} compare />

      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mt: 2 }}>
        <Stat label="Channel capacity · 1 − H(p)" value={`${C.toFixed(3)} bits/use`} color="#38bdf8" />
        <Stat label={coded ? 'Error rate · 3p²−2p³' : 'Error rate · p'} value={`${(shownBER * 100).toFixed(1)}%`} color={shownBER < p ? '#2dd4bf' : '#ff9166'} />
        <Stat label="Code rate" value={rate === 1 ? '1 (raw)' : '1/3'} color="#8fe9df" />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1.5, flexWrap: 'wrap' }}>
        <Typography sx={{ fontSize: 13, color: 'text.secondary', minWidth: 60 }}>Noise p</Typography>
        <Slider value={p} min={0} max={0.5} step={0.01} onChange={(_, v) => setP(v as number)} sx={{ color: '#38bdf8', flex: 1, minWidth: 140 }} />
        <FormControlLabel
          control={<Switch checked={coded} onChange={(e) => setCoded(e.target.checked)} color="primary" />}
          label={<Typography sx={{ fontSize: 13, fontWeight: 600 }}>3× repetition code</Typography>}
          sx={{ mr: 0 }}
        />
      </Box>
      <Typography sx={{ mt: 0.5, fontSize: 12, color: 'text.secondary' }}>
        Redundancy buys reliability: repeating each bit three times and taking the majority turns a 10% channel into a ~3% one — and cleverer codes get arbitrarily close to perfect, up to capacity.
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
