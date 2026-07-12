import { memo } from 'react';
import { Box } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import type { VisualKind } from '@/content/types';
import { MixingSim } from '@/components/sim/MixingSim';
import { MicrostatesViz } from '@/components/sim/MicrostatesViz';
import { DemonSim } from '@/components/sim/DemonSim';

function render(kind: VisualKind) {
  switch (kind) {
    case 'mixing':
      return <MixingSim />;
    case 'microstates':
      return <MicrostatesViz />;
    case 'demon':
      return <DemonSim />;
  }
}

/**
 * The pinned interactive. It swaps to a new sim only when the *kind* changes, so
 * scrolling between two beats that share a visual keeps the same live instance
 * running rather than remounting the canvas.
 */
export const StickyVisual = memo(function StickyVisual({ kind }: { kind: VisualKind }) {
  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
        borderRadius: 3,
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.09)',
        bgcolor: '#080a0f',
        boxShadow: '0 30px 80px -40px rgba(0,0,0,0.9)',
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={kind}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.32 }}
          style={{ position: 'absolute', inset: 0 }}
        >
          {render(kind)}
        </motion.div>
      </AnimatePresence>
    </Box>
  );
});
