import { Box, Typography, ThemeProvider } from '@mui/material';
import { motion } from 'framer-motion';
import { chapterById } from '@/content/chapters';
import { makeChapterTheme } from '@/theme';
import { ChapterChrome } from '@/components/layout/ChapterChrome';
import { ChapterHero } from '@/components/layout/ChapterHero';
import { ChapterFooter } from '@/components/layout/ChapterFooter';
import { Demonstration } from './components/Demonstration';
import { lifeBlocks, type LifeBlock } from './content';
import { FluctuationLaw } from './visuals/FluctuationLaw';
import { EntropyPump } from './visuals/EntropyPump';
import { CodeScript } from './visuals/CodeScript';

const chapter = chapterById('life')!;
const theme = makeChapterTheme(chapter.palette);

const DEMOS = { fluctuation: FluctuationLaw, entropypump: EntropyPump, codescript: CodeScript } as const;

/**
 * Chapter Five reads like a lecture from that packed 1943 hall: an unbroken
 * flow of prose with large centered "theses," and live demonstrations set
 * under organic membranes — a fifth distinct rhythm from the plates, logbook,
 * pinned scrolly, and annotated paper of the chapters before it.
 */
export function LifeChapter() {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: 'background.default', color: 'text.primary', minHeight: '100vh' }}>
        <ChapterChrome chapter={chapter} />
        <ChapterHero chapter={chapter} backdrop={<CellBackdrop />} />

        <Box sx={{ px: { xs: 2.5, md: 4 }, py: { xs: 4, md: 8 } }}>
          {lifeBlocks.map((block, i) => {
            if (block.kind === 'passage') return <Passage key={i} block={block} />;
            const Visual = DEMOS[block.visual];
            return (
              <Demonstration key={i} index={block.index} name={block.name} caption={block.caption}>
                <Visual />
              </Demonstration>
            );
          })}
        </Box>

        <ChapterFooter chapter={chapter} />
      </Box>
    </ThemeProvider>
  );
}

function Passage({ block }: { block: Extract<LifeBlock, { kind: 'passage' }> }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.55 }}>
      <Box sx={{ maxWidth: 720, mx: 'auto', py: { xs: 4, md: 6 } }}>
        {block.eyebrow && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
            <Box sx={{ width: 22, height: 1.5, bgcolor: 'primary.main' }} />
            <Typography variant="overline" sx={{ color: 'primary.light' }}>{block.eyebrow}</Typography>
          </Box>
        )}
        {block.heading && (
          <Typography variant="h3" sx={{ fontSize: { xs: '1.8rem', md: '2.3rem' }, mb: 2.5, lineHeight: 1.13 }}>{block.heading}</Typography>
        )}
        {block.body.map((p, i) => (
          <Typography key={i} variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>{p}</Typography>
        ))}
        {block.pullquote && (
          <Box sx={{ my: 4, textAlign: 'center', px: { xs: 0, md: 4 } }}>
            <Typography sx={{ fontFamily: "'Fraunces Variable', Georgia, serif", fontStyle: 'italic', fontSize: { xs: '1.5rem', md: '1.9rem' }, lineHeight: 1.35, color: 'text.primary' }}>
              “{block.pullquote.text}”
            </Typography>
            <Typography sx={{ mt: 1.5, fontSize: 13, color: 'text.secondary', letterSpacing: '0.05em' }}>— {block.pullquote.cite}</Typography>
          </Box>
        )}
      </Box>
    </motion.div>
  );
}

/** Soft dividing-cell blobs in the chapter's green. */
function CellBackdrop() {
  return (
    <Box
      aria-hidden
      sx={{
        position: 'absolute',
        inset: 0,
        background:
          'radial-gradient(38% 46% at 78% 26%, rgba(94,194,127,0.18), transparent 62%),' +
          'radial-gradient(30% 36% at 66% 32%, rgba(182,217,90,0.12), transparent 60%),' +
          'radial-gradient(46% 56% at 16% 82%, rgba(79,214,192,0.10), transparent 62%),' +
          'radial-gradient(120% 120% at 50% 120%, rgba(0,0,0,0.5), #06090a 72%)',
      }}
    />
  );
}
