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
import { SignalPanel } from './components/SignalPanel';
import { infoBlocks, type InfoBlock } from './content';
import { EntropyMeter } from './visuals/EntropyMeter';
import { NoisyChannel } from './visuals/NoisyChannel';
import { LandauerLedger } from './visuals/LandauerLedger';
import { KernelCell } from '@/components/layout/KernelCell';

const THE_PRICE_OF_FORGETTING_ONE__CODE = String.raw`
# Landauer's bound: erasing one bit must dissipate at least k*T*ln2 of heat.
# Everything below is that single line, pushed until it says something.
from math import log, log10

KB = 1.380649e-23        # J/K -- exact by SI definition since 2019
LN2 = log(2)

def floor_j(T):          # joules per bit erased, at temperature T
    return KB * T * LN2

T = 300.0                # "room temperature", 26.85 C
bit = floor_j(T)
print(f"k T ln2 at {T:.0f} K = {bit:.4e} J per bit erased")
print(f"the chapter quotes about 2.9e-21 J -- a gap of {abs(bit - 2.9e-21) / 2.9e-21:.1%}")
print()

print("the same floor at other temperatures:")
for name, t in [("the CMB", 2.725), ("liquid helium", 4.2),
                ("room", 300.0), ("a turbine inlet", 1700.0)]:
    print(f"  {name:16s} {t:8.3f} K   {floor_j(t):.3e} J/bit   ({floor_j(t) / bit:6.3f} x room)")
print("  cold is cheap: forgetting costs a hundred times less out in the")
print("  microwave sky than it does on your desk.")
print()

# What the bound buys. One joule, spent perfectly.
print(f"one joule spent exactly at the floor erases {1 / bit:.3e} bits"
      f" = {1 / bit / 8 / 1e18:.1f} exabytes")

# A year of the world's data. IDC's Global DataSphere counts data CREATED,
# captured and replicated in a year -- most of which is never stored anywhere
# -- and runs near 200 ZB in the mid-2020s. It is a projection, not a census,
# so treat it as an exponent rather than a figure.
year_bits = 200 * 8e21
cost = year_bits * bit
print("erasing one year of the world's CREATED data (~200 ZB, IDC's")
print("Global DataSphere projection), at the floor:")
print(f"  {year_bits:.1e} bits x {bit:.3e} J = {cost:.0f} J")
print(f"  enough to warm one litre of water by {cost / 4186:.2f} K,")
print(f"  or to run a 10 W bulb for {cost / 10:.0f} seconds.")
print()

# The distance to real hardware. Only the first row is a measurement; the
# other three are order-of-magnitude engineering numbers. The ratios are the
# point, and they are ratios no engineering can ever push below one.
print(f"{'operation':36s} {'J/bit':>9s}   {'x the floor':>11s}")
print("-" * 72)
for name, e in [
    ("Berut 2012, slowest bead erasure", 3.0e-21),   # measured, ~1.0 k T ln2
    ("one CMOS gate transition, 5 nm",   2.0e-17),
    ("DRAM read/write, system level",    1.0e-11),
    ("a bit written to spinning disk",   1.0e-09),
]:
    r = e / bit
    print(f"{name:36s} {e:9.1e}   {r:11.2e}  {'|' * int(log10(r))}".rstrip())
print()
print("Each stroke is a full power of ten above the thermodynamic floor.")
print("Landauer's limit is not why your laptop runs hot: one logic gate")
print("spends some seven thousand times the floor, one system-level DRAM")
print("access some three and a half billion times. But the floor does not")
print("move. A colloidal bead, erased slowly enough, has already been")
print("measured sitting on it, and nothing will ever get underneath.")
`;

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
                {i === Math.floor(arr.length * 0.3) && <ContextPlate slug="shannon-diagram" />}
                {i === Math.floor(arr.length / 2) && <FigurePlate layout="banner" figure={chapter.figures[0]} index={chapter.index} />}
              {i === Math.floor(arr.length / 2) && (
                <KernelCell
                  title="the price of forgetting one bit"
                  intro={<>The chapter puts a number on forgetting — about 2.9 × 10⁻²¹ joules — and a number that small is hard to place. This computes it from the defined value of Boltzmann's constant, prices a year of the world's data at that floor, and then measures the distance to the hardware actually humming on your desk. A single logic gate spends about seven thousand times the floor; a bit written to a spinning disk, three hundred billion times. One 2012 experiment sits within four percent of the floor itself, and nothing has ever got underneath it.</>}
                  code={THE_PRICE_OF_FORGETTING_ONE__CODE}
                />
              )}
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
