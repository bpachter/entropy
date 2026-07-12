import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { VisualGate } from '@/anim/gate';

/**
 * Chapter Five's signature frame: a lecture "demonstration" under an organic
 * membrane — a soft, living green rim with an inner glow, rounded like a
 * culture dish rather than Chapter Four's hard microscope circle. Evokes the
 * 1943 Dublin lectures where Schrödinger argued life's case to a packed hall.
 */
export function Demonstration({
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
      <Box sx={{ maxWidth: 940, mx: 'auto', my: { xs: 5, md: 9 } }}>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5, mb: 1.5 }}>
          <Box sx={{ width: 9, height: 9, borderRadius: '50%', bgcolor: 'primary.main', boxShadow: '0 0 10px rgba(94,194,127,0.8)' }} />
          <Typography sx={{ fontFamily: "'JetBrains Mono Variable', monospace", fontSize: 12, color: 'primary.main', letterSpacing: '0.16em' }}>
            DEMONSTRATION {index}
          </Typography>
          <Box sx={{ flex: 1, height: 1, bgcolor: 'rgba(255,255,255,0.1)' }} />
          <Typography sx={{ fontFamily: "'Fraunces Variable', serif", fontSize: 17, color: 'text.primary' }}>{name}</Typography>
        </Box>

        {/* membrane: double soft rim + inner culture-dish glow */}
        <Box
          sx={{
            p: { xs: 1.25, md: 2 },
            borderRadius: '28px',
            border: '1px solid rgba(94,194,127,0.35)',
            background: 'radial-gradient(140% 120% at 50% 0%, rgba(94,194,127,0.06), transparent 55%)',
          }}
        >
          <Box
            sx={{
              borderRadius: '22px',
              p: { xs: 1.5, md: 2.5 },
              border: '1px solid rgba(94,194,127,0.16)',
              background: 'radial-gradient(120% 130% at 50% 10%, #0c130e, #06090a)',
              boxShadow: 'inset 0 0 60px -30px rgba(94,194,127,0.5)',
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
