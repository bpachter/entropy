import { Box, Typography } from '@mui/material';
import type { Figure } from '@/content/types';

function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join('');
}

/** Row of the chapter's protagonists as tinted initial-avatars. */
export function FigureRow({ figures, compact }: { figures: Figure[]; compact?: boolean }) {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 2, md: 3.5 } }}>
      {figures.map((f) => {
        const c = f.tone === 'hot' ? '#ff6a43' : '#42a6ff';
        return (
          <Box key={f.name} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: compact ? 34 : 46,
                height: compact ? 34 : 46,
                borderRadius: '50%',
                display: 'grid',
                placeItems: 'center',
                flexShrink: 0,
                fontFamily: "'Fraunces Variable', serif",
                fontWeight: 600,
                fontSize: compact ? 13 : 16,
                color: c,
                border: `1px solid ${c}66`,
                background: `radial-gradient(circle at 30% 30%, ${c}22, transparent 70%)`,
              }}
            >
              {initials(f.name)}
            </Box>
            <Box>
              <Typography sx={{ fontSize: compact ? 13 : 14.5, fontWeight: 600, lineHeight: 1.15 }}>{f.name}</Typography>
              <Typography sx={{ fontSize: 11.5, color: 'text.secondary' }}>
                {f.years}
                {!compact && ` · ${f.role}`}
              </Typography>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}
