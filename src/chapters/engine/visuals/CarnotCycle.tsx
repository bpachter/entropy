import { useMemo, useRef, useState } from 'react';
import { Box, Slider, Typography, IconButton } from '@mui/material';
import PlayArrowRounded from '@mui/icons-material/PlayArrowRounded';
import PauseRounded from '@mui/icons-material/PauseRounded';
import { useRaf } from '@/hooks/useRaf';

/**
 * The idealised Carnot cycle. Left: the P–V loop, its four reversible strokes.
 * Right: the cylinder those strokes drive, in contact with the hot reservoir
 * during isothermal expansion and the cold one during isothermal compression.
 * The two temperatures alone fix the best-possible efficiency, η = 1 − T꜀/Tₕ —
 * no working substance or cleverness can beat it.
 */

const G = 1.4;
const VA = 1;
const VB = 1.7;
const PLOT = { x0: 64, x1: 400, y0: 30, y1: 300 };

const STROKES = [
  { name: 'Isothermal expansion', sub: 'heat in from Tₕ', hot: true, cold: false },
  { name: 'Adiabatic expansion', sub: 'insulated · cools Tₕ→T꜀', hot: false, cold: false },
  { name: 'Isothermal compression', sub: 'heat out to T꜀', hot: false, cold: true },
  { name: 'Adiabatic compression', sub: 'insulated · warms T꜀→Tₕ', hot: false, cold: false },
];

function buildModel(th: number, tc: number) {
  const k = Math.pow(th / tc, 1 / (G - 1));
  const VC = VB * k;
  const VD = VA * k;
  const PB = th / VB;
  const PD = tc / VD;
  const sample = (v0: number, v1: number, fn: (v: number) => number, n = 28) => {
    const out: [number, number][] = [];
    for (let i = 0; i <= n; i++) {
      const v = v0 + ((v1 - v0) * i) / n;
      out.push([v, fn(v)]);
    }
    return out;
  };
  const all = [
    ...sample(VA, VB, (v) => th / v),
    ...sample(VB, VC, (v) => PB * Math.pow(VB / v, G)),
    ...sample(VC, VD, (v) => tc / v),
    ...sample(VD, VA, (v) => PD * Math.pow(VD / v, G)),
  ];
  const Vs = all.map((p) => p[0]);
  const Ps = all.map((p) => p[1]);
  return { VA, VB, VC, VD, PB, PD, all, minV: Math.min(...Vs), maxV: Math.max(...Vs), minP: Math.min(...Ps), maxP: Math.max(...Ps) };
}

