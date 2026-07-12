import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { VisualGate } from '@/anim/gate';

/**
 * Movement I's frame: an interactive presented as a microscope specimen — a
 * mono "SPECIMEN A" tag, a serif name, and an italic caption beneath. The
 * dark-field circular stage itself lives inside each visual; this wrapper
 * supplies the specimen-label identity that distinguishes Chapter Four from
 * Chapter One's plates and Chapter Two's instruments.
 */
export function SpecimenVignette({
  index,
  name,
  label,
  caption,
  children,
}: {
  index: string;
  name: string;
  /** The brass specimen-plate line, e.g. "granules in water · 20 °C". */
  label: string;
  caption: string;
  children: ReactNode;
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.6 }}>
      <Box sx={{ maxWidth: 980, mx: 'auto', my: { xs: 5, md: 9 } }}>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5, mb: 1.25 }}>
          <Typography sx={{ fontFamily: "'JetBrains Mono Variable', monospace", fontSize: 12, color: 'primary.main', letterSpacing: '0.16em' }}>
            SPECIMEN {index}
          </Typography>
          <Box sx={{ flex: 1, height: 1, bgcolor: 'rgba(255,255,255,0.12)' }} />
          <Typography sx={{ fontFamily: "'Fraunces Variable', serif", fontSize: 17, color: 'text.primary' }}>{name}</Typography>
        </Box>

        <Box
          sx={{
            borderRadius: 3,
            p: { xs: 1.5, md: 2.5 },
            border: '1px solid rgba(154,123,255,0.2)',
            background: 'radial-gradient(120% 140% at 50% 0%, #0d0d18, #08080e)',
          }}
        >
          <VisualGate>{children}</VisualGate>
          {/* specimen plate */}
          <Box sx={{ mt: 1.5, display: 'flex', justifyContent: 'center' }}>
            <Typography
              sx={{
                px: 1.5, py: 0.4, borderRadius: 1,
                border: '1px solid rgba(154,123,255,0.35)',
                bgcolor: 'rgba(154,123,255,0.07)',
                fontFamily: "'JetBrains Mono Variable', monospace",
                fontSize: 11.5, color: '#c2adff', letterSpacing: '0.08em',
              }}
            >
              {label}
            </Typography>
          </Box>
        </Box>

        <Typography sx={{ mt: 2, fontStyle: 'italic', fontFamily: "'Fraunces Variable', serif", color: 'text.secondary', fontSize: 15, textAlign: 'center', maxWidth: 720, mx: 'auto' }}>
          {caption}
        </Typography>
      </Box>
    </motion.div>
  );
}
