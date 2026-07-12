import { Box, Typography } from '@mui/material';
import KeyboardArrowDownRounded from '@mui/icons-material/KeyboardArrowDownRounded';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import type { Chapter } from '@/content/types';
import { FigurePlate } from './FigurePlate';

/**
 * Full-height chapter title cover. Structure is shared across chapters so the
 * book feels coherent, but the palette and an optional bespoke `backdrop` give
 * each chapter its own atmosphere.
 */
export function ChapterHero({ chapter, backdrop }: { chapter: Chapter; backdrop?: ReactNode }) {
  const { palette } = chapter;
  return (
    <Box
      component="section"
      sx={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        px: { xs: 3, md: 8 },
        py: 12,
        overflow: 'hidden',
      }}
    >
      {backdrop ?? (
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            inset: 0,
            background:
              `radial-gradient(60% 80% at 8% 40%, ${hexA(palette.primary, 0.2)}, transparent 60%),` +
              `radial-gradient(60% 80% at 92% 60%, ${hexA(palette.secondary, 0.18)}, transparent 60%),` +
              `radial-gradient(120% 120% at 50% 120%, rgba(0,0,0,0.4), ${palette.bg} 70%)`,
          }}
        />
      )}

      <Box sx={{ position: 'relative', maxWidth: 940 }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <Typography variant="overline" sx={{ color: 'primary.light', fontSize: 13 }}>
            {chapter.kicker}
          </Typography>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '3rem', sm: '4.5rem', md: '6.5rem' },
              lineHeight: 0.98,
              my: 2,
              background: `linear-gradient(100deg, ${palette.primarySoft} 0%, #eef1f8 48%, ${palette.secondarySoft} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {chapter.title}
          </Typography>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.25 }}>
          <Typography
            sx={{
              fontFamily: "'Fraunces Variable', Georgia, serif",
              fontSize: { xs: '1.3rem', md: '1.8rem' },
              color: 'text.primary',
              maxWidth: 720,
              lineHeight: 1.3,
            }}
          >
            {chapter.subtitle}.
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 3, mb: 4 }}>
            <Typography sx={{ fontFamily: "'JetBrains Mono Variable', monospace", color: 'text.secondary', fontSize: 14 }}>
              {chapter.era}
            </Typography>
            <Box sx={{ flex: 1, maxWidth: 160, height: 1, background: `linear-gradient(90deg, ${hexA(palette.primary, 0.5)}, transparent)` }} />
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 2.5, md: 3.5 } }}>
            {chapter.figures.map((f) => (
              <FigurePlate key={f.name} figure={f} layout="card" />
            ))}
          </Box>
        </motion.div>
      </Box>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ opacity: { delay: 1 }, y: { repeat: Infinity, duration: 2 } }}
        style={{ position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)' }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'text.secondary' }}>
          <Typography sx={{ fontSize: 12, letterSpacing: '0.15em', mb: 0.5 }}>BEGIN</Typography>
          <KeyboardArrowDownRounded />
        </Box>
      </motion.div>
    </Box>
  );
}

/** hex (#rrggbb) + alpha → rgba() string. */
export function hexA(hex: string, a: number): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}
