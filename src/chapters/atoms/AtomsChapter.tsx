import { Fragment } from 'react';
import { Box, Typography, ThemeProvider } from '@mui/material';
import { motion } from 'framer-motion';
import { chapterById } from '@/content/chapters';
import { makeChapterTheme } from '@/theme';
import { ChapterChrome } from '@/components/layout/ChapterChrome';
import { ChapterHero } from '@/components/layout/ChapterHero';
import { ChapterFooter } from '@/components/layout/ChapterFooter';
import { FigurePlate } from '@/components/layout/FigurePlate';
import { ContextPlate } from '@/components/layout/ContextPlate';
import { SpecimenVignette } from './components/SpecimenVignette';
import { PatentSheet } from './components/PatentSheet';
import { atomsBlocks, type AtomsBlock } from './content';
import { BrownianSim } from './visuals/BrownianSim';
import { EinsteinRuler } from './visuals/EinsteinRuler';
import { SzilardFridge } from './visuals/SzilardFridge';

const chapter = chapterById('atoms')!;
const theme = makeChapterTheme(chapter.palette);

const SPECIMENS = { brownian: BrownianSim, ruler: EinsteinRuler } as const;

/**
 * Chapter Four reads like an annotated scientific paper in two movements:
 * §-numbered entries with margin sidenotes, microscope specimen vignettes in
 * Movement I, and patent-drawing sheets in Movement II — a fourth rhythm after
 * Ch.1's engraving plates, Ch.2's field logbook, and Ch.3's pinned scrolly.
 */
export function AtomsChapter() {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: 'background.default', color: 'text.primary', minHeight: '100vh' }}>
        <ChapterChrome chapter={chapter} />
        <ChapterHero chapter={chapter} backdrop={<MicroscopeBackdrop />} />

        <Box sx={{ px: { xs: 2.5, md: 4 }, py: { xs: 4, md: 8 } }}>
          {atomsBlocks.map((block, i, arr) => {
            let el;
            if (block.kind === 'divider') {
              el = <MovementDivider label={block.label} />;
            } else if (block.kind === 'prose') {
              el = <Annotated block={block} />;
            } else if (block.kind === 'specimen') {
              const Visual = SPECIMENS[block.visual];
              el = (
                <SpecimenVignette index={block.index} name={block.name} label={block.label} caption={block.caption}>
                  <Visual />
                </SpecimenVignette>
              );
            } else {
              el = (
                <PatentSheet fig={block.fig} title={block.title} caption={block.caption}>
                  <SzilardFridge />
                </PatentSheet>
              );
            }
            return (
              <Fragment key={i}>
                {el}
                {i === Math.floor(arr.length * 0.28) && <ContextPlate slug="perrin-brownian" />}
                {i === Math.floor(arr.length / 2) && <FigurePlate layout="banner" figure={chapter.figures[0]} index={chapter.index} />}
                {i === Math.floor(arr.length * 0.72) && <ContextPlate slug="einstein-fridge" />}
              </Fragment>
            );
          })}
        </Box>

        <ChapterFooter chapter={chapter} />
      </Box>
    </ThemeProvider>
  );
}

function Annotated({ block }: { block: Extract<AtomsBlock, { kind: 'prose' }> }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.55 }}>
      <Box sx={{ maxWidth: 780, mx: 'auto', py: { xs: 4, md: 6 }, overflow: 'hidden' }}>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5, mb: 1 }}>
          <Typography sx={{ fontFamily: "'JetBrains Mono Variable', monospace", fontSize: 13, color: 'primary.light', fontWeight: 700 }}>
            {block.section}
          </Typography>
          <Box sx={{ flex: 1, height: 1, bgcolor: 'rgba(255,255,255,0.1)' }} />
          <Typography sx={{ fontFamily: "'JetBrains Mono Variable', monospace", fontSize: 12, color: 'text.secondary' }}>
            {block.stamp}
          </Typography>
        </Box>
        <Typography variant="h3" sx={{ fontSize: { xs: '1.75rem', md: '2.2rem' }, mb: 2.5, lineHeight: 1.13 }}>
          {block.heading}
        </Typography>

        {block.sidenote && (
          <Box
            sx={{
              float: { xs: 'none', md: 'right' },
              width: { xs: '100%', md: 248 },
              ml: { md: 3 },
              mb: 1.5,
              p: 1.75,
              borderRadius: 2,
              border: '1px solid rgba(154,123,255,0.28)',
              bgcolor: 'rgba(154,123,255,0.06)',
            }}
          >
            <Typography sx={{ fontFamily: "'JetBrains Mono Variable', monospace", fontSize: 10.5, letterSpacing: '0.14em', color: 'primary.light', mb: 0.75 }}>
              {block.sidenote.title.toUpperCase()}
            </Typography>
            {block.sidenote.lines.map((l, i) => (
              <Typography key={i} sx={{ fontSize: 12.5, color: 'text.secondary', lineHeight: 1.55, mb: 0.4 }}>
                {l}
              </Typography>
            ))}
          </Box>
        )}

        {block.body.map((p, i) => (
          <Typography key={i} variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>
            {p}
          </Typography>
        ))}

        {block.pullquote && (
          <Box component="blockquote" sx={{ m: 0, mt: 3.5, pl: 3, borderLeft: '3px solid', borderColor: 'secondary.main', clear: 'both' }}>
            <Typography sx={{ fontFamily: "'Fraunces Variable', Georgia, serif", fontStyle: 'italic', fontSize: '1.35rem', lineHeight: 1.4 }}>
              “{block.pullquote.text}”
            </Typography>
            <Typography sx={{ mt: 1, fontSize: 13, color: 'text.secondary' }}>— {block.pullquote.cite}</Typography>
          </Box>
        )}
      </Box>
    </motion.div>
  );
}

function MovementDivider({ label }: { label: string }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, maxWidth: 780, mx: 'auto', py: { xs: 3, md: 5 } }}>
      <Box sx={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, rgba(154,123,255,0.5))' }} />
      <Typography sx={{ fontFamily: "'JetBrains Mono Variable', monospace", fontSize: 12, letterSpacing: '0.22em', color: '#c2adff', whiteSpace: 'nowrap' }}>
        {label}
      </Typography>
      <Box sx={{ flex: 1, height: 1, background: 'linear-gradient(90deg, rgba(154,123,255,0.5), transparent)' }} />
    </Box>
  );
}

/** Dark-field halo — the view down a microscope tube, violet ring and teal spill. */
function MicroscopeBackdrop() {
  return (
    <Box
      aria-hidden
      sx={{
        position: 'absolute',
        inset: 0,
        background:
          'radial-gradient(circle 230px at 74% 30%, transparent 148px, rgba(154,123,255,0.16) 158px, transparent 214px),' +
          'radial-gradient(circle 60px at 74% 30%, rgba(194,173,255,0.1), transparent 60px),' +
          'radial-gradient(55% 70% at 14% 78%, rgba(79,214,192,0.12), transparent 62%),' +
          'radial-gradient(120% 120% at 50% 120%, rgba(0,0,0,0.5), #08080e 72%)',
      }}
    />
  );
}
