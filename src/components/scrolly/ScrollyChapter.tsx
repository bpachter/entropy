import { useRef } from 'react';
import { Box } from '@mui/material';
import type { Chapter } from '@/content/types';
import { useActiveStep } from '@/hooks/useActiveStep';
import { AnimationActiveContext, useInView } from '@/anim/gate';
import { StickyVisual } from './StickyVisual';
import { BeatCard } from './BeatCard';

/**
 * The scrollytelling core: a pinned interactive on one side, the story stepping
 * past it on the other. The active step drives which sim is shown.
 */
export function ScrollyChapter({ chapter }: { chapter: Chapter }) {
  const { active, setRef } = useActiveStep(chapter.beats.length);
  const activeKind = chapter.beats[active]?.visual ?? 'mixing';
  const stickyRef = useRef<HTMLDivElement>(null);
  const visualInView = useInView(stickyRef); // pause the WebGL gas when scrolled past

  return (
    <Box
      sx={{
        display: { xs: 'block', md: 'grid' },
        gridTemplateColumns: { md: 'minmax(0,1fr) minmax(0,1fr)' },
        columnGap: { md: 6 },
        maxWidth: 1320,
        mx: 'auto',
        px: { xs: 2, md: 5 },
      }}
    >
      {/* Pinned visual (right on desktop, top on mobile). */}
      <Box
        ref={stickyRef}
        sx={{
          position: 'sticky',
          top: { xs: 56, md: 96 },
          alignSelf: 'start',
          gridColumn: { md: 2 },
          gridRow: { md: 1 },
          height: { xs: '50vh', md: 'min(720px, calc(100vh - 140px))' },
          mb: { xs: 3, md: 0 },
          zIndex: 3,
        }}
      >
        <AnimationActiveContext.Provider value={visualInView}>
          <StickyVisual kind={activeKind} />
        </AnimationActiveContext.Provider>
      </Box>

      {/* Narrative steps (left on desktop). */}
      <Box sx={{ gridColumn: { md: 1 }, gridRow: { md: 1 } }}>
        {chapter.beats.map((beat, i) => (
          <Box
            key={beat.id}
            data-step={i}
            ref={setRef(i)}
            sx={{
              minHeight: { xs: '64vh', md: '82vh' },
              display: 'flex',
              alignItems: 'center',
              py: { xs: 3, md: 0 },
            }}
          >
            <BeatCard beat={beat} active={i === active} />
          </Box>
        ))}
      </Box>
    </Box>
  );
}
