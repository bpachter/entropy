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
import { VisualGate } from '@/anim/gate';
import { engineBlocks, type EngineBlock, type PlateId } from './content';
import { SteamEngine } from './visuals/SteamEngine';
import { HeatWaterfall } from './visuals/HeatWaterfall';
import { CarnotCycle } from './visuals/CarnotCycle';
import { KernelCell } from '@/components/layout/KernelCell';

const CARNOT_S_CEILING_AGAINST_REA_CODE = String.raw`
# Carnot's ceiling, held against machines people actually built.
# eta = 1 - Tc/Th is a hard upper bound on ANY heat engine between two
# reservoirs. Curzon and Ahlborn (Am. J. Phys. 43, 22, 1975) asked a different
# question -- what is the efficiency of an engine tuned for maximum POWER
# rather than maximum efficiency -- and got 1 - sqrt(Tc/Th). The three plants
# below, with their measured efficiencies, are the table from that paper.
from math import sqrt

plants = [
    # name,                       Th (K), Tc (K), measured efficiency
    ("West Thurrock coal, UK",      838,    298,  0.36),
    ("CANDU nuclear, Canada",       573,    298,  0.30),
    ("Larderello geothermal, IT",   523,    353,  0.16),
]

print(f"{'plant':27s} {'Th':>4s} {'Tc':>4s} {'Carnot':>7s} {'C-A':>6s} {'built':>6s}")
print("-" * 60)
for name, th, tc, obs in plants:
    carnot = 1 - tc / th
    ca = 1 - sqrt(tc / th)
    print(f"{name:27s} {th:4d} {tc:4d} {carnot:7.3f} {ca:6.3f} {obs:6.3f}")

print()
for name, th, tc, obs in plants:
    carnot = 1 - tc / th
    ca = 1 - sqrt(tc / th)
    print(f"{name.split(',')[0]:22s}  {obs/carnot:5.0%} of Carnot   "
          f"{obs - ca:+.3f} vs Curzon-Ahlborn")
print()
print("  every one lands between 49 and 63 percent of its own Carnot ceiling,")
print("  and within five points of the maximum-power line. The ceiling is not")
print("  a target anybody is closing on; the square root is where they live.")

# Carnot says only the two temperatures matter. So: how hot would the fire
# have to be to reach a given efficiency against a 298 K river?
print()
print("with a 298 K cold sink, the fire Carnot demands:")
for target in (0.40, 0.60, 0.80, 0.90, 0.99):
    th = 298 / (1 - target)
    print(f"  eta = {target:4.0%}   ->  Th = {th:7.0f} K  ({th - 273.15:6.0f} C)")
print()
print("  eta = 100%  ->  Th = infinite, or Tc = 0 K. The universe supplies neither.")
`;

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
          {engineBlocks.map((block, i, arr) => (
            <Fragment key={i}>
              {block.kind === 'prose' ? <Prose block={block} /> : <Plate block={block} />}
              {i === Math.floor(arr.length * 0.3) && <ContextPlate slug="steam-engine" />}
              {i === Math.floor(arr.length / 2) && <FigurePlate layout="banner" figure={chapter.figures[0]} index={chapter.index} />}
              {i === Math.floor(arr.length / 2) && (
                <KernelCell
                  title="carnot's ceiling, against real plants"
                  intro={<>Carnot's limit is easy to state and hard to feel. Here it is held against three power stations with published efficiencies, and against a one-line refinement — Curzon and Ahlborn's 1 − √(Tc/Th), which asks not what an engine could achieve but what it achieves when it is tuned for power rather than for perfection. All three plants land between 49 and 63 percent of their Carnot ceiling, and within five points of the square root. The ceiling is not a target anybody is closing on.</>}
                  code={CARNOT_S_CEILING_AGAINST_REA_CODE}
                />
              )}
            </Fragment>
          ))}
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
