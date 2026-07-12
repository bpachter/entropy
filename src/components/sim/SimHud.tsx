import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import PlayArrowRounded from '@mui/icons-material/PlayArrowRounded';
import PauseRounded from '@mui/icons-material/PauseRounded';
import RestartAltRounded from '@mui/icons-material/RestartAltRounded';

const panelSx = {
  bgcolor: 'rgba(8,10,15,0.66)',
  border: '1px solid rgba(255,255,255,0.09)',
  borderRadius: 2,
  backdropFilter: 'blur(8px)',
  px: 1.75,
  py: 1.25,
} as const;

/** A labelled 0→1 bar with a gradient fill; the storytelling meter of the app. */
export function EntropyMeter({
  value,
  label,
  caption,
  gradient = 'linear-gradient(90deg,#3aa0ff,#d7dae6,#ff5330)',
}: {
  value: number;
  label: string;
  caption?: string;
  gradient?: string;
}) {
  const pct = Math.round(Math.min(1, Math.max(0, value)) * 100);
  return (
    <Box sx={{ ...panelSx, minWidth: 210 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 0.75 }}>
        <Typography variant="overline" sx={{ color: 'text.secondary', lineHeight: 1 }}>
          {label}
        </Typography>
        <Typography sx={{ fontFamily: "'JetBrains Mono Variable', monospace", fontSize: 14, color: '#eef1f8' }}>
          {pct}%
        </Typography>
      </Box>
      <Box sx={{ position: 'relative', height: 8, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
        <Box sx={{ position: 'absolute', inset: 0, width: `${pct}%`, background: gradient, transition: 'width 0.12s linear' }} />
      </Box>
      {caption && (
        <Typography sx={{ mt: 0.75, fontSize: 11.5, color: 'text.secondary', lineHeight: 1.35 }}>{caption}</Typography>
      )}
    </Box>
  );
}

/** Two-sided temperature gauge for the demon's chambers. */
export function TempBars({ left, right, max }: { left: number; right: number; max: number }) {
  const l = Math.min(1, left / max);
  const r = Math.min(1, right / max);
  return (
    <Box sx={{ ...panelSx, minWidth: 210 }}>
      <Typography variant="overline" sx={{ color: 'text.secondary' }}>
        Chamber temperature
      </Typography>
      <Row label="Left" value={l} color="#3aa0ff" align="left" />
      <Row label="Right" value={r} color="#ff5330" align="right" />
    </Box>
  );
}

function Row({ label, value, color, align }: { label: string; value: number; color: string; align: 'left' | 'right' }) {
  return (
    <Box sx={{ mt: 0.75 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.25 }}>
        <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>{label}</Typography>
      </Box>
      <Box sx={{ height: 7, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.08)', overflow: 'hidden', display: 'flex', justifyContent: align === 'right' ? 'flex-end' : 'flex-start' }}>
        <Box sx={{ height: '100%', width: `${Math.round(value * 100)}%`, bgcolor: color, transition: 'width 0.12s linear' }} />
      </Box>
    </Box>
  );
}

export function SimControls({
  running,
  onToggle,
  onReset,
}: {
  running: boolean;
  onToggle: () => void;
  onReset: () => void;
}) {
  return (
    <Box sx={{ ...panelSx, display: 'flex', gap: 0.5, py: 0.5, px: 0.75 }}>
      <Tooltip title={running ? 'Pause' : 'Play'}>
        <IconButton size="small" onClick={onToggle} sx={{ color: '#eef1f8' }}>
          {running ? <PauseRounded fontSize="small" /> : <PlayArrowRounded fontSize="small" />}
        </IconButton>
      </Tooltip>
      <Tooltip title="Reset">
        <IconButton size="small" onClick={onReset} sx={{ color: '#eef1f8' }}>
          <RestartAltRounded fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
