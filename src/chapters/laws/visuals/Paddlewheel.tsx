import { useRef, useState, useCallback } from 'react';
import { Box, Slider, Typography, Button } from '@mui/material';
import RestartAltRounded from '@mui/icons-material/RestartAltRounded';
import { useRaf } from '@/hooks/useRaf';

/**
 * Joule's mechanical equivalent of heat. A falling weight turns a paddlewheel
 * that churns insulated water; friction warms it, and the work done equals the
 * heat produced at a fixed exchange rate. Crucially, the thermometer here has a
 * finite read precision, so any single run gives a scattered estimate of the
 * equivalent — only by winding the weight up and repeating do the errors average
 * out and the measured value settle near 4.18 J/cal. That convergence is exactly
 * why Joule needed hundreds of runs and a thermometer he could read to ~1/200 °F.
 */

const G = 9.81;
const H = 10; // drop height (m)
const C_WATER = 4184; // J/(kg·K) — matched to 1 cal = 4.184 J (thermochemical)
const TARGET_J = 4.184; // J/cal that the measurement should converge toward
const READ_NOISE = 0.08; // °C — thermometer read scatter per run
const T_START = 15.0; // °C

const DROP_TOP = 96;
const DROP_BOTTOM = 300;

export function Paddlewheel() {
  const [mass, setMass] = useState(10);
  const [waterMass, setWaterMass] = useState(0.2);
  const [totalWork, setTotalWork] = useState(0);
  const [measuredDT, setMeasuredDT] = useState(0);
  const [drops, setDrops] = useState(0);
  const [dropping, setDropping] = useState(false);

  const progress = useRef(0);
  const paddle = useRef(0);
  const weightEl = useRef<SVGGElement>(null);
  const cordEl = useRef<SVGLineElement>(null);
  const padEl = useRef<SVGGElement>(null);

  const workPerDrop = mass * G * H;
  const trueDTperDrop = workPerDrop / (waterMass * C_WATER);
  const started = drops > 0;

  // Measured heat (calories) from the noisy thermometer reading, and the
  // mechanical equivalent recovered from it. Converges toward 4.184 as drops add.
  const heatCal = waterMass * 1000 * measuredDT; // 1 cal warms 1 g water 1 °C
  const measuredJ = heatCal > 0 ? totalWork / heatCal : 0;
  const temp = T_START + measuredDT;

  useRaf(
    (dt) => {
      if (!dropping) return;
      progress.current = Math.min(1, progress.current + dt / 1.4);
      const y = DROP_TOP + (DROP_BOTTOM - DROP_TOP) * progress.current;
      weightEl.current?.setAttribute('transform', `translate(470 ${y})`);
      cordEl.current?.setAttribute('y2', String(y));
      paddle.current += dt * 9;
      padEl.current?.setAttribute('transform', `rotate(${(paddle.current * 180) / Math.PI} 205 214)`);
      if (progress.current >= 1) {
        setDropping(false);
        const noise = (Math.random() - 0.5) * 2 * READ_NOISE;
        setTotalWork((w) => w + workPerDrop);
        setMeasuredDT((d) => d + trueDTperDrop + noise);
        setDrops((n) => n + 1);
      }
    },
    dropping,
  );

  const release = useCallback(() => {
    if (dropping) return;
    progress.current = 0;
    // Lift the weight back to the top before it falls again (avoids a 1-frame jump).
    weightEl.current?.setAttribute('transform', `translate(470 ${DROP_TOP})`);
    cordEl.current?.setAttribute('y2', String(DROP_TOP));
    setDropping(true);
  }, [dropping]);

  const reset = useCallback(() => {
    setDropping(false);
    progress.current = 0;
    setTotalWork(0);
    setMeasuredDT(0);
    setDrops(0);
    weightEl.current?.setAttribute('transform', `translate(470 ${DROP_TOP})`);
    cordEl.current?.setAttribute('y2', String(DROP_TOP));
  }, []);

  const tMin = T_START - 0.3;
  const tMax = T_START + 9;
  const colFrac = Math.min(1, Math.max(0, (temp - tMin) / (tMax - tMin)));
  const bulbY = 300;
  const topY = 120;
  const colTop = bulbY - colFrac * (bulbY - topY);
  const jErr = measuredJ > 0 ? Math.abs(measuredJ - TARGET_J) : 0;

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.3fr 1fr' }, gap: 1.5, alignItems: 'center' }}>
        {/* apparatus */}
        <svg viewBox="0 0 560 340" width="100%" style={{ display: 'block' }}>
          <line x1="120" y1="60" x2="470" y2="60" stroke="#565c66" strokeWidth="4" />
          <circle cx="470" cy="60" r="16" fill="none" stroke="#8a8f99" strokeWidth="4" />
          <circle cx="470" cy="60" r="3" fill="#8a8f99" />
          <line ref={cordEl} x1="470" y1="76" x2="470" y2={DROP_TOP} stroke="#c9b48a" strokeWidth="2" />
          <line x1="205" y1="60" x2="205" y2="150" stroke="#c9b48a" strokeWidth="2" />
          <g ref={weightEl} transform={`translate(470 ${DROP_TOP})`}>
            <rect x="-22" y="0" width="44" height="46" rx="3" fill="#3a3f47" stroke="#8a8f99" />
            <text x="0" y="28" textAnchor="middle" fill="#d9a441" fontSize="13" fontFamily="'JetBrains Mono Variable', monospace">{mass}kg</text>
          </g>

          {/* insulated calorimeter */}
          <rect x="120" y="150" width="170" height="150" rx="8" fill="none" stroke="#6b7280" strokeWidth="7" opacity="0.6" />
          <rect x="128" y="158" width="154" height="134" rx="5" fill="rgba(87,194,224,0.10)" stroke="#57c2e0" strokeWidth="1.5" />
          <g ref={padEl}>
            {[0, 1, 2, 3].map((i) => (
              <rect key={i} x={205 - 4} y={214 - 4} width="8" height="56" rx="2" fill="#8a8f99" transform={`rotate(${i * 90} 205 214)`} />
            ))}
          </g>
          <circle cx="205" cy="214" r="7" fill="#8a8f99" />
          <line x1="205" y1="150" x2="205" y2="214" stroke="#8a8f99" strokeWidth="4" />

          {/* thermometer */}
          <rect x="332" y={topY} width="14" height={bulbY - topY} rx="7" fill="rgba(255,255,255,0.05)" stroke="#565c66" />
          <circle cx="339" cy={bulbY + 8} r="13" fill="#e0402f" />
          <rect x="335" y={colTop} width="8" height={bulbY - colTop + 8} fill="#e0402f" />
          {/* Scale ticks live on the LEFT of the tube; the live readout owns the right,
              so the two can never collide as the column moves. */}
          <text x="326" y={topY + 6} textAnchor="end" fill="#9aa3b8" fontSize="11" fontFamily="'JetBrains Mono Variable', monospace">{tMax.toFixed(0)}°</text>
          <text x="326" y={bulbY} textAnchor="end" fill="#9aa3b8" fontSize="11" fontFamily="'JetBrains Mono Variable', monospace">{tMin.toFixed(0)}°</text>
          <text x="360" y={colTop + 4} fill="#ff9166" fontSize="14" fontWeight="700" fontFamily="'JetBrains Mono Variable', monospace">{temp.toFixed(3)}°C</text>
        </svg>

        {/* ledger */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
          <Readout label={`Drops · N`} value={`${drops}`} color="#eef1f8" />
          <Readout label="Total work · N·m·g·h" value={`${totalWork.toFixed(0)} J`} color="#f5b73c" />
          <Readout label="Heat measured" value={`${heatCal.toFixed(1)} cal`} color="#57c2e0" />
          <Box sx={{ mt: 0.5, p: 1.25, borderRadius: 1.5, border: '1px dashed rgba(245,183,60,0.4)' }}>
            <Typography sx={{ fontSize: 11.5, color: 'text.secondary', mb: 0.5 }}>Mechanical equivalent, measured</Typography>
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
              <Typography sx={{ fontFamily: "'JetBrains Mono Variable', monospace", fontSize: 24, color: jErr < 0.03 ? '#5ec27f' : '#ffd27a' }}>
                {measuredJ > 0 ? measuredJ.toFixed(3) : '—'}
              </Typography>
              <Typography sx={{ fontSize: 12.5, color: 'text.secondary' }}>J/cal · target {TARGET_J}</Typography>
            </Box>
            <Typography sx={{ fontSize: 11.5, color: 'text.secondary', mt: 0.5 }}>
              {drops === 0 ? 'Release the weight to begin measuring.' : drops < 4 ? 'One run scatters — keep dropping.' : jErr < 0.03 ? 'Settled: the errors have averaged out.' : 'Converging as the runs accumulate…'}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Each slider gets its own labelled row (they stack on phones), so a wrapped
          row can never leave a label orphaned beside the wrong control. */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, columnGap: 3, rowGap: 0.25, mt: 1.5, px: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Typography sx={{ fontSize: 12.5, color: 'text.secondary', minWidth: 86, fontFamily: "'JetBrains Mono Variable', monospace" }}>Weight {mass}kg</Typography>
          <Slider value={mass} min={5} max={40} step={1} onChange={(_, v) => setMass(v as number)} sx={{ color: '#8a8f99', flex: 1 }} disabled={started || dropping} />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Typography sx={{ fontSize: 12.5, color: 'text.secondary', minWidth: 86, fontFamily: "'JetBrains Mono Variable', monospace" }}>Water {(waterMass * 1000).toFixed(0)}g</Typography>
          <Slider value={waterMass} min={0.05} max={0.5} step={0.01} onChange={(_, v) => setWaterMass(v as number)} sx={{ color: '#57c2e0', flex: 1 }} disabled={started || dropping} />
        </Box>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 1, px: 1, flexWrap: 'wrap' }}>
        <Button variant="contained" onClick={release} disabled={dropping} sx={{ bgcolor: '#f5b73c', color: '#0a090c', '&:hover': { bgcolor: '#ffd98a' } }}>
          {started ? 'Drop again' : 'Release weight'}
        </Button>
        <Button variant="text" onClick={reset} startIcon={<RestartAltRounded />} sx={{ color: 'text.secondary' }}>Reset</Button>
      </Box>
    </Box>
  );
}

function Readout({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '1px solid rgba(255,255,255,0.08)', pb: 0.75 }}>
      <Typography sx={{ fontSize: 12.5, color: 'text.secondary' }}>{label}</Typography>
      <Typography sx={{ fontFamily: "'JetBrains Mono Variable', monospace", fontSize: 16, color }}>{value}</Typography>
    </Box>
  );
}
