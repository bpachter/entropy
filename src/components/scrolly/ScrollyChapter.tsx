import { Fragment, useRef } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import type { Chapter, VisualKind } from '@/content/types';
import { useActiveStep } from '@/hooks/useActiveStep';
import { AnimationActiveContext, useInView } from '@/anim/gate';
import { StickyVisual } from './StickyVisual';
import { BeatCard } from './BeatCard';

/**
 * The scrollytelling core. On desktop it's a pinned interactive on one side with
 * the story stepping past it. On phones a pinned, opaque visual would sit on top
 * of the text (which then scrolls *behind* it), so mobile instead flows each
 * visual inline where its topic begins — natural, top-to-bottom reading.
 */
export function ScrollyChapter({ chapter }: { chapter: Chapter }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  return isMobile ? <MobileScrolly chapter={chapter} /> : <DesktopScrolly chapter={chapter} />;
}

/** Desktop: a pinned interactive that swaps with the reader's active beat. */
function DesktopScrolly({ chapter }: { chapter: Chapter }) {
  const { active, setRef } = useActiveStep(chapter.beats.length);
  const activeKind = chapter.beats[active]?.visual ?? 'mixing';
  const stickyRef = useRef<HTMLDivElement>(null);
  const visualInView = useInView(stickyRef);

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)',
        columnGap: 6,
        maxWidth: 1320,
        mx: 'auto',
        px: 5,
      }}
    >
      <Box
        ref={stickyRef}
        sx={{ position: 'sticky', top: 96, alignSelf: 'start', gridColumn: 2, gridRow: 1, height: 'min(720px, calc(100vh - 140px))', zIndex: 3 }}
      >
        <AnimationActiveContext.Provider value={visualInView}>
          <StickyVisual kind={activeKind} />
        </AnimationActiveContext.Provider>
      </Box>

      <Box sx={{ gridColumn: 1, gridRow: 1 }}>
        {chapter.beats.map((beat, i) => (
          <Box key={beat.id} data-step={i} ref={setRef(i)} sx={{ minHeight: '82vh', display: 'flex', alignItems: 'center' }}>
            <BeatCard beat={beat} active={i === active} />
          </Box>
        ))}
      </Box>
    </Box>
  );
}

/** Mobile: visuals set inline where each new topic begins; story reads straight down. */
function MobileScrolly({ chapter }: { chapter: Chapter }) {
  let prevKind: VisualKind | null = null;
  return (
    <Box sx={{ maxWidth: 560, mx: 'auto', px: 2 }}>
      {chapter.beats.map((beat) => {
        const showVisual = beat.visual !== prevKind;
        prevKind = beat.visual;
        return (
          <Fragment key={beat.id}>
            {showVisual && <InlineStage kind={beat.visual} />}
            <Box sx={{ py: 3 }}>
              <BeatCard beat={beat} active />
            </Box>
          </Fragment>
        );
      })}
    </Box>
  );
}

/**
 * A visual mounted only while it's near the viewport, so scrolling a chapter
 * never holds more than a couple of live WebGL contexts on a phone. The framed
 * box keeps its height whether or not the sim is mounted, so nothing jumps.
 */
function InlineStage({ kind }: { kind: VisualKind }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, '600px 0px');
  return (
    <Box
      ref={ref}
      sx={{
        position: 'relative',
        height: '56vh',
        my: 2,
        borderRadius: 3,
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.09)',
        bgcolor: '#080a0f',
        boxShadow: '0 24px 60px -40px rgba(0,0,0,0.9)',
      }}
    >
      {inView && (
        <AnimationActiveContext.Provider value={inView}>
          <StickyVisual kind={kind} />
        </AnimationActiveContext.Provider>
      )}
    </Box>
  );
}
