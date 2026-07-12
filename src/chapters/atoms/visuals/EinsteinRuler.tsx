import { useCallback, useEffect, useRef, useState } from 'react';
import { Box, Slider, Typography, Button, ToggleButtonGroup, ToggleButton, IconButton, Tooltip } from '@mui/material';
import PauseRounded from '@mui/icons-material/PauseRounded';
import PlayArrowRounded from '@mui/icons-material/PlayArrowRounded';
import ReplayRounded from '@mui/icons-material/ReplayRounded';
import { useRaf } from '@/hooks/useRaf';

/**
 * Einstein's ruler. You cannot clock a Brownian particle's velocity — the finer
 * you sample, the faster it seems, without limit. Einstein's 1905 move was to
 * measure DISPLACEMENT instead: per axis, ⟨x²⟩ grows as 2Dt, a dead-straight
 * line whose slope contains D = kT/(6πηr) — and therefore Avogadro's number.
 * An ensemble of grains diffuses here in real units (μm, seconds); the chart
 * accumulates ⟨x²⟩ live and recovers N_A from the measured slope — the program
 * Perrin carried out.
 */

const KB = 1.380649e-23; // J/K
const R_GAS = 8.314462618; // J/(mol·K)
const ETA = 1.0e-3; // Pa·s (water near 20 °C; held fixed)
const NA_TRUE = 6.02214076e23;
const N_WALKERS = 420;
const T_MAX = 60; // simulated seconds
const TIME_SCALE = 4; // sim seconds per real second
const SAMPLE_DT = 0.5; // sim s between MSD samples

const CLOUD = 360; // canvas px
const VIEW_UM = 27; // half-extent of the cloud view, μm

const PLOT = { x0: 62, x1: 458, y0: 26, y1: 286 };
const CHART_W = 480;
const CHART_H = 330;

/** Stokes–Einstein diffusion coefficient in μm²/s. */
function diffusion(tempK: number, radiusUm: number): number {
  return ((KB * tempK) / (6 * Math.PI * ETA * radiusUm * 1e-6)) * 1e12;
}

