import { useState, useCallback } from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { GasCanvas } from './GasCanvas';
import { EntropyMeter, SimControls } from './SimHud';
import type { GasMetrics } from '@/sim/engine';

const CONFIG = { mode: 'mix' as const, count: 220, box: [7, 4.2, 4.2] as [number, number, number], baseSpeed: 1.15 };

/**
 * Two gases — a hot one on the left, a cold one on the right — sharing a box
 * with no wall between them. Watch them interdiffuse and thermalise; the
 * mixing-entropy meter climbs and never falls. This is the second law you can
 * see: hot and cold spontaneously average out, never un-mix.
 */
export function MixingSim() {
  const [running, setRunning] = useState(true);
  const [resetKey, setResetKey] = useState(0);
  const [metrics, setMetrics] = useState<GasMetrics | null>(null);
  const onMetrics = useCallback((m: GasMetrics) => setMetrics(m), []);

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '100%', minHeight: 440 }}>
      <GasCanvas
        config={CONFIG}
        running={running}
        demonOn={false}
        colorBy="label"
        resetKey={resetKey}
        onMetrics={onMetrics}
      />

      <Box sx={{ position: 'absolute', top: 14, left: 14 }}>
        <EntropyMeter
          value={metrics?.mixing ?? 0}
          label="Mixing entropy · S = k log W"
          caption="Arrangements consistent with what you see — it climbs toward the max and never spontaneously un-mixes."
          gradient="linear-gradient(90deg,#42a6ff,#b9a6c9,#ff6a43)"
        />
      </Box>

      <Box sx={{ position: 'absolute', top: 14, right: 14, display: 'flex', gap: 0.75 }}>
        <Chip size="small" label="hot gas" sx={{ bgcolor: 'rgba(255,106,67,0.16)', color: '#ff9166', border: '1px solid rgba(255,106,67,0.4)' }} />
        <Chip size="small" label="cold gas" sx={{ bgcolor: 'rgba(66,166,255,0.16)', color: '#7ad3ff', border: '1px solid rgba(66,166,255,0.4)' }} />
      </Box>

      <Box sx={{ position: 'absolute', bottom: 14, left: 14 }}>
        <SimControls
          running={running}
          onToggle={() => setRunning((r) => !r)}
          onReset={() => { setResetKey((k) => k + 1); setRunning(true); }}
        />
      </Box>

      <Typography sx={{ position: 'absolute', bottom: 16, right: 16, fontSize: 11, color: 'text.secondary' }}>
        drag to orbit
      </Typography>
    </Box>
  );
}
