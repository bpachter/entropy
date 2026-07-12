import { useCallback, useEffect, useRef, useState } from 'react';
import { Box, Slider, Typography, Switch, FormControlLabel, IconButton, Tooltip } from '@mui/material';
import PauseRounded from '@mui/icons-material/PauseRounded';
import PlayArrowRounded from '@mui/icons-material/PlayArrowRounded';
import RestartAltRounded from '@mui/icons-material/RestartAltRounded';
import { useRaf } from '@/hooks/useRaf';

/**
 * The microscope. A visible grain sits in water, jiggling for no apparent
 * reason — what Robert Brown saw in 1827. Flip "Reveal the molecules" and the
 * cause appears: a hail of water molecules, far too small for any real
 * microscope, hammering the grain from every side. Warm the water and the
 * hammering (and the dance) quickens.
 *
 * Scaling is honest but theatrical: a real ~1 μm grain is ~10,000× the size of
 * a water molecule and takes ~10¹⁹ collisions a second; a few hundred visible
 * molecules stand in for them here.
 */

const SIZE = 640;
const CTR = SIZE / 2;
const STAGE_R = 300;
const N_MOL = 230;
const R_MOL = 3;
const R_GRAIN = 27;
const KICK = 0.022; // effective molecule/grain mass ratio
const DRAG_TAU = 0.7; // s — Stokes drag on the grain
const BASE_SPEED = 150; // px/s at temperature 1.0
const TRAIL_MAX = 850;

interface Mover { x: number; y: number; vx: number; vy: number }

function seedMolecules(temp: number): Mover[] {
  const out: Mover[] = [];
  while (out.length < N_MOL) {
    const x = (Math.random() * 2 - 1) * (STAGE_R - R_MOL - 4);
    const y = (Math.random() * 2 - 1) * (STAGE_R - R_MOL - 4);
    if (x * x + y * y > (STAGE_R - R_MOL - 6) ** 2) continue;
    if (x * x + y * y < (R_GRAIN + R_MOL + 2) ** 2) continue; // don't seed inside the grain
    const a = Math.random() * Math.PI * 2;
    const s = BASE_SPEED * temp * (0.55 + 0.9 * Math.random());
    out.push({ x: CTR + x, y: CTR + y, vx: Math.cos(a) * s, vy: Math.sin(a) * s });
  }
  return out;
}

