import { useRef, useState } from 'react';
import { Box, Slider, Typography, IconButton, Tooltip } from '@mui/material';
import PlayArrowRounded from '@mui/icons-material/PlayArrowRounded';
import PauseRounded from '@mui/icons-material/PauseRounded';
import RestartAltRounded from '@mui/icons-material/RestartAltRounded';
import { useRaf } from '@/hooks/useRaf';

/**
 * Maxwell's demon, finally paid off. A Szilárd engine extracts kT·ln2 of work
 * per cycle by using one bit of information — which side a single molecule is
 * on. For a century that looked like free lunch. Landauer (1961) and Bennett
 * (1982) found the bill: to run again, the demon must ERASE that bit from its
 * memory, and erasing one bit dissipates at least kT·ln2 of heat. Work out,
 * heat back in, net zero. Information is physical, and the second law holds.
 */

const KB = 1.380649e-23;
const LN2 = Math.LN2; // 0.6931471805599453
const EV = 1.602176634e-19;

const STAGES = [
  { key: 'measure', label: 'MEASURE', sub: 'demon learns the side · 1 bit stored', color: '#38bdf8' },
  { key: 'extract', label: 'EXTRACT', sub: 'gas expands · +kT ln2 of work', color: '#2dd4bf' },
  { key: 'erase', label: 'ERASE', sub: 'demon clears the bit · −kT ln2 of heat', color: '#ff9166' },
];

