import { Fragment } from 'react';
import { Box, Typography, ThemeProvider } from '@mui/material';
import { motion } from 'framer-motion';
import { chapterById } from '@/content/chapters';
import { makeChapterTheme } from '@/theme';
import { ChapterChrome } from '@/components/layout/ChapterChrome';
import { ChapterHero } from '@/components/layout/ChapterHero';
import { ChapterFooter } from '@/components/layout/ChapterFooter';
import { FigurePlate } from '@/components/layout/FigurePlate';
import { SignalPanel } from './components/SignalPanel';
import { infoBlocks, type InfoBlock } from './content';
import { EntropyMeter } from './visuals/EntropyMeter';
import { NoisyChannel } from './visuals/NoisyChannel';
import { LandauerLedger } from './visuals/LandauerLedger';

const chapter = chapterById('information')!;
const theme = makeChapterTheme(chapter.palette);

const SIGNALS = { entropymeter: EntropyMeter, channel: NoisyChannel, landauer: LandauerLedger } as const;

/**
 * Chapter Six reads like a transmission log: TX-marked prose blocks and
 * oscilloscope "signal" panels on a teal phosphor grid — a sixth distinct
 * rhythm after plates, logbook, pinned scrolly, annotated paper, and lecture.
 */
export function InformationChapter() {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: 'background.default', color: 'text.primary', minHeight: '100vh' }}>
        <ChapterChrome chapter={chapter} />
        <ChapterHero chapter={chapter} backdrop={<SignalBackdrop />} />

        <Box sx={{ px: { xs: 2.5, md: 4 }, py: { xs: 4, md: 8 } }}>
          {infoBlocks.map((block, i, arr) => {
            let el;
            if (block.kind === 'transmission') {
              el = <Transmission block={block} />;
            } else {
              const Visual = SIGNALS[block.visual];
              el = (
                <SignalPanel index={block.index} name={block.name} caption={block.caption}>
                  <Visual />
                </SignalPanel>
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

function Transmission({ block }: { block: Extract<InfoBlock, { kind: 'transmission' }> }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.55 }}>
      <Box sx={{ maxWidth: 720, mx: 'auto', py: { xs: 4, md: 6 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
          <Typography sx={{ fontFamily: "'JetBrains Mono Variable', monospace", fontSize: 12, color: 'primary.main', letterSpacing: '0.14em' }}>{block.marker}</Typography>
          <Box sx={{ flex: 1, borderTop: '1px dashed rgba(45,212,191,0.25)' }} />
        </Box>
        <Typography variant="h3" sx={{ fontSize: { xs: '1.8rem', md: '2.3rem' }, mb: 2.5, lineHeight: 1.13 }}>{block.heading}</Typography>
        {block.body.map((p, i) => (
          <Typography key={i} variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>{p}</Typography>
        ))}
        {block.pullquote && (
          <Box sx={{ my: 4, textAlign: 'center', px: { xs: 0, md: 4 } }}>
            <Typography sx={{ fontFamily: "'Fraunces Variable', Georgia, serif", fontStyle: 'italic', fontSize: { xs: '1.4rem', md: '1.7rem' }, lineHeight: 1.4, color: 'text.primary' }}>
              “{block.pullquote.text}”
            </Typography>
            <Typography sx={{ mt: 1.5, fontSize: 13, color: 'text.secondary' }}>— {block.pullquote.cite}</Typography>
          </Box>
        )}
      </Box>
    </motion.div>
  );
}

/** Faint carrier-wave + bitfield backdrop. */
function SignalBackdrop() {
  return (
    <Box
      aria-hidden
      sx={{
        position: 'absolute',
        inset: 0,
        backgroundColor: '#06090c',
        backgroundImage:
          'radial-gradient(50% 60% at 82% 22%, rgba(45,212,191,0.16), transparent 60%),' +
          'radial-gradient(45% 55% at 14% 82%, rgba(56,189,248,0.12), transparent 60%),' +
          'linear-gradient(90deg, rgba(45,212,191,0.05) 1px, transparent 1px)',
        backgroundSize: 'auto, auto, 20px 100%',
      }}
    />
  );
}
