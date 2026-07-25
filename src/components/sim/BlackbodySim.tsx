import { useMemo, useState } from 'react';
import { Box, Slider, Typography } from '@mui/material';
import {
  planckRadiance,
  rayleighJeans,
  wienPeak,
  catastropheRatio,
  blackbodyColor,
  fmtWavelength,
  sci,
} from './blackbodyPhysics';

const LAM_MIN_NM = 50;
const LAM_MAX_NM = 50000; // three decades: shows both the short-wavelength
// catastrophe and genuine long-wavelength agreement in one honest window
const VIS_MIN_NM = 380;
const VIS_MAX_NM = 780;
const PROBE_NM = 200; // fixed UV probe for the "how big is the catastrophe" readout
const N_SAMPLES = 160;

const CHART_W = 640;
const CHART_H = 260;
const PAD = { l: 8, r: 8, t: 14, b: 30 };
const PLOT_W = CHART_W - PAD.l - PAD.r;
const PLOT_H = CHART_H - PAD.t - PAD.b;

const logMin = Math.log10(LAM_MIN_NM);
const logMax = Math.log10(LAM_MAX_NM);
const xOf = (nm: number) => PAD.l + ((Math.log10(nm) - logMin) / (logMax - logMin)) * PLOT_W;

function describeColor(T: number): string {
  if (T < 1800) return 'dull red — barely glowing';
  if (T < 2600) return 'deep orange, like a stove element';
  if (T < 3500) return 'warm orange-white, like an old incandescent bulb';
  if (T < 5000) return 'yellow-white';
  if (T < 6800) return 'white, close to daylight';
  if (T < 10000) return 'cool white with a blue cast';
  return 'blue-white, like a hot young star';
}

/**
 * The ultraviolet catastrophe, made playable. One curve is the real Planck
 * spectrum at the chosen temperature, with h scaled by the reader's slider
 * (1 = the actual universe). The second is the fixed classical prediction
 * (Rayleigh–Jeans) at the same temperature — no h in it at all, because
 * classical physics never needed one. Drag h to 0 and the quantum curve is
 * mathematically forced to become the classical one: the same equation, in
 * the limit where energy can be divided as finely as you like, is the
 * broken 1900 theory. The color swatch shows what the object actually
 * looks like, computed from the true (h=1) curve regardless of the slider.
 */
