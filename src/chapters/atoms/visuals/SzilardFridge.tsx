import { useRef, useState } from 'react';
import { Box, Switch, FormControlLabel, Typography, Slider } from '@mui/material';
import { useRaf } from '@/hooks/useRaf';

/**
 * The Einstein–Szilárd absorption refrigerator as a patent plate. One animated
 * loop stands in for the real three-fluid cycle (butane refrigerant, ammonia,
 * water — in pressure balance, so no compressor and no moving parts): heat in
 * at the generator drives the circuit, heat is drawn out of the cold box at
 * the evaporator and rejected at the condenser. Energy ledger per the first
 * law: Q̇_reject = Q̇_drive + Q̇_cold. COP here is honest for this pumpless
 * family (~0.25); the machine's sale was safety and silence, not efficiency.
 *
 * U.S. Patent 1,781,541 "Refrigeration" — filed Dec 16 1927, granted Nov 11
 * 1930 (verified). AEG's electromagnetic-pump prototype ran continuously from
 * July 31, 1931.
 */

const VIOLET = '#b9a6ff';
const VIOLET_DIM = 'rgba(185,166,255,0.55)';
const TEAL = '#4fd6c0';
const WARM = '#ffab5e';
const DIM = '#9aa3b8';

const N_DOTS = 14;
const FLOW_SPEED = 95; // px/s along the loop when lit

const Q_DRIVE = 100; // W
const Q_COLD = 25; // W — COP 0.25, honest for diffusion-absorption machines
const Q_REJECT = Q_DRIVE + Q_COLD;

