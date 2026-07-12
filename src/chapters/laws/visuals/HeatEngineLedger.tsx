import { useRef, useState } from 'react';
import { Box, Slider, Typography } from '@mui/material';
import { useRaf } from '@/hooks/useRaf';

/**
 * The reconciliation Clausius and Kelvin achieved. First law: the heat drawn
 * from the hot reservoir splits exactly into work plus heat dumped to the cold
 * one — Qₕ = W + Q꜀, nothing lost. Second law: the work can never exceed the
 * Carnot ceiling η ≤ 1 − T꜀/Tₕ, and whenever it falls short, entropy is
 * generated. Heat quanta flow live along the bands, the engine's flywheel spins
 * with the work extracted, and a running tally counts the entropy the universe
 * gains each cycle you run below the reversible ideal.
 */

const QH = 100; // fixed heat drawn from the hot reservoir (arbitrary units)
const K = 1.25; // px per unit of heat (band thickness)
const MIDY = 150;
const ENGINE = { x: 232, y: MIDY - 75, w: 132, h: 150 }; // centred on MIDY
const CX = ENGINE.x + ENGINE.w / 2;
const DOTS = 8;
const FLOW = 96; // px/s

export function HeatEngineLedger() {
  const [th, setTh] = useState(600);
  const [tc, setTc] = useState(300);
  const [effPct, setEffPct] = useState(30);

  const carnot = 1 - tc / th;
  const effMaxPct = carnot * 100; // un-floored, so exact reversibility is reachable
  const eff = Math.min(effPct, effMaxPct) / 100;
  const W = QH * eff;
  const QC = QH - W;
  const dS = QC / tc - QH / th; // entropy generated per cycle (≥ 0)

  const qhT = QH * K;
  const wT = Math.max(2, W * K);
  const qcT = Math.max(2, QC * K);

  const flow = useRef(0);
  const qhDots = useRef<(SVGCircleElement | null)[]>([]);
  const wDots = useRef<(SVGCircleElement | null)[]>([]);
  const qcDots = useRef<(SVGCircleElement | null)[]>([]);
  const flywheel = useRef<SVGGElement>(null);
  const wasted = useRef(0);
  const uiAcc = useRef(0);
  const [wastedUi, setWastedUi] = useState(0);

  useRaf((dt) => {
    flow.current += dt;
    const march = (refs: (SVGCircleElement | null)[], len: number, frac: number, place: (el: SVGCircleElement, d: number) => void) => {
      const shown = Math.round(DOTS * frac);
      refs.forEach((el, i) => {
        if (!el) return;
        if (i >= shown) { el.setAttribute('opacity', '0'); return; }
        const d = (flow.current * FLOW + (i * len) / Math.max(1, shown)) % len;
        place(el, d);
        el.setAttribute('opacity', '0.92');
      });
    };
    march(qhDots.current, ENGINE.x - 72, 1, (el, d) => { el.setAttribute('cx', String(72 + d)); el.setAttribute('cy', String(MIDY)); });
    march(wDots.current, 520 - (ENGINE.x + ENGINE.w), eff, (el, d) => { el.setAttribute('cx', String(ENGINE.x + ENGINE.w + d)); el.setAttribute('cy', String(MIDY)); });
    march(qcDots.current, 300 - (ENGINE.y + ENGINE.h), QC / QH, (el, d) => { el.setAttribute('cx', String(CX)); el.setAttribute('cy', String(ENGINE.y + ENGINE.h + d)); });
    flywheel.current?.setAttribute('transform', `rotate(${(flow.current * (20 + eff * 300)) % 360} ${CX} ${MIDY})`);

    wasted.current += dS * dt;
    uiAcc.current += dt;
    if (uiAcc.current > 0.25) { uiAcc.current = 0; setWastedUi(wasted.current); }
  });

  return (
    <Box sx={{ width: '100%' }}>
      <svg viewBox="0 0 600 340" width="100%" style={{ display: 'block' }}>
        {/* hot reservoir */}
        <rect x="18" y={MIDY - 46} width="54" height="92" rx="6" fill="#ff6a3a" opacity="0.9" />
        <text x="45" y={MIDY - 54} textAnchor="middle" fill="#ff9166" fontSize="12" fontFamily="'JetBrains Mono Variable', monospace">Tₕ {th}K</text>

        {/* Qh band + flowing quanta */}
        <rect x="72" y={MIDY - qhT / 2} width={ENGINE.x - 72} height={qhT} fill="url(#qhGrad)" opacity="0.5" />
        {Array.from({ length: DOTS }).map((_, i) => <circle key={i} ref={(el) => (qhDots.current[i] = el)} r="3.5" fill="#ffd0a3" opacity="0" />)}
        <text x={(72 + ENGINE.x) / 2} y={MIDY - qhT / 2 - 8} textAnchor="middle" fill="#ff9166" fontSize="13" fontFamily="'JetBrains Mono Variable', monospace">Qₕ {QH}</text>

        {/* engine + flywheel */}
        <rect x={ENGINE.x} y={ENGINE.y} width={ENGINE.w} height={ENGINE.h} rx="8" fill="#15130f" stroke="#f5b73c" strokeWidth="2" />
        <text x={CX} y={ENGINE.y + 22} textAnchor="middle" fill="#f5b73c" fontSize="14" fontFamily="'Fraunces Variable', serif">ENGINE</text>
        <g ref={flywheel}>
          <circle cx={CX} cy={MIDY} r="24" fill="none" stroke="#8a8f99" strokeWidth="4" />
          {[0, 1, 2, 3, 4, 5].map((i) => <line key={i} x1={CX} y1={MIDY} x2={CX + 22 * Math.cos((i * Math.PI) / 3)} y2={MIDY + 22 * Math.sin((i * Math.PI) / 3)} stroke="#8a8f99" strokeWidth="3" />)}
          <circle cx={CX + 22} cy={MIDY} r="4" fill="#d9a441" />
        </g>
        <circle cx={CX} cy={MIDY} r="6" fill="#565c66" />
        <text x={CX} y={ENGINE.y + ENGINE.h - 12} textAnchor="middle" fill="#eef1f8" fontSize="14" fontFamily="'JetBrains Mono Variable', monospace">η {Math.round(eff * 100)}%</text>

        {/* Work band → right + quanta */}
        <rect x={ENGINE.x + ENGINE.w} y={MIDY - wT / 2} width={520 - (ENGINE.x + ENGINE.w)} height={wT} fill="#d9a441" opacity="0.5" />
        {Array.from({ length: DOTS }).map((_, i) => <circle key={i} ref={(el) => (wDots.current[i] = el)} r="3.5" fill="#fff2cf" opacity="0" />)}
        <rect x="520" y={MIDY - 40} width="56" height="80" rx="6" fill="#d9a441" />
        <text x="548" y={MIDY - 48} textAnchor="middle" fill="#ffd98a" fontSize="12" fontFamily="'JetBrains Mono Variable', monospace">W {W.toFixed(0)}</text>
        <text x="548" y={MIDY + 4} textAnchor="middle" fill="#0a090c" fontSize="12" fontWeight="700">work</text>

        {/* Qc band → down + quanta */}
        <rect x={CX - qcT / 2} y={ENGINE.y + ENGINE.h} width={qcT} height={300 - (ENGINE.y + ENGINE.h)} fill="url(#qcGrad)" opacity="0.5" />
        {Array.from({ length: DOTS }).map((_, i) => <circle key={i} ref={(el) => (qcDots.current[i] = el)} r="3.5" fill="#bfe0ef" opacity="0" />)}
        <rect x={CX - 46} y="300" width="92" height="34" rx="6" fill="#4aa8ff" opacity="0.9" />
        <text x={CX} y="322" textAnchor="middle" fill="#04121f" fontSize="12" fontWeight="700" fontFamily="'JetBrains Mono Variable', monospace">Q꜀ {QC.toFixed(0)} · T꜀ {tc}K</text>

        <defs>
          <linearGradient id="qhGrad" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#ff6a3a" /><stop offset="1" stopColor="#ff8a3d" /></linearGradient>
          <linearGradient id="qcGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5a7fa8" /><stop offset="1" stopColor="#4aa8ff" /></linearGradient>
        </defs>
      </svg>

      {/* readouts */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 1, px: 1 }}>
        <Stat label="First law" value={`${QH} = ${W.toFixed(0)} + ${QC.toFixed(0)}`} note="Qₕ = W + Q꜀" color="#eef1f8" />
        <Stat label="Carnot ceiling" value={`${effMaxPct.toFixed(0)}%`} note="1 − T꜀/Tₕ" color="#f5b73c" />
        <Stat label="Entropy / cycle" value={`${dS.toFixed(3)}`} note={dS < 0.001 ? 'reversible ✓' : 'ΔS ≥ 0'} color={dS < 0.001 ? '#5ec27f' : '#ff9166'} />
        <Stat label="Σ entropy generated" value={`${wastedUi.toFixed(1)}`} note="the universe’s running tab" color={dS < 0.001 ? '#5ec27f' : '#ff9166'} />
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: { xs: 0.5, sm: 3 }, mt: 1.5, px: 1 }}>
        <SliderRow label="Tₕ" value={th} min={400} max={820} color="#ff6a3a" onChange={(v) => setTh(Math.max(tc + 60, v))} />
        <SliderRow label="T꜀" value={tc} min={160} max={520} color="#4aa8ff" onChange={(v) => setTc(Math.min(th - 60, v))} />
      </Box>
      <Box sx={{ px: 1, mt: 0.5 }}>
        <SliderRow label="η" value={Math.min(effPct, effMaxPct)} min={0} max={effMaxPct} step={0.5} color="#d9a441" suffix="%" onChange={(v) => setEffPct(v)} />
        <Typography sx={{ fontSize: 12.5, color: 'text.secondary', mt: 0.5 }}>
          Push the efficiency to the Carnot ceiling and entropy generation falls to exactly zero — the reversible ideal. It can never go past it.
        </Typography>
      </Box>
    </Box>
  );
}

function Stat({ label, value, note, color }: { label: string; value: string; note: string; color: string }) {
  return (
    <Box sx={{ flex: '1 1 130px' }}>
      <Typography variant="overline" sx={{ color: 'text.secondary', display: 'block', lineHeight: 1.2 }}>{label}</Typography>
      <Typography sx={{ fontFamily: "'JetBrains Mono Variable', monospace", fontSize: 18, color }}>{value}</Typography>
      <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>{note}</Typography>
    </Box>
  );
}

function SliderRow({ label, value, min, max, color, suffix, step = 1, onChange }: { label: string; value: number; min: number; max: number; color: string; suffix?: string; step?: number; onChange: (v: number) => void }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      <Typography sx={{ fontSize: 13, color: 'text.secondary', minWidth: 60, fontFamily: "'JetBrains Mono Variable', monospace" }}>{label} {Math.round(value)}{suffix ?? 'K'}</Typography>
      <Slider value={value} min={min} max={max} step={step} onChange={(_, v) => onChange(v as number)} sx={{ color }} />
    </Box>
  );
}