export function BlackbodySim() {
  const [T, setT] = useState(3000);
  const [hPct, setHPct] = useState(100);
  const hScale = hPct / 100;

  const { planckPath, rjPath, yMax, visX0, visX1 } = useMemo(() => {
    const peakNm = wienPeak(T) * 1e9;
    const peakVal = planckRadiance(peakNm * 1e-9, T, 1);
    const yMax = peakVal * 1.18;
    const yOf = (v: number) => PAD.t + PLOT_H - Math.min(1, Math.max(0, v / yMax)) * PLOT_H;

    const pPts: string[] = [];
    const rPts: string[] = [];
    for (let i = 0; i <= N_SAMPLES; i++) {
      const logNm = logMin + ((logMax - logMin) * i) / N_SAMPLES;
      const nm = Math.pow(10, logNm);
      const lam = nm * 1e-9;
      const x = xOf(nm);
      const pv = planckRadiance(lam, T, hScale);
      const rv = rayleighJeans(lam, T);
      pPts.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${yOf(pv).toFixed(2)}`);
      rPts.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${yOf(rv).toFixed(2)}`);
    }
    return {
      planckPath: pPts.join(' '),
      rjPath: rPts.join(' '),
      yMax,
      visX0: xOf(VIS_MIN_NM),
      visX1: xOf(VIS_MAX_NM),
    };
  }, [T, hScale]);

  const peakNm = wienPeak(T) * 1e9;
  const ratio = catastropheRatio(PROBE_NM * 1e-9, T);
  const [r, g, b] = useMemo(() => blackbodyColor(T), [T]);
  const swatch = `rgb(${r},${g},${b})`;
  const melted = hPct <= 2;

  return (
    <Box sx={{ width: '100%', height: '100%', minHeight: 440, display: 'flex', flexDirection: 'column', justifyContent: 'center', p: { xs: 2, md: 3 }, gap: 1.5 }}>
      <Box sx={{ bgcolor: 'rgba(8,10,15,0.6)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 2, p: 1.5 }}>
        <svg viewBox={`0 0 ${CHART_W} ${CHART_H}`} width="100%" style={{ display: 'block', overflow: 'visible' }}>
          {/* visible-light band */}
          <rect x={visX0} y={PAD.t} width={visX1 - visX0} height={PLOT_H} fill="#ffffff" opacity="0.05" />
          <text x={(visX0 + visX1) / 2} y={PAD.t - 4} textAnchor="middle" fill="#9aa3b8" fontSize="9.5">visible</text>

          {/* Rayleigh–Jeans reference (dashed, cool) */}
          <path d={rjPath} fill="none" stroke="#46b7ff" strokeWidth="2" strokeDasharray="5 4" opacity="0.85" />
          {/* Planck curve (solid, hot) — this is the one the h-slider bends */}
          <path d={planckPath} fill="none" stroke={melted ? '#46b7ff' : '#ff5a3c'} strokeWidth="2.5" />

          {/* frame */}
          <rect x={PAD.l} y={PAD.t} width={PLOT_W} height={PLOT_H} fill="none" stroke="rgba(255,255,255,0.14)" />
          {[50, 200, 1000, 5000, 20000].map((nm) => (
            <g key={nm}>
              <line x1={xOf(nm)} y1={PAD.t} x2={xOf(nm)} y2={PAD.t + PLOT_H} stroke="rgba(255,255,255,0.06)" />
              <text x={xOf(nm)} y={CHART_H - 8} textAnchor="middle" fill="#9aa3b8" fontSize="10">
                {nm >= 1000 ? `${nm / 1000}μm` : `${nm}nm`}
              </text>
            </g>
          ))}
          <text x={xOf(PROBE_NM)} y={PAD.t + 11} textAnchor="middle" fill="#ffd27a" fontSize="9">↓ UV probe</text>
        </svg>
        <Box sx={{ display: 'flex', gap: 2.5, mt: 0.5, px: 0.5 }}>
          <Legend color="#ff5a3c" dash={false} label="Planck (quantum)" />
          <Legend color="#46b7ff" dash label="Rayleigh–Jeans (classical)" />
        </Box>
      </Box>

      {/* color swatch + peak */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 1 }}>
        <Box sx={{ width: 46, height: 46, borderRadius: '50%', bgcolor: swatch, boxShadow: `0 0 22px ${swatch}, inset 0 0 8px rgba(255,255,255,0.25)`, flexShrink: 0 }} />
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontSize: 13.5, color: 'text.primary', lineHeight: 1.3 }}>{describeColor(T)}</Typography>
          <Typography sx={{ fontFamily: "'JetBrains Mono Variable', monospace", fontSize: 11, color: 'text.secondary' }}>
            peaks at {fmtWavelength(peakNm * 1e-9)} · Wien's law, λ·T = 2.898 mm·K
          </Typography>
        </Box>
      </Box>

      <Box sx={{ px: 1 }}>
        <SliderRow label="Temperature" value={T} min={1000} max={15000} step={50} color="#ff9166" suffix="K" onChange={setT} />
        <SliderRow label="Planck's constant h" value={hPct} min={0} max={100} step={1} color={melted ? '#46b7ff' : '#ffd27a'} suffix="%" onChange={setHPct} />
        <Typography sx={{ fontSize: 12, color: melted ? '#7ad3ff' : 'text.secondary', mt: 0.5, lineHeight: 1.4 }}>
          {melted
            ? 'h = 0: the quantum curve has become the classical one exactly — a universe with no smallest packet of energy really does radiate infinite ultraviolet.'
            : 'Drag h toward 0 and watch reality bend to meet the broken classical prediction.'}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', px: 1 }}>
        <Readout label={`Classical excess @ ${PROBE_NM}nm`} value={`${sci(ratio)}×`} color="#ff9166" />
        <Readout label="Peak wavelength" value={fmtWavelength(peakNm * 1e-9)} color="#7ad3ff" />
      </Box>
    </Box>
  );
}

function Legend({ color, dash, label }: { color: string; dash: boolean; label: string }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
      <svg width="18" height="8"><line x1="0" y1="4" x2="18" y2="4" stroke={color} strokeWidth="2.5" strokeDasharray={dash ? '4 3' : undefined} /></svg>
      <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>{label}</Typography>
    </Box>
  );
}

function Readout({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <Box>
      <Typography variant="overline" sx={{ color: 'text.secondary', display: 'block', lineHeight: 1.2 }}>{label}</Typography>
      <Typography sx={{ fontFamily: "'JetBrains Mono Variable', monospace", fontSize: 16, color }}>{value}</Typography>
    </Box>
  );
}

function SliderRow({ label, value, min, max, step, color, suffix, onChange }: { label: string; value: number; min: number; max: number; step: number; color: string; suffix: string; onChange: (v: number) => void }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      <Typography sx={{ fontSize: 12.5, color: 'text.secondary', minWidth: 132, fontFamily: "'JetBrains Mono Variable', monospace" }}>
        {label} {value.toLocaleString()}{suffix}
      </Typography>
      <Slider value={value} min={min} max={max} step={step} onChange={(_, v) => onChange(v as number)} sx={{ color }} />
    </Box>
  );
}