export function SzilardFridge() {
  const [on, setOn] = useState(false);
  const [intensity, setIntensity] = useState(1); // flame strength

  const qDrive = Math.round(Q_DRIVE * intensity);
  const qCold = Math.round(Q_COLD * intensity);
  const qReject = qDrive + qCold;

  const pathRef = useRef<SVGPathElement>(null);
  const dotRefs = useRef<(SVGCircleElement | null)[]>([]);
  const flameRef = useRef<SVGGElement>(null);
  const tempTextRef = useRef<SVGTextElement>(null);
  const speed = useRef(0);
  const offset = useRef(0);
  const temp = useRef(22);
  const clock = useRef(0);

  useRaf((dt) => {
    // Flow eases in when the flame lights, out when it dies; faster with a hotter flame.
    const target = on ? FLOW_SPEED * intensity : 0;
    speed.current += (target - speed.current) * Math.min(1, dt * 2.2);
    offset.current += speed.current * dt;

    const path = pathRef.current;
    if (path) {
      const L = path.getTotalLength();
      for (let i = 0; i < N_DOTS; i++) {
        const el = dotRefs.current[i];
        if (!el) continue;
        const p = path.getPointAtLength((offset.current + (i * L) / N_DOTS) % L);
        el.setAttribute('cx', String(p.x));
        el.setAttribute('cy', String(p.y));
        el.setAttribute('opacity', String(Math.min(0.95, speed.current / 40)));
      }
    }

    // Cold-box temperature relaxes toward its target — a stronger flame drives it colder.
    const tTarget = on ? 22 - intensity * 20 : 22.0;
    temp.current += (tTarget - temp.current) * Math.min(1, dt * 0.22);
    if (tempTextRef.current) tempTextRef.current.textContent = `${temp.current.toFixed(1)} °C`;

    // Flame flicker, height ∝ intensity, seated on the generator.
    clock.current += dt;
    if (flameRef.current) {
      const s = (0.55 + intensity * 0.5) * (0.9 + 0.12 * Math.sin(clock.current * 9));
      flameRef.current.setAttribute('transform', `translate(620 372) scale(1 ${on ? s : 0.0001})`);
      flameRef.current.setAttribute('opacity', on ? '1' : '0');
    }
  });

  return (
    <Box sx={{ width: '100%' }}>
      <svg viewBox="0 0 760 448" width="100%" style={{ display: 'block' }}>
        {/* Patent stamp */}
        <g>
          <rect x="60" y="16" width="256" height="60" rx="4" fill="none" stroke={VIOLET_DIM} />
          <rect x="64" y="20" width="248" height="52" rx="3" fill="none" stroke="rgba(185,166,255,0.22)" strokeDasharray="3 3" />
          <text x="188" y="36" textAnchor="middle" fill={VIOLET} fontSize="11" letterSpacing="3" fontFamily="'JetBrains Mono Variable', monospace">REFRIGERATION</text>
          <text x="188" y="51" textAnchor="middle" fill={DIM} fontSize="10" fontFamily="'JetBrains Mono Variable', monospace">A. EINSTEIN &amp; L. SZILARD</text>
          <text x="188" y="65" textAnchor="middle" fill={DIM} fontSize="10" fontFamily="'JetBrains Mono Variable', monospace">U.S. PAT. 1,781,541 · NOV. 11, 1930</text>
        </g>
        <text x="372" y="52" fill="rgba(238,241,248,0.8)" fontSize="21" fontStyle="italic" fontFamily="'Fraunces Variable', serif">Fig. 1.</text>

        {/* Condenser (heat out) — above the top pipe run */}
        <text x="470" y="60" fill={WARM} fontSize="10.5" letterSpacing="2" fontFamily="'JetBrains Mono Variable', monospace">CONDENSER · HEAT OUT</text>
        {[492, 532, 572].map((x) => (
          <g key={x} opacity={on ? 0.95 : 0.3}>
            <line x1={x} y1="92" x2={x} y2="72" stroke={WARM} strokeWidth="2" />
            <polygon points={`${x - 4},74 ${x + 4},74 ${x},64`} fill={WARM} />
          </g>
        ))}
        <path
          d="M470,100 a10,10 0 0 1 20,0 a10,10 0 0 1 20,0 a10,10 0 0 1 20,0 a10,10 0 0 1 20,0 a10,10 0 0 1 20,0 a10,10 0 0 1 20,0"
          fill="none" stroke={WARM} strokeWidth="2.5" opacity="0.85"
        />

        {/* Cold box */}
        <rect x="48" y="120" width="210" height="210" fill="rgba(79,214,192,0.035)" stroke="#6b7280" strokeWidth="2.5" />
        <rect x="58" y="130" width="190" height="190" fill="none" stroke="rgba(255,255,255,0.14)" strokeDasharray="4 4" />
        {[0, 1, 2, 3, 4].map((i) => (
          <line key={i} x1={54 + i * 10} y1="120" x2={48 + i * 10} y2="130" stroke="#6b7280" strokeWidth="1" opacity="0.6" />
        ))}
        <text x="58" y="112" fill={VIOLET_DIM} fontSize="11" letterSpacing="2.5" fontFamily="'JetBrains Mono Variable', monospace">COLD BOX</text>
        <text ref={tempTextRef} x="118" y="238" fill={TEAL} fontSize="24" fontFamily="'JetBrains Mono Variable', monospace">22.0 °C</text>
        <text x="66" y="306" fill={TEAL} fontSize="10" letterSpacing="1.5" fontFamily="'JetBrains Mono Variable', monospace" opacity="0.9">EVAPORATOR</text>
        <text x="66" y="319" fill={DIM} fontSize="9.5" fontFamily="'JetBrains Mono Variable', monospace">heat drawn from the box</text>

        {/* Evaporator coil (decoration on the in-box leg) */}
        <polyline
          points="215,150 243,162 187,174 243,186 187,198 243,210 187,222 243,234 187,246 243,258 187,270 215,282"
          fill="none" stroke={TEAL} strokeWidth="2.5" opacity="0.9" strokeLinejoin="round"
        />

        {/* The sealed loop (dots ride this path) */}
        <path ref={pathRef} d="M215,290 V100 H620 V385 H215 Z" fill="none" stroke={VIOLET} strokeWidth="3" opacity="0.75" strokeLinejoin="round" />
        {Array.from({ length: N_DOTS }).map((_, i) => (
          <circle key={i} ref={(el) => (dotRefs.current[i] = el)} cx="-10" cy="-10" r="3.5" fill={TEAL} opacity="0" />
        ))}

        {/* Generator (heat in) */}
        <rect x="588" y="282" width="64" height="80" rx="10" fill="rgba(154,123,255,0.07)" stroke={VIOLET} strokeWidth="2.5" />
        <text x="660" y="308" fill={VIOLET} fontSize="10.5" letterSpacing="1.5" fontFamily="'JetBrains Mono Variable', monospace">GENERATOR</text>
        <text x="660" y="322" fill={DIM} fontSize="9.5" fontFamily="'JetBrains Mono Variable', monospace">heat in — any flame</text>

        {/* Flame + burner */}
        <g ref={flameRef} opacity="0">
          <path d="M-18 0 Q-11 -30 -2 0 Z" fill="#ff8a3d" />
          <path d="M-4 2 Q5 -38 15 2 Z" fill="#ffb98a" />
        </g>
        <rect x="596" y="374" width="48" height="6" rx="2" fill="#3a3f47" />

        {/* Annotations */}
        <text x="60" y="352" fill={DIM} fontSize="9.5" fontFamily="'JetBrains Mono Variable', monospace">working fluids: butane · ammonia · water — three-fluid loop, drawn as one</text>
        <text x="60" y="368" fill={VIOLET_DIM} fontSize="10" letterSpacing="1.5" fontFamily="'JetBrains Mono Variable', monospace">HERMETICALLY SEALED · NO MOVING PARTS</text>
      </svg>

      {/* Ledger */}
      <Box sx={{ display: 'flex', gap: 2.5, flexWrap: 'wrap', px: 1, mt: 1 }}>
        <Stat label="Q̇ flame (drive)" value={on ? `${qDrive} W` : '—'} color={WARM} />
        <Stat label="Q̇ from the box" value={on ? `${qCold} W` : '—'} color={TEAL} />
        <Stat label="Q̇ to the kitchen" value={on ? `${qReject} W = ${qDrive} + ${qCold}` : '—'} note="first law, balanced" color="#eef1f8" />
        <Stat label="COP · Q̇cold / Q̇drive" value={on ? '0.25' : '—'} note="reversible ceiling ≈ 2.3 here" color={VIOLET} />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1.5, px: 1, flexWrap: 'wrap' }}>
        <FormControlLabel
          control={<Switch checked={on} onChange={(e) => setOn(e.target.checked)} color="secondary" />}
          label={<Typography sx={{ fontSize: 13.5, fontWeight: 600 }}>Light the flame</Typography>}
          sx={{ mr: 0 }}
        />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 180 }}>
          <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>Flame</Typography>
          <Slider value={intensity} min={0.3} max={1.5} step={0.05} disabled={!on} onChange={(_, v) => setIntensity(v as number)} sx={{ color: '#ff8a3d', width: 120 }} />
        </Box>
        <Typography sx={{ fontSize: 12, color: 'text.secondary', flex: 1, minWidth: 240 }}>
          Heat leaves the coldest thing in the room — uphill — because the flame pays the toll Clausius demanded.
          This pumpless family managed COP ~0.2–0.3; its sale was safety, not efficiency.
        </Typography>
      </Box>
    </Box>
  );
}

function Stat({ label, value, note, color }: { label: string; value: string; note?: string; color: string }) {
  return (
    <Box sx={{ minWidth: 130 }}>
      <Typography variant="overline" sx={{ color: 'text.secondary', display: 'block', lineHeight: 1.2 }}>{label}</Typography>
      <Typography sx={{ fontFamily: "'JetBrains Mono Variable', monospace", fontSize: 15.5, color }}>{value}</Typography>
      {note && <Typography sx={{ fontSize: 10.5, color: 'text.secondary' }}>{note}</Typography>}
    </Box>
  );
}
