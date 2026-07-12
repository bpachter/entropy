import { useMemo, useState } from 'react';
import { Box, Slider, Typography, ToggleButtonGroup, ToggleButton, Button } from '@mui/material';
import CasinoRounded from '@mui/icons-material/CasinoRounded';

/**
 * Schrödinger's aperiodic crystal. A regular crystal repeats one motif forever —
 * orderly, stable, and almost empty of information: to describe it you need only
 * the motif and "repeat." An APERIODIC crystal of the same size, its units in no
 * repeating order, can be arranged in kᴸ ways — an astronomically larger library.
 * That, Schrödinger argued in 1943, is what a gene must be: a stable molecule
 * whose non-repeating sequence is a "code-script" for the whole organism. He was
 * right about the principle; the four-letter carrier, DNA, was still ten years off.
 */

const K = 4;
const SYMBOLS = ['#5ec27f', '#b6d95a', '#4fd6c0', '#e0b15a'];
const BASES = ['A', 'C', 'G', 'T']; // the four DNA bases, once anyone learned to read them
const MOTIF = [0, 2, 1, 3]; // the periodic repeat unit
const VISIBLE = 56;
const MAXL = 260;
const LOG10 = Math.log(10);
const LOG2 = Math.log(2);

function sci(log10val: number): string {
  const exp = Math.floor(log10val);
  const mant = Math.pow(10, log10val - exp);
  if (exp < 4) return Math.round(Math.pow(10, log10val)).toLocaleString();
  return `${mant.toFixed(1)} × 10^${exp}`;
}

export function CodeScript() {
  const [L, setL] = useState(120);
  const [mode, setMode] = useState<'periodic' | 'aperiodic'>('aperiodic');
  const [seed, setSeed] = useState(1);

  // A fixed pseudo-random sequence (regenerated on demand).
  const random = useMemo(() => {
    let s = seed * 2654435761;
    const out = new Uint8Array(MAXL);
    for (let i = 0; i < MAXL; i++) {
      s = (s ^ (s << 13)) >>> 0;
      s = (s ^ (s >>> 17)) >>> 0;
      s = (s ^ (s << 5)) >>> 0;
      out[i] = s % K;
    }
    return out;
  }, [seed]);

  const cell = (i: number) => (mode === 'periodic' ? MOTIF[i % MOTIF.length] : random[i]);

  const shown = Math.min(L, VISIBLE);
  const cellW = 560 / VISIBLE;

  // Information content.
  const bitsPerSymbol = Math.log(K) / LOG2; // 2 bits for k=4
  const arrangementsLog10 = mode === 'aperiodic' ? (L * Math.log(K)) / LOG10 : (MOTIF.length * Math.log(K)) / LOG10;
  const infoBits = mode === 'aperiodic' ? L * bitsPerSymbol : MOTIF.length * bitsPerSymbol + Math.log(L) / LOG2;

  return (
    <Box sx={{ width: '100%' }}>
      <svg viewBox="0 0 580 92" width="100%" style={{ display: 'block' }}>
        {Array.from({ length: shown }).map((_, i) => (
          <g key={i}>
            <rect x={10 + i * cellW} y={20} width={cellW - 2} height={48} rx={3} fill={SYMBOLS[cell(i)]} opacity={0.92} />
            {cellW >= 15 && (
              <text x={10 + i * cellW + (cellW - 2) / 2} y={50} textAnchor="middle" fill="#04140b" fontSize={Math.min(15, cellW * 0.7)} fontWeight="700" fontFamily="'JetBrains Mono Variable', monospace">
                {BASES[cell(i)]}
              </text>
            )}
          </g>
        ))}
        {/* Anchored to the top-right corner (inside the viewBox), where it can never clip. */}
        {L > VISIBLE && (
          <text x="570" y="14" textAnchor="end" fill="#9aa3b8" fontSize="12" fontFamily="'JetBrains Mono Variable', monospace">
            +{(L - VISIBLE).toLocaleString()} more
          </text>
        )}
        <text x="10" y="14" fill="#a7e0b3" fontSize="11" fontFamily="'JetBrains Mono Variable', monospace">
          {mode === 'periodic' ? 'one motif, repeated — a wallpaper' : 'no repeat — a message'}
        </text>
      </svg>

      <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', mt: 0.5 }}>
        {BASES.map((b, i) => (
          <Box key={b} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 11, height: 11, borderRadius: '2px', bgcolor: SYMBOLS[i] }} />
            <Typography sx={{ fontFamily: "'JetBrains Mono Variable', monospace", fontSize: 11.5, color: 'text.secondary' }}>{b}</Typography>
          </Box>
        ))}
      </Box>

      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', px: 1, mt: 1 }}>
        <Stat label="Possible arrangements · kᴸ" value={sci(arrangementsLog10)} color="#5ec27f" />
        <Stat label="Information" value={`${infoBits < 1000 ? Math.round(infoBits) : sci(Math.log(infoBits) / LOG10)} bits`} color="#4fd6c0" />
        <Stat label="Verdict" value={mode === 'periodic' ? 'says almost nothing' : 'a whole library'} color={mode === 'periodic' ? '#9aa3b8' : '#b6d95a'} />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1.5, px: 1, flexWrap: 'wrap' }}>
        <ToggleButtonGroup size="small" exclusive value={mode} onChange={(_, v) => v && setMode(v)}>
          <ToggleButton value="periodic" sx={{ py: 0.25, px: 1.5, fontSize: 12.5 }}>Periodic</ToggleButton>
          <ToggleButton value="aperiodic" sx={{ py: 0.25, px: 1.5, fontSize: 12.5 }}>Aperiodic</ToggleButton>
        </ToggleButtonGroup>
        {mode === 'aperiodic' && (
          <Button size="small" variant="outlined" startIcon={<CasinoRounded />} onClick={() => setSeed((s) => s + 1)} sx={{ color: '#a7e0b3', borderColor: 'rgba(94,194,127,0.5)' }}>
            New sequence
          </Button>
        )}
        <Typography sx={{ fontSize: 13, color: 'text.secondary', ml: { md: 'auto' } }}>Units · L</Typography>
        <Slider value={L} min={8} max={MAXL} step={1} onChange={(_, v) => setL(v as number)} sx={{ color: '#5ec27f', flex: 1, minWidth: 130, maxWidth: 260 }} />
        <Typography sx={{ fontFamily: "'JetBrains Mono Variable', monospace", fontSize: 13, color: '#a7e0b3', minWidth: 34 }}>{L}</Typography>
      </Box>
      <Typography sx={{ mt: 1, px: 1, fontSize: 12, color: 'text.secondary' }}>
        Four symbols — as it happens, the number DNA would turn out to use. Order and information are not the same thing: the richest code is the one that never repeats.
      </Typography>
    </Box>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <Box sx={{ minWidth: 150 }}>
      <Typography variant="overline" sx={{ color: 'text.secondary', display: 'block', lineHeight: 1.2 }}>{label}</Typography>
      <Typography sx={{ fontFamily: "'JetBrains Mono Variable', monospace", fontSize: 15, color }}>{value}</Typography>
    </Box>
  );
}
