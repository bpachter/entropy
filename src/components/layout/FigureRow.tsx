import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import type { Figure } from '@/content/types';
import { portraitBySlug } from '@/assets/portraits';

function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join('');
}

/** A single protagonist: a real portrait in a tinted ring, or initials as a fallback. */
function FigureAvatar({ figure, size }: { figure: Figure; size: number }) {
  const [broken, setBroken] = useState(false);
  const tint = figure.tone === 'hot' ? '#ff6a43' : '#42a6ff';
  const url = figure.img ? portraitBySlug[figure.img] : undefined;

  const shell = {
    width: size,
    height: size,
    borderRadius: '50%',
    flexShrink: 0,
    border: `1.5px solid ${tint}77`,
    boxShadow: `0 0 0 3px ${tint}14, inset 0 1px 2px rgba(0,0,0,0.35)`,
  } as const;

  if (url && !broken) {
    return (
      <Box
        component="img"
        src={url}
        alt={figure.name}
        loading="lazy"
        onError={() => setBroken(true)}
        sx={{
          ...shell,
          objectFit: 'cover',
          objectPosition: '50% 20%',
          background: '#12141c',
          // A whisper of desaturation harmonises the mix of oil painting, sepia
          // and mid-century photographs into one gallery.
          filter: 'grayscale(0.12) contrast(1.02)',
          display: 'block',
        }}
      />
    );
  }

  return (
    <Box
      sx={{
        ...shell,
        display: 'grid',
        placeItems: 'center',
        fontFamily: "'Fraunces Variable', serif",
        fontWeight: 600,
        fontSize: size * 0.36,
        color: tint,
        background: `radial-gradient(circle at 30% 30%, ${tint}26, transparent 70%)`,
      }}
    >
      {initials(figure.name)}
    </Box>
  );
}

/** Row of the chapter's protagonists as portrait medallions. */
export function FigureRow({ figures, compact }: { figures: Figure[]; compact?: boolean }) {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 2, md: 3.5 } }}>
      {figures.map((f) => (
        <Box key={f.name} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <FigureAvatar figure={f} size={compact ? 38 : 50} />
          <Box>
            <Typography sx={{ fontSize: compact ? 13 : 14.5, fontWeight: 600, lineHeight: 1.15 }}>{f.name}</Typography>
            <Typography sx={{ fontSize: 11.5, color: 'text.secondary' }}>
              {f.years}
              {!compact && ` · ${f.role}`}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
}