export function EinsteinRuler() {
  const [tempC, setTempC] = useState(20);
  const [radius, setRadius] = useState(0.5);
  const [running, setRunning] = useState(true);
  const [view, setView] = useState({ t: 0, na: 0, done: false });

  const tempK = tempC + 273.15;
  const D = diffusion(tempK, radius);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lineRef = useRef<SVGPolylineElement>(null);
  const xs = useRef(new Float64Array(N_WALKERS));
  const ys = useRef(new Float64Array(N_WALKERS));
  const tSim = useRef(0);
  const points = useRef<string[]>([]);
  const fitNum = useRef(0);
  const fitDen = useRef(0);
  const sampleAcc = useRef(0);
  const uiAcc = useRef(0);
  const yMaxRef = useRef(2 * D * T_MAX * 1.5);
  const gaussSpare = useRef<number | null>(null);

  const gauss = () => {
    if (gaussSpare.current !== null) {
      const v = gaussSpare.current;
      gaussSpare.current = null;
      return v;
    }
    let u = 0, v = 0, s = 0;
    do {
      u = Math.random() * 2 - 1;
      v = Math.random() * 2 - 1;
      s = u * u + v * v;
    } while (s === 0 || s >= 1);
    const f = Math.sqrt((-2 * Math.log(s)) / s);
    gaussSpare.current = v * f;
    return u * f;
  };

  const reset = useCallback(() => {
    xs.current.fill(0);
    ys.current.fill(0);
    tSim.current = 0;
    points.current = [];
    fitNum.current = 0;
    fitDen.current = 0;
    sampleAcc.current = 0;
    yMaxRef.current = 2 * diffusion(tempC + 273.15, radius) * T_MAX * 1.5;
    lineRef.current?.setAttribute('points', '');
    setView({ t: 0, na: 0, done: false });
    setRunning(true);
  }, [tempC, radius]);

  // New parameters → a fresh experiment (the old slope no longer applies).
  useEffect(() => {
    reset();
  }, [reset]);

  const X = (t: number) => PLOT.x0 + (t / T_MAX) * (PLOT.x1 - PLOT.x0);
  const Y = (m: number) => PLOT.y1 - (m / yMaxRef.current) * (PLOT.y1 - PLOT.y0);

  const drawCloud = () => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    const c = CLOUD / 2;
    const scale = c / VIEW_UM;

    ctx.fillStyle = '#0a0a14';
    ctx.fillRect(0, 0, CLOUD, CLOUD);

    // Origin cross.
    ctx.strokeStyle = 'rgba(255,255,255,0.18)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(c - 7, c); ctx.lineTo(c + 7, c);
    ctx.moveTo(c, c - 7); ctx.lineTo(c, c + 7);
    ctx.stroke();

    ctx.fillStyle = 'rgba(79,214,192,0.6)';
    ctx.beginPath();
    for (let i = 0; i < N_WALKERS; i++) {
      const px = c + xs.current[i] * scale;
      const py = c + ys.current[i] * scale;
      if (px < -2 || px > CLOUD + 2 || py < -2 || py > CLOUD + 2) continue;
      ctx.moveTo(px + 1.6, py);
      ctx.arc(px, py, 1.6, 0, Math.PI * 2);
    }
    ctx.fill();

    // Scale bar: 10 μm.
    const bar = 10 * scale;
    ctx.strokeStyle = 'rgba(238,241,248,0.7)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(14, CLOUD - 16);
    ctx.lineTo(14 + bar, CLOUD - 16);
    ctx.stroke();
    ctx.fillStyle = 'rgba(238,241,248,0.7)';
    ctx.font = '11px "JetBrains Mono Variable", monospace';
    ctx.fillText('10 μm', 16, CLOUD - 24);
  };

  useRaf((dt) => {
    if (running && tSim.current < T_MAX) {
      const dts = Math.min(dt, 0.05) * TIME_SCALE;
      const sig = Math.sqrt(2 * D * dts);
      for (let i = 0; i < N_WALKERS; i++) {
        xs.current[i] += sig * gauss();
        ys.current[i] += sig * gauss();
      }
      tSim.current += dts;
      sampleAcc.current += dts;

      if (sampleAcc.current >= SAMPLE_DT) {
        sampleAcc.current = 0;
        let sum = 0;
        for (let i = 0; i < N_WALKERS; i++) sum += xs.current[i] * xs.current[i];
        const msd = sum / N_WALKERS;
        const t = tSim.current;
        points.current.push(`${X(t).toFixed(1)},${Y(msd).toFixed(1)}`);
        lineRef.current?.setAttribute('points', points.current.join(' '));
        fitNum.current += t * msd;
        fitDen.current += t * t;
      }
      if (tSim.current >= T_MAX) setRunning(false);
    }

    drawCloud();

    uiAcc.current += dt;
    if (uiAcc.current >= 0.25) {
      uiAcc.current = 0;
      const done = tSim.current >= T_MAX;
      let na = 0;
      if (fitDen.current > 0 && tSim.current > 8) {
        const slope = fitNum.current / fitDen.current; // μm²/s
        const dMeasSI = (slope / 2) * 1e-12; // m²/s
        na = (R_GAS * tempK) / (6 * Math.PI * ETA * radius * 1e-6 * dMeasSI);
      }
      setView((v) => (v.t === tSim.current && v.done === done && v.na === na ? v : { t: tSim.current, na, done }));
    }
  });

  const vApp = (delta: number) => Math.sqrt((4 * D) / (Math.PI * delta));
  const refEndY = Y(2 * D * T_MAX);

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '340px 1fr' }, gap: 1.5, alignItems: 'center' }}>
        {/* Diffusing ensemble */}
        <Box>
          <canvas
            ref={canvasRef}
            width={CLOUD}
            height={CLOUD}
            style={{ width: '100%', maxWidth: 340, aspectRatio: '1 / 1', display: 'block', margin: '0 auto', borderRadius: 12, border: '1px solid rgba(154,123,255,0.25)' }}
          />
          <Typography sx={{ mt: 0.75, textAlign: 'center', fontSize: 11.5, color: 'text.secondary', fontFamily: "'JetBrains Mono Variable', monospace" }}>
            {N_WALKERS} grains · released at the origin
          </Typography>
        </Box>

        {/* MSD chart */}
        <Box>
          <svg viewBox={`0 0 ${CHART_W} ${CHART_H}`} width="100%" style={{ display: 'block' }}>
            <line x1={PLOT.x0} y1={PLOT.y0} x2={PLOT.x0} y2={PLOT.y1} stroke="rgba(255,255,255,0.28)" />
            <line x1={PLOT.x0} y1={PLOT.y1} x2={PLOT.x1} y2={PLOT.y1} stroke="rgba(255,255,255,0.28)" />
            <text x={PLOT.x0 - 8} y={PLOT.y0 + 4} fill="#9aa3b8" fontSize="12" textAnchor="end">⟨x²⟩</text>
            <text x={PLOT.x0 - 8} y={PLOT.y0 + 18} fill="#6b7280" fontSize="10" textAnchor="end">μm² · per axis</text>
            <text x={PLOT.x1} y={PLOT.y1 + 18} fill="#9aa3b8" fontSize="12" textAnchor="end">t (s)</text>
            {[15, 30, 45, 60].map((t) => (
              <text key={t} x={X(t)} y={PLOT.y1 + 16} fill="#6b7280" fontSize="10" textAnchor="middle">{t}</text>
            ))}

            {/* Einstein's prediction: slope 2D. */}
            <line x1={X(0)} y1={Y(0)} x2={X(T_MAX)} y2={refEndY} stroke="#9a7bff" strokeWidth="2" strokeDasharray="6 5" opacity="0.8" />
            <text x={X(T_MAX) - 4} y={refEndY - 8} fill="#c2adff" fontSize="12" textAnchor="end" fontFamily="'Fraunces Variable', serif" fontStyle="italic">
              ⟨x²⟩ = 2Dt
            </text>

            {/* Measured ensemble MSD. */}
            <polyline ref={lineRef} fill="none" stroke="#eef1f8" strokeWidth="2.25" strokeLinejoin="round" />
          </svg>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', px: 1, mt: 0.5 }}>
            <Stat label="Diffusion · D = kT/6πηr" value={`${D.toFixed(2)} μm²/s`} color="#c2adff" />
            <Stat label="Apparent speed (a mirage)" value={`${vApp(2).toFixed(2)} μm/s @ Δt=2s · ${vApp(0.25).toFixed(2)} @ ¼s`} color="#9aa3b8" />
            <Stat
              label="N_A from the slope"
              value={view.na > 0 ? `${(view.na / 1e23).toFixed(2)} ×10²³ (true 6.02)` : 'measuring…'}
              color={view.na > 0 && Math.abs(view.na - NA_TRUE) / NA_TRUE < 0.08 ? '#4fd6c0' : '#ffd27a'}
            />
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1.5, px: 1, flexWrap: 'wrap' }}>
        <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>Water</Typography>
        <Slider value={tempC} min={0} max={60} step={1} onChange={(_, v) => setTempC(v as number)} sx={{ color: '#9a7bff', flex: 1, minWidth: 130 }} />
        <Typography sx={{ fontFamily: "'JetBrains Mono Variable', monospace", fontSize: 13, color: '#c2adff', minWidth: 44 }}>{tempC} °C</Typography>
        <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>Grain</Typography>
        <ToggleButtonGroup size="small" exclusive value={radius} onChange={(_, v) => v && setRadius(v)}>
          {[0.25, 0.5, 1].map((r) => (
            <ToggleButton key={r} value={r} sx={{ py: 0.25, px: 1.25, fontFamily: "'JetBrains Mono Variable', monospace", fontSize: 12 }}>
              {r} μm
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
        {view.done ? (
          <Button size="small" variant="outlined" startIcon={<ReplayRounded />} onClick={reset} sx={{ color: '#c2adff', borderColor: 'rgba(154,123,255,0.5)' }}>
            Run again
          </Button>
        ) : (
          <Tooltip title={running ? 'Pause' : 'Play'}>
            <IconButton size="small" onClick={() => setRunning((r) => !r)} sx={{ color: '#eef1f8', border: '1px solid rgba(255,255,255,0.15)' }}>
              {running ? <PauseRounded fontSize="small" /> : <PlayArrowRounded fontSize="small" />}
            </IconButton>
          </Tooltip>
        )}
        <Typography sx={{ fontFamily: "'JetBrains Mono Variable', monospace", fontSize: 12.5, color: 'text.secondary', ml: 'auto' }}>
          t = {Math.min(view.t, T_MAX).toFixed(0)} s / {T_MAX} s
        </Typography>
      </Box>
      <Typography sx={{ mt: 1, px: 1, fontSize: 12, color: 'text.secondary' }}>
        Chase velocity and it diverges — sample twice as finely and the grain “moves” √2× faster. Displacement² is the honest ruler.
      </Typography>
    </Box>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <Box sx={{ minWidth: 150 }}>
      <Typography variant="overline" sx={{ color: 'text.secondary', display: 'block', lineHeight: 1.2 }}>{label}</Typography>
      <Typography sx={{ fontFamily: "'JetBrains Mono Variable', monospace", fontSize: 14.5, color }}>{value}</Typography>
    </Box>
  );
}
