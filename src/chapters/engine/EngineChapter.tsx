import { Box, Typography, ThemeProvider } from '@mui/material';
import { motion } from 'framer-motion';
import { chapterById } from '@/content/chapters';
import { makeChapterTheme } from '@/theme';
import { ChapterChrome } from '@/components/layout/ChapterChrome';
import { ChapterHero } from '@/components/layout/ChapterHero';
import { ChapterFooter } from '@/components/layout/ChapterFooter';
import { VisualGate } from '@/anim/gate';
import { engineBlocks, type EngineBlock, type PlateId } from './content';
import { SteamEngine } from './visuals/SteamEngine';
import { HeatWaterfall } from './visuals/HeatWaterfall';
import { CarnotCycle } from './visuals/CarnotCycle';

const chapter = chapterById('engine')!;
const theme = makeChapterTheme(chapter.palette);

const PLATES: Record<PlateId, () => JSX.Element> = {
  engine: SteamEngine,
  waterfall: HeatWaterfall,
  cycle: CarnotCycle,
};

/**
 * Chapter One reads like an illustrated engineering treatise: a centred column
 * of prose with full-width interactive "plates" set into it — a deliberately
 * different rhythm from Chapter Three's pinned scrollytelling.
 */
export function EngineChapter() {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: 'background.default', color: 'text.primary', minHeight: '100vh' }}>
        <ChapterChrome chapter={chapter} />
        <ChapterHero chapter={chapter} backdrop={<FireboxBackdrop />} />

        <Box sx={{ px: { xs: 2.5, md: 4 }, py: { xs: 4, md: 8 } }}>
          {engineBlocks.map((block, i) => (block.kind === 'prose' ? <Prose key={i} block={block} /> : <Plate key={i} block={block} />))}
        </Box>

        <ChapterFooter chapter={chapter} />
      </Box>
    </ThemeProvider>
  );
}

function Prose({ block }: { block: Extract<EngineBlock, { kind: 'prose' }> }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.55 }}>
      <Box sx={{ maxWidth: 700, mx: 'auto', py: { xs: 4, md: 6 } }}>
        {block.eyebrow && <Typography variant="overline" sx={{ color: 'primary.light', display: 'block', mb: 1.5 }}>{block.eyebrow}</Typography>}
        {block.heading && <Typography variant="h3" sx={{ fontSize: { xs: '1.8rem', md: '2.3rem' }, mb: 2.5, lineHeight: 1.12 }}>{block.heading}</Typography>}
        {block.body.map((p, i) => (
          <Typography key={i} variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>{p}</Typography>
        ))}
        {block.pullquote && (
          <Box component="blockquote" sx={{ m: 0, mt: 4, pl: 3, borderLeft: '3px solid', borderColor: 'secondary.main' }}>
            <Typography sx={{ fontFamily: "'Fraunces Variable', Georgia, serif", fontStyle: 'italic', fontSize: '1.45rem', lineHeight: 1.4 }}>
              “{block.pullquote.text}”
            </Typography>
            <Typography sx={{ mt: 1, fontSize: 13, color: 'text.secondary' }}>— {block.pullquote.cite}</Typography>
          </Box>
        )}
      </Box>
    </motion.div>
  );
}

function Plate({ block }: { block: Extract<EngineBlock, { kind: 'plate' }> }) {
  const Visual = PLATES[block.plate];
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.6 }}>
      <Box sx={{ maxWidth: 1000, mx: 'auto', my: { xs: 5, md: 8 } }}>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5, mb: 1.5, borderBottom: '1px solid rgba(255,255,255,0.12)', pb: 1 }}>
          <Typography sx={{ fontFamily: "'JetBrains Mono Variable', monospace", fontSize: 12.5, color: 'primary.main', letterSpacing: '0.1em' }}>{block.figure}</Typography>
          <Typography sx={{ fontFamily: "'Fraunces Variable', serif", fontSize: 18, color: 'text.primary' }}>{block.title}</Typography>
        </Box>
        <VisualGate><Visual /></VisualGate>
        <Typography sx={{ mt: 2, fontStyle: 'italic', fontFamily: "'Fraunces Variable', serif", color: 'text.secondary', fontSize: 15, textAlign: 'center', maxWidth: 720, mx: 'auto' }}>
          {block.caption}
        </Typography>
      </Box>
    </motion.div>
  );
}

/** Ember glow rising from a sooty firebox — Chapter One's atmosphere. */
function FireboxBackdrop() {
  return (
    <Box
      aria-hidden
      sx={{
        position: 'absolute',
        inset: 0,
        background:
          'radial-gradient(80% 60% at 50% 118%, rgba(255,138,61,0.34), transparent 62%),' +
          'radial-gradient(50% 40% at 82% 8%, rgba(127,177,201,0.12), transparent 60%),' +
          'radial-gradient(120% 120% at 50% 120%, rgba(0,0,0,0.5), #0b0806 72%)',
      }}
    />
  );
}
