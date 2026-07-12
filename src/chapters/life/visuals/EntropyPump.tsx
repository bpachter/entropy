import { useCallback, useRef, useState } from 'react';
import { Box, Slider, Typography, Switch, FormControlLabel } from '@mui/material';
import { useRaf } from '@/hooks/useRaf';

/**
 * Feeding on negative entropy. A living thing is an ordered structure that the
 * second law is forever trying to erase: thermal jostling flips its ordered
 * parts to disorder. It survives not by breaking the law but by paying it —
 * importing free energy to repair the damage and exporting the resulting
 * entropy to its surroundings. Cut the feeding and it slides to equilibrium:
 * uniform, disordered, dead. Note the two ledgers: the organism's own entropy
 * stays low and steady, while the universe's climbs and never, ever falls.
 */

const GX = 18;
const GY = 18;
const N = GX * GY;
const CELL = 17;
const PAD = 6;
const W = GX * CELL + PAD * 2;
const H = GY * CELL + PAD * 2;

const K_DECAY = 0.55; // per site per second at temperature 1
const K_REPAIR = 4.0; // per site per second while feeding

export function EntropyPump() {
  const [temp, setTemp] = useState(1);
  const [feeding, setFeeding] = useState(true);
  const [ui, setUi] = useState({ f: 1, sOrg: 0, sUni: 0, vitals: 'alive' as 'alive' | 'dying' | 'dead' });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ordered = useRef<Uint8Array>(new Uint8Array(N).fill(1));
  const angle = useRef<Float32Array>(new Float32Array(N));
  const sUniverse = useRef(0);
  const tempRef = useRef(1);
  const feedRef = useRef(true);
  const uiAcc = useRef(0);
  tempRef.current = temp;
  feedRef.current = feeding;

  const reset = useCallback(() => {
    ordered.current.fill(1);
    // sUniverse is intentionally NOT cleared: the universe's entropy never falls,
    // even when we reseed a fresh ordered organism.
  }, []);

  const draw = () => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < N; i++) {
      const gx = i % GX;
      const gy = (i / GX) | 0;
      const cx = PAD + gx * CELL + CELL / 2;
      const cy = PAD + gy * CELL + CELL / 2;
      const r = CELL * 0.36;
      const a = ordered.current[i] ? -Math.PI / 2 : angle.current[i];
      ctx.strokeStyle = ordered.current[i] ? 'rgba(94,194,127,0.95)' : 'rgba(120,128,140,0.55)';
      ctx.lineWidth = ordered.current[i] ? 2.4 : 1.6;
      ctx.beginPath();
      ctx.moveTo(cx - Math.cos(a) * r, cy - Math.sin(a) * r);
      ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
      ctx.stroke();
    }
  };

  useRaf((dt) => {
    const step = Math.min(dt, 0.05);
    const decay = K_DECAY * tempRef.current * step;
    const repair = (feedRef.current ? K_REPAIR : 0) * step;
    const ord = ordered.current;
    for (let i = 0; i < N; i++) {
      if (ord[i]) {
        if (Math.random() < decay) {
          ord[i] = 0;
          angle.current[i] = Math.random() * Math.PI * 2;
          sUniverse.current += 1; // disordering releases entropy
        }
      } else if (repair > 0 && Math.random() < repair) {
        ord[i] = 1;
        sUniverse.current += 1.6; // repairing costs more entropy than it removes locally
      }
    }
    draw();

    uiAcc.current += dt;
    if (uiAcc.current >= 0.2) {
      uiAcc.current = 0;
      let count = 0;
      for (let i = 0; i < N; i++) count += ord[i];
      const f = count / N;
      // Organism entropy ∝ disorder: low while ordered/fed, climbing to its
      // maximum as order collapses. (Binary entropy H(f) would be wrong here —
      // it is symmetric and bottoms out at BOTH f=1 and f=0.)
      const sOrg = 1 - f;
      const vitals = f > 0.55 ? 'alive' : f > 0.2 ? 'dying' : 'dead';
      setUi({ f, sOrg, sUni: sUniverse.current, vitals });
    }
  });

  const vitalColor = ui.vitals === 'alive' ? '#5ec27f' : ui.vitals === 'dying' ? '#ffb15a' : '#ff6a6a';
  const vitalLabel = ui.vitals === 'alive' ? 'ALIVE · order held' : ui.vitals === 'dying' ? 'DYING · order slipping' : 'DEAD · equilibrium reached';

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'auto 1fr' }, gap: { xs: 2, md: 3 }, alignItems: 'center' }}>
        <Box sx={{ justifySelf: 'center' }}>
          <canvas ref={canvasRef} width={W} height={H} style={{ width: '100%', maxWidth: W, display: 'block', borderRadius: 10, background: '#080b09' }} />
          <Typography sx={{ mt: 0.75, textAlign: 'center', fontSize: 12, fontFamily: "'JetBrains Mono Variable', monospace", color: vitalColor, fontWeight: 700 }}>
            {vitalLabel}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Meter label="The organism’s entropy" caption="held low while it feeds — order maintained" value={ui.sOrg} max={1} color="#5ec27f" fmt={(v) => v.toFixed(2)} />
          <Meter label="The universe’s entropy" caption="only ever rises — the price of staying alive" value={1 - 1 / (1 + ui.sUni / 3000)} rawValue={ui.sUni} max={1} color="#b6d95a" ratchet fmt={() => `${Math.round(ui.sUni).toLocaleString()} ↑`} />
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Stat label="Order fraction" value={`${Math.round(ui.f * 100)}%`} color="#a7e0b3" />
            <Stat label="Steady state" value={feeding ? `${Math.round((K_REPAIR / (K_REPAIR + K_DECAY * temp)) * 100)}%` : '0% (death)'} color="#9aa3b8" />
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2, px: 1, flexWrap: 'wrap' }}>
        <FormControlLabel
          control={<Switch checked={feeding} onChange={(e) => { setFeeding(e.target.checked); if (e.target.checked && ui.vitals === 'dead') reset(); }} color="primary" />}
          label={<Typography sx={{ fontSize: 13.5, fontWeight: 600 }}>{feeding ? 'Feeding (free energy in)' : 'Starved'}</Typography>}
          sx={{ mr: 1 }}
        />
        <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>Temperature</Typography>
        <Slider value={temp} min={0.3} max={2.2} step={0.01} onChange={(_, v) => setTemp(v as number)} sx={{ color: '#b6d95a', flex: 1, minWidth: 140 }} />
      </Box>
      <Typography sx={{ mt: 0.5, px: 1, fontSize: 12, color: 'text.secondary' }}>
        Life doesn’t escape the second law — it obeys it wholesale, buying local order by dumping disorder into everything around it.
      </Typography>
    </Box>
  );
}

function Meter({ label, caption, value, max, color, fmt, ratchet, rawValue }: { label: string; caption: string; value: number; max: number; color: string; fmt: (v: number) => string; ratchet?: boolean; rawValue?: number }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 0.5 }}>
        <Typography variant="overline" sx={{ color: 'text.secondary', lineHeight: 1 }}>{label}</Typography>
        <Typography sx={{ fontFamily: "'JetBrains Mono Variable', monospace", fontSize: 14, color }}>{fmt(rawValue ?? value)}</Typography>
      </Box>
      <Box sx={{ height: 9, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
        <Box sx={{ height: '100%', width: `${pct}%`, bgcolor: color, transition: 'width 0.2s linear', opacity: ratchet ? 0.85 : 1 }} />
      </Box>
      <Typography sx={{ fontSize: 11, color: 'text.secondary', mt: 0.4 }}>{caption}</Typography>
    </Box>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <Box>
      <Typography variant="overline" sx={{ color: 'text.secondary', display: 'block', lineHeight: 1.2 }}>{label}</Typography>
      <Typography sx={{ fontFamily: "'JetBrains Mono Variable', monospace", fontSize: 16, color }}>{value}</Typography>
    </Box>
  );
}