export function LandauerLedger() {
  const [tempK, setTempK] = useState(300);
  const [running, setRunning] = useState(true);
  const [cycles, setCycles] = useState(0);
  const [stage, setStage] = useState(0);

  const phase = useRef(0);
  const molX = useRef<SVGCircleElement>(null);
  const partition = useRef<SVGRectElement>(null);
  const memBit = useRef<SVGRectElement>(null);
  const clock = useRef(0);
  const tRef = useRef(300);
  tRef.current = tempK;

  const q = KB * tempK * LN2; // the kT ln2 quantum, in joules

  useRaf((dt) => {
    if (running) {
      phase.current += dt / 1.1; // ~1.1s per stage
      if (phase.current >= 3) {
        phase.current = 0;
        setCycles((c) => c + 1);
      }
      const st = Math.floor(phase.current) % 3;
      if (st !== stage) setStage(st);
    }
    const st = Math.floor(phase.current) % 3;
    const frac = phase.current - Math.floor(phase.current);

    // Molecule bouncing (frozen while paused so it doesn't drift mid-stage).
    if (running) clock.current += dt;
    const bx = 60 + (st === 0 ? 34 * (0.5 + 0.5 * Math.sin(clock.current * 6)) : st === 1 ? 34 + frac * 150 : 34);
    molX.current?.setAttribute('cx', String(bx));
    // Partition: drops in at measure, slides during extract, resets at erase.
    partition.current?.setAttribute('x', String(st === 1 ? 96 + frac * 150 : 96));
    partition.current?.setAttribute('opacity', st === 2 ? String(1 - frac) : '1');
    // Memory bit: lit during measure+extract, clearing during erase.
    memBit.current?.setAttribute('fill', st === 2 ? (frac > 0.5 ? '#233' : '#38bdf8') : '#38bdf8');
  });

  const reset = () => {
    phase.current = 0;
    setCycles(0);
    setStage(0);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.1fr 1fr' }, gap: 2, alignItems: 'center' }}>
        {/* Szilárd engine schematic */}
        <svg viewBox="0 0 320 170" width="100%" style={{ display: 'block' }}>
          <rect x="40" y="40" width="240" height="80" rx="6" fill="rgba(45,212,191,0.05)" stroke="#4a5560" strokeWidth="2" />
          <rect ref={partition} x="96" y="42" width="4" height="76" fill="#8fe9df" />
          <circle ref={molX} cx="70" cy="80" r="8" fill="#2dd4bf" />
          <text x="40" y="32" fill="#9aa3b8" fontSize="11" fontFamily="'JetBrains Mono Variable', monospace">one-molecule gas</text>
          {/* demon memory */}
          <text x="40" y="150" fill="#9aa3b8" fontSize="11" fontFamily="'JetBrains Mono Variable', monospace">demon memory:</text>
          <rect ref={memBit} x="150" y="139" width="16" height="16" rx="2" fill="#38bdf8" stroke="#4a5560" />
        </svg>

        {/* Stage + ledger */}
        <Box>
          <Box sx={{ display: 'flex', gap: 0.75, mb: 1.5 }}>
            {STAGES.map((s, i) => (
              <Box key={s.key} sx={{ flex: 1, p: 0.75, borderRadius: 1, textAlign: 'center', border: '1px solid', borderColor: i === stage ? s.color : 'rgba(255,255,255,0.1)', bgcolor: i === stage ? `${s.color}22` : 'transparent', transition: 'all 0.2s' }}>
                <Typography sx={{ fontFamily: "'JetBrains Mono Variable', monospace", fontSize: 10.5, color: i === stage ? s.color : 'text.secondary', letterSpacing: '0.1em' }}>{s.label}</Typography>
              </Box>
            ))}
          </Box>
          <Typography sx={{ fontSize: 12.5, color: 'text.secondary', mb: 1.5, minHeight: 34 }}>{STAGES[stage].sub}</Typography>

          <LedgerRow label="Work extracted" value={`+${(q / EV).toExponential(2)} eV`} color="#2dd4bf" />
          <LedgerRow label="Erasure cost" value={`−${(q / EV).toExponential(2)} eV`} color="#ff9166" />
          <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.15)', mt: 0.5, pt: 0.5 }}>
            <LedgerRow label="Net over the cycle" value="0" color="#eef1f8" bold />
          </Box>
          <Typography sx={{ mt: 1, fontSize: 12.5, color: '#2dd4bf', fontWeight: 600 }}>Second law: intact ✓ · {cycles} cycles run</Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1.5, flexWrap: 'wrap' }}>
        <Tooltip title={running ? 'Pause' : 'Play'}>
          <IconButton size="small" onClick={() => setRunning((r) => !r)} sx={{ color: '#eef1f8', border: '1px solid rgba(255,255,255,0.15)' }}>{running ? <PauseRounded fontSize="small" /> : <PlayArrowRounded fontSize="small" />}</IconButton>
        </Tooltip>
        <Tooltip title="Reset"><IconButton size="small" onClick={reset} sx={{ color: '#eef1f8', border: '1px solid rgba(255,255,255,0.15)' }}><RestartAltRounded fontSize="small" /></IconButton></Tooltip>
        <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>Temperature</Typography>
        <Slider value={tempK} min={4} max={600} step={1} onChange={(_, v) => setTempK(v as number)} sx={{ color: '#38bdf8', flex: 1, minWidth: 130 }} />
        <Typography sx={{ fontFamily: "'JetBrains Mono Variable', monospace", fontSize: 12.5, color: '#8fe9df', minWidth: 150, textAlign: 'right' }}>
          kT·ln2 = {q.toExponential(2)} J
        </Typography>
      </Box>
      <Typography sx={{ mt: 0.5, fontSize: 12, color: 'text.secondary' }}>
        At room temperature (300 K), erasing a single bit costs at least {(KB * 300 * LN2).toExponential(2)} joules — the Landauer limit, measured for real in 2012.
      </Typography>
    </Box>
  );
}

function LedgerRow({ label, value, color, bold }: { label: string; value: string; color: string; bold?: boolean }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', py: 0.4 }}>
      <Typography sx={{ fontSize: 13, color: 'text.secondary', fontWeight: bold ? 700 : 400 }}>{label}</Typography>
      <Typography sx={{ fontFamily: "'JetBrains Mono Variable', monospace", fontSize: bold ? 17 : 14, color, fontWeight: bold ? 700 : 400 }}>{value}</Typography>
    </Box>
  );
}
