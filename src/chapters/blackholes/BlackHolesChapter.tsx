import { Fragment } from 'react';
import { Box, Typography, ThemeProvider } from '@mui/material';
import { motion } from 'framer-motion';
import { chapterById } from '@/content/chapters';
import { makeChapterTheme } from '@/theme';
import { ChapterChrome } from '@/components/layout/ChapterChrome';
import { ChapterHero } from '@/components/layout/ChapterHero';
import { ChapterFooter } from '@/components/layout/ChapterFooter';
import { FigurePlate } from '@/components/layout/FigurePlate';
import { CosmicPanel } from './components/CosmicPanel';
import { blackHoleBlocks, type BlackHoleBlock } from './content';
import { EventHorizon } from './visuals/EventHorizon';
import { HawkingTemperature } from './visuals/HawkingTemperature';
import { HeatDeath } from './visuals/HeatDeath';

const chapter = chapterById('blackholes')!;
const theme = makeChapterTheme(chapter.palette);

const PANELS = { horizon: EventHorizon, temperature: HawkingTemperature, heatdeath: HeatDeath } as const;

/**
 * Chapter Seven — the finale. A cinematic single column through deep space,
 * with cosmic panels and a closing movement styled apart, drawing the whole
 * book shut. A seventh distinct rhythm.
 */
export function BlackHolesChapter() {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: 'background.default', color: 'text.primary', minHeight: '100vh' }}>
        <ChapterChrome chapter={chapter} />
        <ChapterHero chapter={chapter} backdrop={<VoidBackdrop />} />

        <Box sx={{ px: { xs: 2.5, md: 4 }, py: { xs: 4, md: 8 } }}>
          {blackHoleBlocks.map((block, i, arr) => {
            let el;
            if (block.kind === 'movement') {
              el = <Movement block={block} />;
            } else {
              const Visual = PANELS[block.visual];
              el = (
                <CosmicPanel index={block.index} name={block.name} caption={block.caption}>
                  <Visual />
                </CosmicPanel>
              );
            }
            return (
              <Fragment key={i}>
                {el}
                {i === Math.floor(arr.length / 2) && <FigurePlate layout="banner" figure={chapter.figures[1]} index={chapter.index} />}
              </Fragment>
            );
          })}
        </Box>

        <ChapterFooter chapter={chapter} />
      </Box>
    </ThemeProvider>
  );
}

function Movement({ block }: { block: Extract<BlackHoleBlock, { kind: 'movement' }> }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.6 }}>
      <Box sx={{ maxWidth: block.finale ? 760 : 720, mx: 'auto', py: { xs: 4, md: block.finale ? 8 : 6 }, textAlign: block.finale ? 'center' : 'left' }}>
        {block.eyebrow && (
          <Typography variant="overline" sx={{ color: 'primary.light', display: 'block', mb: 1.5 }}>{block.eyebrow}</Typography>
        )}
        <Typography variant={block.finale ? 'h2' : 'h3'} sx={{ fontSize: block.finale ? { xs: '2.1rem', md: '3rem' } : { xs: '1.8rem', md: '2.3rem' }, mb: 3, lineHeight: 1.12, background: block.finale ? 'linear-gradient(100deg,#c4adff,#eef1f8,#ffd0a3)' : undefined, WebkitBackgroundClip: block.finale ? 'text' : undefined, WebkitTextFillColor: block.finale ? 'transparent' : undefined, backgroundClip: block.finale ? 'text' : undefined }}>
          {block.heading}
        </Typography>
        {block.body.map((p, i) => (
          <Typography key={i} variant="body1" sx={{ color: block.finale ? 'text.primary' : 'text.secondary', mb: 2, fontSize: block.finale ? '1.15rem' : undefined }}>{p}</Typography>
        ))}
        {block.pullquote && (
          <Box sx={{ my: 4, textAlign: 'center', px: { xs: 0, md: 4 } }}>
            <Typography sx={{ fontFamily: "'Fraunces Variable', Georgia, serif", fontStyle: 'italic', fontSize: { xs: '1.5rem', md: '1.9rem' }, lineHeight: 1.4, background: 'linear-gradient(100deg,#c4adff,#ffd0a3)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              “{block.pullquote.text}”
            </Typography>
            <Typography sx={{ mt: 1.5, fontSize: 13, color: 'text.secondary' }}>— {block.pullquote.cite}</Typography>
          </Box>
        )}
        {block.finale && (
          <Box sx={{ mt: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
            <Box sx={{ width: 40, height: 1, background: 'linear-gradient(90deg, transparent, #9d7bff)' }} />
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', background: 'radial-gradient(circle,#000 40%,#9d7bff)' }} />
            <Box sx={{ width: 40, height: 1, background: 'linear-gradient(90deg, #9d7bff, transparent)' }} />
          </Box>
        )}
      </Box>
    </motion.div>
  );
}

/** A black-hole void with a violet accretion rim behind the title. */
function VoidBackdrop() {
  return (
    <Box
      aria-hidden
      sx={{
        position: 'absolute',
        inset: 0,
        background:
          'radial-gradient(circle 200px at 76% 32%, #000 96px, rgba(157,123,255,0.28) 116px, rgba(255,171,94,0.14) 150px, transparent 220px),' +
          'radial-gradient(60% 70% at 20% 84%, rgba(157,123,255,0.12), transparent 60%),' +
          'radial-gradient(120% 120% at 50% 120%, rgba(0,0,0,0.6), #05060b 72%)',
      }}
    />
  );
}
