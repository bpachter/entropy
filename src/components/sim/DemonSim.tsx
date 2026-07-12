import { useState, useCallback } from 'react';
import { Box, Typography, FormControlLabel, Switch } from '@mui/material';
import { GasCanvas } from './GasCanvas';
import { TempBars, EntropyMeter, SimControls } from './SimHud';
import type { GasMetrics } from '@/sim/engine';

const CONFIG = {
  mode: 'demon' as const,
  count: 240,
  box: [7, 4.2, 4.2] as [number, number, number],
  baseSpeed: 1.15,
  doorFraction: 0.26,
};

/**
 * Maxwell's demon. One gas, a wall down the middle, a single door. With the
 * demon switched on it opens the door only for fast molecules heading right and
 * slow ones heading left — sorting hot from cold and opening a temperature gap
 * for no work at all. The separation meter falls: entropy appears to decrease.
 * Switch the demon off and the door just hangs open; the gas re-equilibrates.
 */
export function DemonSim() {
  const [running, setRunning] = useState(true);
  const [demonOn, setDemonOn] = useState(true);
  const [resetKey, setResetKey] = useState(0);
  const [metrics, setMetrics] = useState<GasMetrics | null>(null);
  const onMetrics = useCallback((m: GasMetrics) => setMetrics(m), []);

  const tMax = CONFIG.baseSpeed * CONFIG.baseSpeed * 3.2;

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '100%', minHeight: 440 }}>
      <GasCanvas
        config={CONFIG}
        running={running}
        demonOn={demonOn}
        colorBy="speed"
        resetKey={resetKey}
        onMetrics={onMetrics}
      />

      {/* On phones the two panels share one slim top strip (side by side) instead of
          stacking into a tower that hides half the gas. */}
      <Box
        sx={{
          position: 'absolute',
          top: { xs: 10, sm: 14 },
          left: { xs: 10, sm: 14 },
          right: { xs: 10, sm: 'auto' },
          display: 'flex',
          flexDirection: { xs: 'row', sm: 'column' },
          alignItems: { xs: 'stretch', sm: 'flex-start' },
          gap: 1,
        }}
      >
        <Box sx={{ flex: { xs: 1, sm: '0 0 auto' }, minWidth: 0 }}>
          <TempBars left={metrics?.tempLeft ?? 0} right={metrics?.tempRight ?? 0} max={tMax} />
        </Box>
        <Box sx={{ flex: { xs: 1, sm: '0 0 auto' }, minWidth: 0 }}>
          <EntropyMeter
            value={metrics?.separation ?? 1}
            label="Entropy"
            caption={`Demon has sorted ${metrics?.demonPasses ?? 0} molecules.`}
            gradient="linear-gradient(90deg,#5a6377,#9aa3b8)"
          />
        </Box>
      </Box>

      {/* The demon's switch: top-right on desktop, bottom-right on phones (clear of the strip). */}
      <Box sx={{ position: 'absolute', top: { xs: 'auto', sm: 14 }, bottom: { xs: 10, sm: 'auto' }, right: { xs: 10, sm: 14 } }}>
        <FormControlLabel
          control={<Switch checked={demonOn} onChange={(e) => setDemonOn(e.target.checked)} />}
          label={<Typography sx={{ fontSize: 13, fontWeight: 600 }}>Demon</Typography>}
          sx={{ bgcolor: 'rgba(8,10,15,0.66)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 2, px: 1.25, m: 0, backdropFilter: 'blur(8px)' }}
        />
      </Box>

      <Box sx={{ position: 'absolute', bottom: { xs: 10, sm: 14 }, left: { xs: 10, sm: 14 } }}>
        <SimControls
          running={running}
          onToggle={() => setRunning((r) => !r)}
          onReset={() => { setResetKey((k) => k + 1); setRunning(true); }}
        />
      </Box>

      {/* Orbit is mouse-only (OrbitControls are disabled on touch), so hide the hint there. */}
      <Typography sx={{ position: 'absolute', bottom: 16, right: 16, fontSize: 11, color: 'text.secondary', '@media (pointer: coarse)': { display: 'none' }, display: { xs: 'none', sm: 'block' } }}>
        drag to orbit
      </Typography>
    </Box>
  );
}
