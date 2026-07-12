import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { VisualGate } from '@/anim/gate';

/**
 * Chapter Seven's signature frame: an interactive set in deep space — a violet
 * void with a faint event-horizon rim glow. The book's finale gets a cosmic
 * identity of its own.
 */
export function CosmicPanel({
  index,
  name,
  caption,
  children,
}: {
  index: string;
  name: string;
  caption: string;
  children: ReactNode;
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.7 }}>
      <Box sx={{ maxWidth: 980, mx: 'auto', my: { xs: 5, md: 9 } }}>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5, mb: 1.25 }}>
          <Typography sx={{ fontFamily: "'JetBrains Mono Variable', monospace", fontSize: 12, color: 'primary.light', letterSpacing: '0.18em' }}>
            {index}
          </Typography>
          <Box sx={{ flex: 1, height: 1, background: 'linear-gradient(90deg, rgba(157,123,255,0.4), transparent)' }} />
          <Typography sx={{ fontFamily: "'Fraunces Variable', serif", fontSize: 17, color: 'text.primary' }}>{name}</Typography>
        </Box>

        <Box
          sx={{
            position: 'relative',
            borderRadius: 3,
            p: { xs: 1.5, md: 2.5 },
            overflow: 'hidden',
            border: '1px solid rgba(157,123,255,0.28)',
            background: 'radial-gradient(130% 130% at 50% 0%, #120f22, #05060b 70%)',
            boxShadow: 'inset 0 0 80px -30px rgba(157,123,255,0.6)',
          }}
        >
          <VisualGate>{children}</VisualGate>
        </Box>

        <Typography sx={{ mt: 2, fontStyle: 'italic', fontFamily: "'Fraunces Variable', serif", color: 'text.secondary', fontSize: 15, textAlign: 'center', maxWidth: 720, mx: 'auto' }}>
          {caption}
        </Typography>
      </Box>
    </motion.div>
  );
}
