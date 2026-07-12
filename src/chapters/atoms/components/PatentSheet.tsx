import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { VisualGate } from '@/anim/gate';

/**
 * Movement II's frame: an interactive presented as a sheet from a patent
 * filing — "FIG. 1" drawing-office header, faint violet drafting grid, and a
 * double-ruled border like a period patent plate.
 */
export function PatentSheet({
  fig,
  title,
  caption,
  children,
}: {
  fig: string;
  title: string;
  caption: string;
  children: ReactNode;
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.6 }}>
      <Box sx={{ maxWidth: 1000, mx: 'auto', my: { xs: 5, md: 9 } }}>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5, mb: 1.25 }}>
          <Typography sx={{ fontFamily: "'JetBrains Mono Variable', monospace", fontSize: 12, color: 'primary.main', letterSpacing: '0.16em' }}>
            {fig}
          </Typography>
          <Box sx={{ flex: 1, height: 1, bgcolor: 'rgba(255,255,255,0.12)' }} />
          <Typography sx={{ fontFamily: "'Fraunces Variable', serif", fontSize: 17, color: 'text.primary' }}>{title}</Typography>
        </Box>

        {/* double-ruled drafting sheet */}
        <Box sx={{ p: 0.75, borderRadius: 2.5, border: '1px solid rgba(154,123,255,0.3)' }}>
          <Box
            sx={{
              borderRadius: 1.75,
              p: { xs: 1.5, md: 2.5 },
              border: '1px solid rgba(154,123,255,0.18)',
              backgroundColor: '#0b0b16',
              backgroundImage:
                'linear-gradient(rgba(154,123,255,0.05) 1px, transparent 1px),' +
                'linear-gradient(90deg, rgba(154,123,255,0.05) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          >
            <VisualGate>{children}</VisualGate>
          </Box>
        </Box>

        <Typography sx={{ mt: 2, fontStyle: 'italic', fontFamily: "'Fraunces Variable', serif", color: 'text.secondary', fontSize: 15, textAlign: 'center', maxWidth: 720, mx: 'auto' }}>
          {caption}
        </Typography>
      </Box>
    </motion.div>
  );
}
