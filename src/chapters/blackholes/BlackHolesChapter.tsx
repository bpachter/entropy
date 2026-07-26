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
import { CosmicPanel } from './components/CosmicPanel';
import { blackHoleBlocks, type BlackHoleBlock } from './content';
import { EventHorizon } from './visuals/EventHorizon';
import { HawkingTemperature } from './visuals/HawkingTemperature';
import { HeatDeath } from './visuals/HeatDeath';
import { KernelCell } from '@/components/layout/KernelCell';

const A_QUARTER_OF_THE_AREA_IN_REA_CODE = String.raw`
# The one equation that makes G, hbar, c and k stand in the same small room.
# No black-hole quantity below is quoted: the Planck length, the horizon
# radius, its area, the entropy, the Hawking temperature and the evaporation
# time are all built from these four constants. The masses, the CMB
# temperature and the entropy budget are measured inputs, cited where used.
from math import pi, sqrt, log10

G    = 6.67430e-11        # m^3 kg^-1 s^-2   (CODATA 2018)
C    = 2.99792458e8       # m/s              (exact by definition)
HBAR = 1.054571817e-34    # J s              (h/2pi; h is exact, this is cut)
KB   = 1.380649e-23       # J/K              (exact by definition)
MSUN = 1.98847e30         # kg
YEAR = 3.15576e7          # s
T_CMB = 2.72548           # K, COBE/FIRAS

LP = sqrt(HBAR * G / C**3)                                # Planck length, derived
print(f"Planck length  l_P = sqrt(hbar G / c^3) = {LP:.4e} m")
print(f"one Planck tile      l_P^2              = {LP*LP:.4e} m^2\n")

r_s      = lambda M: 2 * G * M / C**2                      # horizon radius
area     = lambda M: 4 * pi * r_s(M)**2                    # horizon area
S_over_k = lambda M: area(M) / (4 * LP * LP)               # Bekenstein-Hawking
T_H      = lambda M: HBAR * C**3 / (8 * pi * G * M * KB)   # Hawking temperature
life_yr  = lambda M: 5120 * pi * G**2 * M**3 / (HBAR * C**4) / YEAR

print(f"{'':24s} {'r_s':>10s} {'S/k_B':>10s} {'T_H (K)':>10s} {'life (yr)':>10s}")
print("-" * 68)
for name, m in [("one solar mass", 1.0), ("Sgr A*  (GRAVITY '22)", 4.297e6),
                ("M87*    (EHT '19)", 6.5e9)]:
    M = m * MSUN
    r = r_s(M)
    r_txt = f"{r/1000:.3g} km" if r < 1e9 else f"{r/1.496e11:.3g} AU"
    print(f"{name:24s} {r_txt:>10s} {S_over_k(M):10.2e} {T_H(M):10.2e} {life_yr(M):10.2e}")

M = MSUN
print(f"\na hole of one solar mass:")
print(f"  horizon radius   {r_s(M):.0f} m -- the Sun folded down to a small town")
print(f"  entropy          {S_over_k(M):.3e} k_B")
print(f"  temperature      {T_H(M):.3e} K -- {T_CMB/T_H(M):.2e} times colder than the")
print(f"                   microwave sky it sits in, so it absorbs. It cannot begin")
print(f"                   to evaporate until the sky itself cools below it.")

# The Sun's own thermodynamic entropy is quoted near 1e58 k_B (Penrose; Egan &
# Lineweaver 2010) -- an order-of-magnitude figure, not a measurement.
print(f"\n  the Sun as a star carries ~1e58 k_B (an order-of-magnitude figure,")
print(f"  not a measurement). Collapse it and the count rises by a factor of")
print(f"  {S_over_k(M)/1e58:.1e}. Nothing else the universe does comes close.")

# Egan & Lineweaver 2010, entropy budget of the observable universe, in k_B.
budget = [("supermassive black holes", 3.1e104), ("the CMB photons", 2.03e89),
          ("all the stars", 9.5e80)]
print(f"\nentropy of the observable universe (Egan & Lineweaver 2010), in k_B:")
for name, v in budget:
    print(f"  {name:26s} {v:9.2e}  10^{log10(v):5.1f}  {'#' * round(log10(v) - 78)}")
print(f"  the holes hold {budget[0][1]/budget[1][1]:.1e} times the microwave glow and")
print(f"  {budget[0][1]/budget[2][1]:.1e} times every stellar interior combined.")
print(f"  And because S grows as M^2, that total is the work of the few")
print(f"  largest: it is {budget[0][1]/S_over_k(1e9*MSUN):.1e} holes of a billion solar masses'")
print(f"  worth of entropy, but only {budget[0][1]/S_over_k(1e11*MSUN):.1e} of a hundred billion.")

# Two masses worth solving for.
m_cmb = HBAR * C**3 / (8 * pi * G * KB * T_CMB)
print(f"\na hole exactly as warm as the CMB weighs {m_cmb:.3e} kg = {m_cmb/7.342e22:.2f} Moons,")
print(f"  with a horizon {2*r_s(m_cmb)*1e6:.0f} micrometres across -- about the thickness")
print(f"  of a sheet of paper. Anything lighter is hotter than the sky, and is")
print(f"  shrinking right now.")

m_googol = MSUN * (1e100 / life_yr(MSUN))**(1/3)
print(f"\nthe chapter's 10^100 years asks for a hole of {m_googol/MSUN:.1e} solar masses:")
print(f"  the ultramassive class, at the top of anything ever claimed -- and")
print(f"  that is the bare evaporation time, ignoring the aeons a real hole")
print(f"  spends absorbing the sky before it can start to shrink at all.")
`;

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
                {i === Math.floor(arr.length * 0.28) && <ContextPlate slug="m87-blackhole" />}
              {i === Math.floor(arr.length * 0.28) && (
                <KernelCell
                  title="a quarter of the area, in real numbers"
                  intro={<>Four constants and one equation. Nothing about the holes themselves is quoted here — the Planck length, the horizon radius, its area, the entropy, the Hawking temperature and the evaporation time are all built from G, ħ, c and k, and only the masses, the microwave-background temperature and the entropy budget enter as measured inputs. It works the numbers for a stellar-mass hole, for Sgr A* and for M87*, then turns the arithmetic around and asks which mass the chapter's googol years actually requires.</>}
                  code={A_QUARTER_OF_THE_AREA_IN_REA_CODE}
                />
              )}
                {i === Math.floor(arr.length / 2) && <FigurePlate layout="banner" figure={chapter.figures[1]} index={chapter.index} />}
                {i === Math.floor(arr.length * 0.8) && <ContextPlate slug="hubble-field" />}
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
