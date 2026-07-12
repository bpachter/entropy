import { Fragment } from 'react';
import { Box, ThemeProvider } from '@mui/material';
import { chapterById } from '@/content/chapters';
import { makeChapterTheme } from '@/theme';
import { ChapterChrome } from '@/components/layout/ChapterChrome';
import { ChapterHero } from '@/components/layout/ChapterHero';
import { ChapterFooter } from '@/components/layout/ChapterFooter';
import { FigurePlate } from '@/components/layout/FigurePlate';
import { LogEntry } from './components/LogEntry';
import { InstrumentPanel } from './components/InstrumentPanel';
import { lawsBlocks } from './content';
import { Paddlewheel } from './visuals/Paddlewheel';
import { AbsoluteZero } from './visuals/AbsoluteZero';
import { HeatEngineLedger } from './visuals/HeatEngineLedger';

const chapter = chapterById('laws')!;
const theme = makeChapterTheme(chapter.palette);

const INSTRUMENTS = {
  paddlewheel: Paddlewheel,
  absolutezero: AbsoluteZero,
  ledger: HeatEngineLedger,
} as const;

/**
 * Chapter Two — a laboratory field logbook: dated logbook entries interleaved
 * with graph-paper instrument panels. A third distinct rhythm from Chapter
 * One's plates and Chapter Three's pinned scrollytelling.
 */
export function LawsChapter() {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: 'background.default', color: 'text.primary', minHeight: '100vh' }}>
        <ChapterChrome chapter={chapter} />
        <ChapterHero chapter={chapter} backdrop={<LogbookBackdrop />} />

        <Box sx={{ px: { xs: 2.5, md: 4 }, py: { xs: 4, md: 8 } }}>
          {lawsBlocks.map((block, i, arr) => {
            let el;
            if (block.kind === 'entry') {
              el = <LogEntry block={block} />;
            } else {
              const Visual = INSTRUMENTS[block.instrument];
              el = (
                <InstrumentPanel index={block.index} name={block.name} caption={block.caption}>
                  <Visual />
                </InstrumentPanel>
              );
            }
            return (
              <Fragment key={i}>
                {el}
                {i === Math.floor(arr.length / 2) && <FigurePlate layout="banner" figure={chapter.figures[0]} index={chapter.index} />}
              </Fragment>
            );
          })}
        </Box>

        <ChapterFooter chapter={chapter} />
      </Box>
    </ThemeProvider>
  );
}

/** Faint graph-paper wash with a warm brass glow — the logbook's page. */
function LogbookBackdrop() {
  return (
    <Box
      aria-hidden
      sx={{
        position: 'absolute',
        inset: 0,
        backgroundColor: '#0a090c',
        backgroundImage:
          'radial-gradient(60% 60% at 80% 10%, rgba(245,183,60,0.12), transparent 60%),' +
          'radial-gradient(60% 60% at 12% 80%, rgba(87,194,224,0.10), transparent 60%),' +
          'linear-gradient(rgba(245,183,60,0.04) 1px, transparent 1px),' +
          'linear-gradient(90deg, rgba(87,194,224,0.04) 1px, transparent 1px)',
        backgroundSize: 'auto, auto, 30px 30px, 30px 30px',
      }}
    />
  );
}