export function CarnotCycle() {
  const [th, setTh] = useState(620);
  const [tc, setTc] = useState(360);
  const [running, setRunning] = useState(true);
  const [seg, setSeg] = useState(0);

  const m = useMemo(() => buildModel(th, tc), [th, tc]);
  const X = (v: number) => PLOT.x0 + ((v - m.minV) / (m.maxV - m.minV)) * (PLOT.x1 - PLOT.x0);
  const Y = (p: number) => PLOT.y1 - ((p - m.minP) / (m.maxP - m.minP)) * (PLOT.y1 - PLOT.y0);
  const loopPath = useMemo(() => 'M' + m.all.map(([v, p]) => `${X(v).toFixed(1)},${Y(p).toFixed(1)}`).join(' L') + ' Z', [m]);

  const s = useRef(0);
  const marker = useRef<SVGCircleElement>(null);
  const gas = useRef<SVGRectElement>(null);
  const pistonR = useRef<SVGGElement>(null);
  const segAccum = useRef(0);

  const CYL = { x: 470, top: 60, bottom: 300, w: 96 };

  useRaf((dt) => {
    s.current = (s.current + dt * 0.14) % 1;
    const four = s.current * 4;
    const si = Math.floor(four) % 4;
    const t = four - Math.floor(four);
    const ends = [
      [m.VA, m.VB],
      [m.VB, m.VC],
      [m.VC, m.VD],
      [m.VD, m.VA],
    ][si];
    const v = ends[0] + (ends[1] - ends[0]) * t;
    const P =
      si === 0 ? th / v : si === 1 ? m.PB * Math.pow(m.VB / v, G) : si === 2 ? tc / v : m.PD * Math.pow(m.VD / v, G);
    const T = si === 0 ? th : si === 1 ? th + (tc - th) * t : si === 2 ? tc : tc + (th - tc) * t;

    marker.current?.setAttribute('cx', String(X(v)));
    marker.current?.setAttribute('cy', String(Y(P)));

    // Piston: gas column height tracks volume.
    const frac = (v - m.minV) / (m.maxV - m.minV);
    const h = 40 + frac * (CYL.bottom - CYL.top - 60);
    const gy = CYL.bottom - h;
    gas.current?.setAttribute('y', String(gy));
    gas.current?.setAttribute('height', String(h));
    gas.current?.setAttribute('fill', tempColor(T, tc, th));
    pistonR.current?.setAttribute('transform', `translate(0 ${gy - 18})`);

    if ((segAccum.current += dt) > 0.1) {
      segAccum.current = 0;
      if (si !== seg) setSeg(si);
    }
  }, running);

  const eff = Math.round((1 - tc / th) * 100);
  const stroke = STROKES[seg];

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderRadius: 3, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.09)', background: 'radial-gradient(120% 130% at 30% 10%, #15100b, #0b0806)', p: { xs: 1, md: 1.5 } }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.35fr 1fr' }, gap: 1 }}>
          {/* P–V diagram */}
          <svg viewBox="0 0 430 330" width="100%" style={{ display: 'block' }}>
            <line x1={PLOT.x0} y1={PLOT.y0} x2={PLOT.x0} y2={PLOT.y1} stroke="rgba(255,255,255,0.25)" />
            <line x1={PLOT.x0} y1={PLOT.y1} x2={PLOT.x1} y2={PLOT.y1} stroke="rgba(255,255,255,0.25)" />
            <text x={PLOT.x0 - 10} y={PLOT.y0 + 6} fill="#9aa3b8" fontSize="12" textAnchor="end">P</text>
            <text x={PLOT.x1} y={PLOT.y1 + 18} fill="#9aa3b8" fontSize="12">V</text>
            <path d={loopPath} fill="rgba(255,138,61,0.10)" stroke="#ff8a3d" strokeWidth="2.5" strokeLinejoin="round" />
            {([['A', m.VA, th / m.VA], ['B', m.VB, th / m.VB], ['C', m.VC, tc / m.VC], ['D', m.VD, tc / m.VD]] as const).map(([lab, v, p]) => (
              <g key={lab}>
                <circle cx={X(v)} cy={Y(p)} r="3.5" fill="#eef1f8" />
                <text x={X(v) + 7} y={Y(p) - 6} fill="#eef1f8" fontSize="12" fontFamily="'Fraunces Variable', serif">{lab}</text>
              </g>
            ))}
            <circle ref={marker} cx={X(m.VA)} cy={Y(th / m.VA)} r="6" fill="#ffd27a" stroke="#0b0806" strokeWidth="1.5" />
          </svg>

          {/* Cylinder + reservoirs (cylinder centred at x=180, between the bars) */}
          <svg viewBox="0 0 360 360" width="100%" style={{ display: 'block' }}>
            {/* hot reservoir */}
            <rect x="48" y="18" width="264" height="30" rx="6" fill={stroke.hot ? '#ff6a3a' : '#3a2018'} opacity={stroke.hot ? 0.95 : 0.5} />
            <text x="60" y="38" fill={stroke.hot ? '#0b0806' : '#ff9166'} fontSize="13" fontWeight="700" fontFamily="'JetBrains Mono Variable', monospace">Tₕ {th} K</text>
            {/* heat-in arrows during isothermal expansion */}
            {stroke.hot && [150, 180, 210].map((x) => <polygon key={x} points={`${x - 5},52 ${x + 5},52 ${x},64`} fill="#ff6a3a" />)}
            {/* cylinder walls */}
            <rect x="132" y="58" width="96" height="244" rx="6" fill="none" stroke="#565c66" strokeWidth="3" />
            {/* gas column (x/width static; y/height animated) */}
            <rect ref={gas} x="135" y="262" width="90" height="40" fill="#ff6a3a" />
            {/* piston (y translated by the loop) */}
            <g ref={pistonR}>
              <rect x="131" y="0" width="98" height="14" rx="2" fill="#d9a441" />
              <rect x="173" y="-26" width="14" height="30" fill="#d9a441" />
            </g>
            {/* heat-out arrows during isothermal compression */}
            {stroke.cold && [150, 180, 210].map((x) => <polygon key={x} points={`${x - 5},308 ${x + 5},308 ${x},296`} fill="#4aa8ff" />)}
            {/* cold reservoir */}
            <rect x="48" y="312" width="264" height="30" rx="6" fill={stroke.cold ? '#4aa8ff' : '#16283f'} opacity={stroke.cold ? 0.95 : 0.5} />
            <text x="60" y="332" fill={stroke.cold ? '#04121f' : '#7ad3ff'} fontSize="13" fontWeight="700" fontFamily="'JetBrains Mono Variable', monospace">T꜀ {tc} K</text>
          </svg>
        </Box>
      </Box>

      {/* controls + readouts */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2, mt: 2, px: 1 }}>
        <IconButton onClick={() => setRunning((r) => !r)} sx={{ color: '#eef1f8', border: '1px solid rgba(255,255,255,0.15)' }}>
          {running ? <PauseRounded /> : <PlayArrowRounded />}
        </IconButton>
        <Box sx={{ minWidth: 190 }}>
          <Typography sx={{ fontFamily: "'Fraunces Variable', serif", fontSize: 17, color: '#ffb98a' }}>{stroke.name}</Typography>
          <Typography sx={{ fontSize: 12.5, color: 'text.secondary' }}>{stroke.sub}</Typography>
        </Box>
        <Box sx={{ ml: 'auto', textAlign: 'right' }}>
          <Typography variant="overline" sx={{ color: 'text.secondary', display: 'block', lineHeight: 1 }}>Max efficiency · 1 − T꜀/Tₕ</Typography>
          <Typography sx={{ fontFamily: "'JetBrains Mono Variable', monospace", fontSize: 26, color: '#ff8a3d', lineHeight: 1.1 }}>{eff}%</Typography>
        </Box>
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: { xs: 0.5, sm: 3 }, mt: 1.5, px: 1 }}>
        <SliderRow label="Tₕ" value={th} min={440} max={820} color="#ff6a3a" onChange={(v) => setTh(Math.max(tc + 80, v))} />
        <SliderRow label="T꜀" value={tc} min={180} max={520} color="#4aa8ff" onChange={(v) => setTc(Math.min(th - 80, v))} />
      </Box>
    </Box>
  );
}

function SliderRow({ label, value, min, max, color, onChange }: { label: string; value: number; min: number; max: number; color: string; onChange: (v: number) => void }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      <Typography sx={{ fontSize: 13, color: 'text.secondary', minWidth: 44, fontFamily: "'JetBrains Mono Variable', monospace" }}>{label} {value}</Typography>
      <Slider value={value} min={min} max={max} step={5} onChange={(_, v) => onChange(v as number)} sx={{ color }} />
    </Box>
  );
}

/** Blue (cold) → orange (hot) by where T sits between Tc and Th. */
function tempColor(T: number, tc: number, th: number): string {
  const t = Math.min(1, Math.max(0, (T - tc) / Math.max(1, th - tc)));
  const cold = [74, 168, 255];
  const hot = [255, 106, 58];
  const c = cold.map((v, i) => Math.round(v + (hot[i] - v) * t));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
}
