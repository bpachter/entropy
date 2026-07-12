import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { VisualGate } from '@/anim/gate';

/**
 * Chapter Six's signature frame: an interactive presented as a signal on an
 * oscilloscope — a teal phosphor grid, a corner transmission tag, and a faint
 * scanline. A terminal/transmission identity distinct from every prior chapter.
 */
export function SignalPanel({
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
    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.6 }}>
      <Box sx={{ maxWidth: 980, mx: 'auto', my: { xs: 5, md: 9 } }}>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5, mb: 1.25, fontFamily: "'JetBrains Mono Variable', monospace" }}>
          <Typography sx={{ fontFamily: 'inherit', fontSize: 12, color: 'primary.main', letterSpacing: '0.16em' }}>
            SIGNAL {index}
          </Typography>
          <Box sx={{ flex: 1, borderTop: '1px dashed rgba(45,212,191,0.3)' }} />
          <Typography sx={{ fontFamily: "'Fraunces Variable', serif", fontSize: 17, color: 'text.primary' }}>{name}</Typography>
        </Box>

        <Box
          sx={{
            position: 'relative',
            borderRadius: 2,
            p: { xs: 1.5, md: 2.5 },
            overflow: 'hidden',
            border: '1px solid rgba(45,212,191,0.28)',
            backgroundColor: '#060b0d',
            backgroundImage:
              'linear-gradient(rgba(45,212,191,0.055) 1px, transparent 1px),' +
              'linear-gradient(90deg, rgba(56,189,248,0.055) 1px, transparent 1px)',
            backgroundSize: '22px 22px',
            boxShadow: 'inset 0 0 50px -20px rgba(45,212,191,0.5)',
          }}
        >
          {/* phosphor scanline */}
          <Box aria-hidden sx={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'repeating-linear-gradient(0deg, transparent 0 3px, rgba(0,0,0,0.14) 3px 4px)', opacity: 0.5 }} />
          <Box sx={{ position: 'relative' }}><VisualGate>{children}</VisualGate></Box>
        </Box>

        <Typography sx={{ mt: 2, fontStyle: 'italic', fontFamily: "'Fraunces Variable', serif", color: 'text.secondary', fontSize: 15, textAlign: 'center', maxWidth: 720, mx: 'auto' }}>
          {caption}
        </Typography>
      </Box>
    </motion.div>
  );
}