export function BrownianSim() {
  const [temp, setTemp] = useState(1);
  const [reveal, setReveal] = useState(false);
  const [trace, setTrace] = useState(true);
  const [running, setRunning] = useState(true);
  const [hps, setHps] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mols = useRef<Mover[]>(seedMolecules(1));
  const grain = useRef<Mover>({ x: CTR, y: CTR, vx: 0, vy: 0 });
  const trail = useRef<{ x: number; y: number }[]>([]);
  const tempRef = useRef(1);
  const hits = useRef(0);
  const hpsClock = useRef(0);

  // Rescale molecular speeds when the water temperature changes.
  useEffect(() => {
    const f = temp / tempRef.current;
    tempRef.current = temp;
    for (const m of mols.current) {
      m.vx *= f;
      m.vy *= f;
    }
  }, [temp]);

  const reset = useCallback(() => {
    mols.current = seedMolecules(tempRef.current);
    grain.current = { x: CTR, y: CTR, vx: 0, vy: 0 };
    trail.current = [];
    hits.current = 0;
    hpsClock.current = 0;
    setHps(0);
    setRunning(true);
  }, []);

  const step = (dt: number) => {
    const g = grain.current;
    for (const m of mols.current) {
      m.x += m.vx * dt;
      m.y += m.vy * dt;

      // Stage wall (circular).
      const wx = m.x - CTR;
      const wy = m.y - CTR;
      const wd = Math.hypot(wx, wy);
      if (wd > STAGE_R - R_MOL) {
        const nx = wx / wd, ny = wy / wd;
        const vn = m.vx * nx + m.vy * ny;
        if (vn > 0) {
          m.vx -= 2 * vn * nx;
          m.vy -= 2 * vn * ny;
        }
        m.x = CTR + nx * (STAGE_R - R_MOL);
        m.y = CTR + ny * (STAGE_R - R_MOL);
      }

      // Collision with the grain: reflect the molecule, kick the grain.
      const dx = m.x - g.x;
      const dy = m.y - g.y;
      const d = Math.hypot(dx, dy);
      if (d < R_GRAIN + R_MOL && d > 0) {
        const nx = dx / d, ny = dy / d;
        const vn = m.vx * nx + m.vy * ny;
        if (vn < 0) {
          m.vx -= 2 * vn * nx;
          m.vy -= 2 * vn * ny;
          g.vx += KICK * 2 * vn * nx;
          g.vy += KICK * 2 * vn * ny;
          hits.current++;
        }
        m.x = g.x + nx * (R_GRAIN + R_MOL + 0.5);
        m.y = g.y + ny * (R_GRAIN + R_MOL + 0.5);
      }
    }

    // Grain: integrate, drag, keep on stage.
    g.x += g.vx * dt;
    g.y += g.vy * dt;
    const drag = Math.exp(-dt / DRAG_TAU);
    g.vx *= drag;
    g.vy *= drag;
    const gx = g.x - CTR;
    const gy = g.y - CTR;
    const gd = Math.hypot(gx, gy);
    if (gd > STAGE_R - R_GRAIN) {
      const nx = gx / gd, ny = gy / gd;
      const vn = g.vx * nx + g.vy * ny;
      if (vn > 0) {
        g.vx -= 2 * vn * nx;
        g.vy -= 2 * vn * ny;
      }
      g.x = CTR + nx * (STAGE_R - R_GRAIN);
      g.y = CTR + ny * (STAGE_R - R_GRAIN);
    }

    trail.current.push({ x: g.x, y: g.y });
    if (trail.current.length > TRAIL_MAX) trail.current.shift();
  };

  const draw = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, SIZE, SIZE);

    ctx.save();
    ctx.beginPath();
    ctx.arc(CTR, CTR, STAGE_R, 0, Math.PI * 2);
    ctx.clip();

    // Dark-field water, vignetted at the edges.
    const bg = ctx.createRadialGradient(CTR, CTR, 40, CTR, CTR, STAGE_R);
    bg.addColorStop(0, '#101020');
    bg.addColorStop(0.75, '#0a0a15');
    bg.addColorStop(1, '#05050b');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, SIZE, SIZE);

    // Path trace (older half fainter).
    if (trace && trail.current.length > 2) {
      const pts = trail.current;
      const mid = Math.floor(pts.length / 2);
      for (const [from, to, alpha] of [
        [0, mid, 0.1],
        [mid, pts.length - 1, 0.3],
      ] as const) {
        ctx.beginPath();
        ctx.moveTo(pts[from].x, pts[from].y);
        for (let i = from + 1; i <= to; i++) ctx.lineTo(pts[i].x, pts[i].y);
        ctx.strokeStyle = `rgba(194,173,255,${alpha})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    }

    // The invisible world, revealed.
    if (reveal) {
      ctx.fillStyle = 'rgba(79,214,192,0.8)';
      ctx.beginPath();
      for (const m of mols.current) {
        ctx.moveTo(m.x + R_MOL, m.y);
        ctx.arc(m.x, m.y, R_MOL, 0, Math.PI * 2);
      }
      ctx.fill();
    }

    // The grain.
    const g = grain.current;
    const gg = ctx.createRadialGradient(g.x - 8, g.y - 8, 4, g.x, g.y, R_GRAIN);
    gg.addColorStop(0, '#e4dbff');
    gg.addColorStop(0.55, '#a98ef0');
    gg.addColorStop(1, '#5d43b8');
    ctx.fillStyle = gg;
    ctx.beginPath();
    ctx.arc(g.x, g.y, R_GRAIN, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.restore();

    // Microscope rim + reticle ticks.
    ctx.strokeStyle = 'rgba(154,123,255,0.55)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(CTR, CTR, STAGE_R + 2, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = 'rgba(154,123,255,0.3)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 4; i++) {
      const a = (i * Math.PI) / 2;
      ctx.beginPath();
      ctx.moveTo(CTR + Math.cos(a) * (STAGE_R - 12), CTR + Math.sin(a) * (STAGE_R - 12));
      ctx.lineTo(CTR + Math.cos(a) * (STAGE_R - 2), CTR + Math.sin(a) * (STAGE_R - 2));
      ctx.stroke();
    }
  };

  useRaf((dt) => {
    if (running) {
      step(Math.min(dt, 0.04));
      hpsClock.current += dt;
      if (hpsClock.current >= 0.4) {
        setHps(hits.current / hpsClock.current);
        hits.current = 0;
        hpsClock.current = 0;
      }
    }
    draw();
  });

  return (
    <Box sx={{ width: '100%' }}>
      <canvas
        ref={canvasRef}
        width={SIZE}
        height={SIZE}
        style={{
          width: '100%',
          maxWidth: 520,
          aspectRatio: '1 / 1',
          display: 'block',
          margin: '0 auto',
          borderRadius: '50%',
          boxShadow: '0 0 70px -18px rgba(154,123,255,0.5)',
        }}
      />

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2, px: 1, flexWrap: 'wrap' }}>
        <Typography sx={{ fontSize: 13, color: 'text.secondary', minWidth: 118 }}>Water temperature</Typography>
        <Slider value={temp} min={0.4} max={2.2} step={0.01} onChange={(_, v) => setTemp(v as number)} sx={{ color: '#9a7bff', flex: 1, minWidth: 140 }} />
        <FormControlLabel
          control={<Switch checked={reveal} onChange={(e) => setReveal(e.target.checked)} color="secondary" />}
          label={<Typography sx={{ fontSize: 13, fontWeight: 600 }}>Reveal the molecules</Typography>}
          sx={{ mr: 0 }}
        />
        <FormControlLabel
          control={<Switch checked={trace} onChange={(e) => setTrace(e.target.checked)} />}
          label={<Typography sx={{ fontSize: 13 }}>Trace the path</Typography>}
          sx={{ mr: 0 }}
        />
        <Tooltip title={running ? 'Pause' : 'Play'}>
          <IconButton size="small" onClick={() => setRunning((r) => !r)} sx={{ color: '#eef1f8', border: '1px solid rgba(255,255,255,0.15)' }}>
            {running ? <PauseRounded fontSize="small" /> : <PlayArrowRounded fontSize="small" />}
          </IconButton>
        </Tooltip>
        <Tooltip title="Reset">
          <IconButton size="small" onClick={reset} sx={{ color: '#eef1f8', border: '1px solid rgba(255,255,255,0.15)' }}>
            <RestartAltRounded fontSize="small" />
          </IconButton>
        </Tooltip>
        <Typography sx={{ fontFamily: "'JetBrains Mono Variable', monospace", fontSize: 12.5, color: '#4fd6c0', ml: 'auto' }}>
          {Math.round(hps)} hits/s
        </Typography>
      </Box>
      <Typography sx={{ mt: 1, px: 1, fontSize: 12, color: 'text.secondary' }}>
        Scaled for the eye: a real grain is thousands of times a water molecule’s size and takes ~10²⁰ hits a second —
        the stagger comes from the imbalance among them, never from one visible kick.
      </Typography>
    </Box>
  );
}
