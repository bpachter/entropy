import { Box, Typography, ThemeProvider } from '@mui/material';
import { entropyChapter } from '@/content/chapters';
import { makeChapterTheme } from '@/theme';
import { ChapterChrome } from '@/components/layout/ChapterChrome';
import { ChapterHero } from '@/components/layout/ChapterHero';
import { ChapterFooter } from '@/components/layout/ChapterFooter';
import { FigurePlate } from '@/components/layout/FigurePlate';
import { ContextPlate } from '@/components/layout/ContextPlate';
import { ScrollyChapter } from '@/components/scrolly/ScrollyChapter';
import { KernelCell } from '@/components/layout/KernelCell';

const COUNTING_W_ONE_MICROSTATE_AT_CODE = String.raw`
# S = k log W. The W is a count, so count it -- no formula, just enumeration.
# Twenty molecules in a box divided down the middle. Each molecule is either
# left or right, so a microstate is a 20-bit number; there are 2**20 of them,
# and we walk every single one, sorting by how many landed on the left.
from math import comb, log

N = 20
tally = [0] * (N + 1)
for state in range(1 << N):
    tally[bin(state).count("1")] += 1        # molecules on the left

print(f"every microstate of a {N}-molecule box, enumerated ({1 << N:,} of them)")
print()
peak = max(tally)
blank = 0
for left in range(N + 1):
    W = tally[left]
    bar = "#" * round(40 * W / peak)
    if not bar:
        blank += 1
    mark = "  <- one arrangement" if W == 1 else ""
    row = f"  {left:2d} left /{N - left:3d} right   W = {W:7,d}  {bar}{mark}"
    print(row.rstrip())

assert all(tally[k] == comb(N, k) for k in range(N + 1))
print("\n  counts agree with math.comb to the last unit: W is the binomial")
print(f"  coefficient. {blank} of the {N + 1} macrostates are too rare to draw any bar")
print("  at all at this scale, and the two perfectly tidy ones, marked above,")
print(f"  hold exactly one arrangement each: 1 part in {1 << N:,}.")

# Now the number the chapter quotes, for a box too big to walk: sixty molecules.
KB = 1.380649e-23                            # J/K -- exact by SI definition, 2019
BIG = 60
w_corner = comb(BIG, BIG)                    # all sixty on one side: one arrangement
w_even = comb(BIG, BIG // 2)                 # thirty and thirty
print(f"\nN = {BIG}   W(all on one side) = {w_corner}")
print(f"         W(evenly split)    = {w_even:,}")
print(f"                            = {w_even:.3e}, which is indeed more than")
print(f"                              a hundred thousand trillion (1e17).")
print(f"         S(even) - S(corner) = k ln(W_even/W_corner) = "
      f"{KB * log(w_even):.3e} J/K")
print(f"         (one macrostate. Counting the whole 2^N space instead, a mole")
print(f"          of the same wager carries R ln2 = "
      f"{8.314462618 * log(2):.3f} J/K/mol.)")

# The chapter's claim is about odds, not about a force. So: how long would you
# wait to catch the gas back in the corner? Allow one independent reshuffle per
# molecular collision, roughly 5e9 per second for air at room temperature.
SHUFFLE = 5e9
AGE = 4.35e17                                # age of the universe, seconds
print("\nwaiting for all N molecules to be caught on the left, at 5e9/s:")
for n in (10, 30, 60, 100, 200):
    wait = 2.0 ** n / SHUFFLE
    if wait < 60:
        pretty = f"{wait:.2g} seconds"
    elif wait < 3.156e7:
        pretty = f"{wait / 86400:.2g} days"
    elif wait < AGE:
        pretty = f"{wait / 3.156e7:.3g} years"
    else:
        pretty = f"{wait / AGE:.2g} x the age of the universe"
    print(f"   N = {n:3d}   1 in 2^{n} = {2.0 ** n:.2e}   ->  {pretty}")

print("\n  Sixty molecules: a wait you could sit out. A hundred: never, and")
print("  never by an enormous margin. A real breath of air holds about 2e22.")
`;

const theme = makeChapterTheme(entropyChapter.palette);

/** Chapter Three — the original showcase: a pinned interactive per narrative beat. */
export function EntropyChapter() {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: 'background.default', color: 'text.primary', minHeight: '100vh' }}>
        <ChapterChrome chapter={entropyChapter} />
        <ChapterHero chapter={entropyChapter} />

        <Box sx={{ textAlign: 'center', px: 3, pt: { xs: 2, md: 4 }, pb: { xs: 4, md: 8 } }}>
          <Typography variant="overline" sx={{ color: 'primary.light' }}>{entropyChapter.kicker}</Typography>
          <Typography variant="h2" sx={{ fontSize: { xs: '2.1rem', md: '3rem' } }}>{entropyChapter.title}</Typography>
        </Box>

        <ScrollyChapter chapter={entropyChapter} />

        <Box sx={{ px: { xs: 2.5, md: 4 } }}>
          <FigurePlate
            layout="banner"
            figure={entropyChapter.figures[2]}
            index={entropyChapter.index}
            blurb="Entropy is counting: S = k log W. He staked his life on atoms being real, and did not live to be proved right."
          />
          <ContextPlate slug="boltzmann-grave" />
              <KernelCell
                title="counting W, one microstate at a time"
                intro={<>The equation on the headstone is not a definition, it is a count — so the honest thing to do is count. This walks every one of the 1,048,576 microstates of a twenty-molecule box, sorts them by how many molecules landed on the left, checks the tally against math.comb, and then scales the same wager up until the odds run away from the universe.</>}
                code={COUNTING_W_ONE_MICROSTATE_AT_CODE}
              />
          <FigurePlate
            layout="banner"
            figure={entropyChapter.figures[3]}
            index={entropyChapter.index}
            blurb="A cautious man who wanted nothing more than a formula to fit a lightbulb-testing curve — and ended up quantizing the universe to get it."
          />
        </Box>

        <ChapterFooter chapter={entropyChapter} />
      </Box>
    </ThemeProvider>
  );
}
