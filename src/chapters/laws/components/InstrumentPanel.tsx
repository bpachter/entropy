import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { VisualGate } from '@/anim/gate';

/**
 * Chapter Two's signature frame: an interactive presented as a laboratory
 * instrument on graph paper, with brass corner brackets and a gauge-style
 * header. Gives the chapter a "field logbook" identity distinct from Chapter
 * One's engraving plates.
 */
export function InstrumentPanel({
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
      <Box sx={{ maxWidth: 1000, mx: 'auto', my: { xs: 5, md: 9 } }}>
        {/* header */}
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5, mb: 1.25 }}>
          <Typography sx={{ fontFamily: "'JetBrains Mono Variable', monospace", fontSize: 12, color: 'primary.main', letterSpacing: '0.16em' }}>
            INSTRUMENT {index}
          </Typography>
          <Box sx={{ flex: 1, height: 1, bgcolor: 'rgba(255,255,255,0.12)' }} />
          <Typography sx={{ fontFamily: "'Fraunces Variable', serif", fontSize: 17, color: 'text.primary' }}>{name}</Typography>
        </Box>

        {/* framed graph-paper panel with brass corners */}
        <Box
          sx={{
            position: 'relative',
            borderRadius: 2,
            p: { xs: 1.5, md: 2.5 },
            border: '1px solid rgba(245,183,60,0.22)',
            backgroundColor: '#0a0b0e',
            backgroundImage:
              'linear-gradient(rgba(245,183,60,0.05) 1px, transparent 1px),' +
              'linear-gradient(90deg, rgba(87,194,224,0.05) 1px, transparent 1px)',
            backgroundSize: '26px 26px',
          }}
        >
          {(['tl', 'tr', 'bl', 'br'] as const).map((c) => (
            <Corner key={c} pos={c} />
          ))}
          <VisualGate>{children}</VisualGate>
        </Box>

        <Typography sx={{ mt: 2, fontStyle: 'italic', fontFamily: "'Fraunces Variable', serif", color: 'text.secondary', fontSize: 15, textAlign: 'center', maxWidth: 720, mx: 'auto' }}>
          {caption}
        </Typography>
      </Box>
    </motion.div>
  );
}

function Corner({ pos }: { pos: 'tl' | 'tr' | 'bl' | 'br' }) {
  const base = { position: 'absolute', width: 16, height: 16, borderColor: '#d9a441' } as const;
  const map = {
    tl: { top: -1, left: -1, borderTop: '2px solid', borderLeft: '2px solid', borderTopLeftRadius: 6 },
    tr: { top: -1, right: -1, borderTop: '2px solid', borderRight: '2px solid', borderTopRightRadius: 6 },
    bl: { bottom: -1, left: -1, borderBottom: '2px solid', borderLeft: '2px solid', borderBottomLeftRadius: 6 },
    br: { bottom: -1, right: -1, borderBottom: '2px solid', borderRight: '2px solid', borderBottomRightRadius: 6 },
  } as const;
  return <Box sx={{ ...base, ...map[pos] }} />;
}
