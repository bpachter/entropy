import type { Chapter } from './types';

/**
 * The whole arc of the book, chapter by chapter, so the home timeline shows
 * where the story is going. Only the Entropy chapter is authored in full for
 * this first build; the rest carry their metadata and are marked unavailable so
 * they can be filled in on the same pattern.
 */

export const entropyChapter: Chapter = {
  id: 'entropy',
  index: 3,
  kicker: 'Chapter Three',
  title: 'Entropy',
  subtitle: 'Boltzmann, Maxwell’s demon, and the one arrow the universe obeys',
  era: '1850 – 1906',
  mood: 'Molecules, probability, and the arrow of time',
  palette: {
    primary: '#ff5a3c',
    primarySoft: '#ff9166',
    secondary: '#46b7ff',
    secondarySoft: '#7ad3ff',
    bg: '#07080c',
    bgRaised: '#0e1017',
  },
  figures: [
    { name: 'Rudolf Clausius', years: '1822–1888', role: 'Named entropy; stated the second law', tone: 'hot' },
    { name: 'James Clerk Maxwell', years: '1831–1879', role: 'Conjured the demon', tone: 'cold' },
    { name: 'Ludwig Boltzmann', years: '1844–1906', role: 'Entropy as counting: S = k log W', tone: 'hot' },
  ],
  beats: [
    {
      id: 'arrow',
      eyebrow: 'The one-way street',
      heading: 'An arrow you never notice',
      visual: 'mixing',
      body: [
        'Stir a drop of cream into coffee and it blooms outward, threads into ribbons, then vanishes into an even tan. You have never once seen the reverse — the tan coffee spontaneously gathering the cream back into a single white bead. Yet nothing in Newton’s laws forbids it. Run the molecules backwards and every collision is still perfectly legal.',
        'Almost every law of physics looks the same played forwards or backwards. One does not. It is the law that separates before from after, that lets you tell a shattering glass from an assembling one. Nineteenth-century engineers stumbled onto it while trying to build a better steam engine, and it turned out to govern everything from a cup of coffee to the fate of the cosmos.',
      ],
    },
    {
      id: 'clausius',
      eyebrow: 'A word for the tendency',
      heading: 'Clausius gives it a name',
      visual: 'mixing',
      body: [
        'Heat, everyone could see, always drifts the same direction: from hot to cold, never the other way on its own. In 1865 the German physicist Rudolf Clausius gave this tendency a name. He built it from a Greek root for transformation and deliberately shaped it to rhyme with “energy.” He called it entropy.',
        'Then he compressed all of thermodynamics into a couplet that still holds: the energy of the universe is constant, and the entropy of the universe tends toward a maximum. Energy is never lost — but with every passing second, a little more of it slips into a form too disordered to do any useful work.',
      ],
      pullquote: {
        text: 'The energy of the universe is constant. The entropy of the universe tends to a maximum.',
        cite: 'Rudolf Clausius, 1865',
      },
    },
    {
      id: 'boltzmann',
      eyebrow: 'Vienna, against the current',
      heading: 'Boltzmann’s wager: entropy is counting',
      visual: 'microstates',
      body: [
        'To most physicists of the 1870s, entropy was a bookkeeping quantity with no picture behind it. Ludwig Boltzmann supplied the picture — and paid for it. Atoms were still disputed; many respected scientists thought them a convenient fiction. Boltzmann insisted heat was nothing but the jostling of real molecules, and that entropy was a measure of our ignorance about exactly how they were arranged.',
        'A macrostate — “the gas is warm and filling the box” — can be built from an astronomical number of microstates, the specific positions and speeds of every molecule. Boltzmann’s leap was to say that entropy simply counts them: S = k log W, where W is the number of microscopic arrangements that look identical from the outside.',
      ],
    },
    {
      id: 'counting',
      eyebrow: 'Why the room fills',
      heading: 'Not a force — a landslide of odds',
      visual: 'microstates',
      body: [
        'Ask why a gas always expands to fill its container and the honest answer is not that something pushes it. It is that there are almost unimaginably more ways to be spread out than to be bunched in a corner. Drag the slider: with sixty molecules, “all on one side” has exactly one arrangement, while “evenly split” has more than a hundred thousand trillion.',
        'The system is not pulled toward disorder. It simply wanders among possibilities, and the spread-out possibilities so vastly outnumber the tidy ones that it never stumbles back. Entropy increases for the same reason a shuffled deck never re-sorts itself: order is rare, and disorder is nearly everything.',
      ],
    },
    {
      id: 'demon',
      eyebrow: 'A thought experiment with teeth',
      heading: 'Maxwell’s demon opens the door',
      visual: 'demon',
      body: [
        'In 1867 James Clerk Maxwell imagined a way to cheat. Picture a box of gas split by a wall with one tiny door, and a being small enough to see individual molecules. It opens the door only for fast molecules heading one way and slow ones heading the other. No work, no engine — just a nimble gatekeeper sorting hot from cold.',
        'Switch the demon on and watch: one chamber heats, the other cools, and the entropy meter falls. A temperature difference appears from nothing, ready to drive an engine forever. For a century this imaginary creature haunted physics, because it seemed to break the second law for free. Switch it off and the door just hangs open — the gas evens out again, as it should.',
      ],
    },
    {
      id: 'landauer',
      eyebrow: 'The demon gets a bill',
      heading: 'Information is physical',
      visual: 'demon',
      body: [
        'The escape took decades and a new idea. To sort molecules, the demon must first measure them — and it must remember what it learned to act on it. In 1929 Leó Szilárd showed that this information is not free. In 1961 Rolf Landauer nailed down the price: erasing a single bit of memory must dissipate at least a small, unavoidable quantum of heat, kT·ln 2.',
        'Charles Bennett closed the case in 1982. The demon can measure and even reset the door reversibly, but eventually its memory fills, and clearing it to keep going dumps exactly enough entropy to balance the books. The second law survives — but only once we accept that information itself is physical, with a thermodynamic cost. That thread runs straight to Claude Shannon and the bits in the device you are reading this on.',
      ],
      pullquote: {
        text: 'Erasing one bit of information costs at least kT·ln 2 of dissipated heat.',
        cite: 'Landauer’s principle, 1961',
      },
    },
    {
      id: 'legacy',
      eyebrow: 'The arrow, and the cost of knowing',
      heading: 'Why the universe runs one way',
      visual: 'mixing',
      body: [
        'Boltzmann had handed physics its arrow of time. The future is simply the direction in which entropy is larger — the direction of overwhelmingly more likely arrangements. Wound all the way out, the same logic predicts a distant “heat death,” a universe so evenly lukewarm that no difference remains to power anything at all.',
        'Boltzmann did not live to be vindicated. Exhausted and depressed, still fighting colleagues who denied atoms existed, he took his own life in 1906 — just as Einstein’s work on jittering pollen grains was proving those atoms real. On his gravestone in Vienna, carved above the name, is the single equation that says everything: S = k · log W.',
      ],
      pullquote: {
        text: 'S = k · log W',
        cite: 'Engraved on Boltzmann’s tombstone, Vienna',
      },
    },
  ],
  available: true,
};

/** The full book arc — for the contents page. Unauthored chapters are stubs. */
export const chapters: Chapter[] = [
  stub({
    index: 1, id: 'engine', title: 'The Motive Power of Fire', available: true,
    subtitle: 'Sadi Carnot and the steam engine that started a science',
    era: '1824 – 1849', mood: 'Steam, iron, and the first idea',
    palette: { primary: '#ff8a3d', primarySoft: '#ffb98a', secondary: '#7fb1c9', secondarySoft: '#bfe0ef', bg: '#0b0806', bgRaised: '#17110a' },
    figures: [{ name: 'Sadi Carnot', years: '1796–1832', role: 'Founder of thermodynamics', tone: 'hot' }],
  }),
  stub({
    index: 2, id: 'laws', title: 'Two Laws', available: true,
    subtitle: 'Joule, Kelvin and Clausius forge the laws of energy and heat',
    era: '1843 – 1865', mood: 'Paddlewheels, falling weights, and absolute cold',
    palette: { primary: '#f5b73c', primarySoft: '#ffd98a', secondary: '#57c2e0', secondarySoft: '#a9e4f2', bg: '#0a090c', bgRaised: '#15131a' },
    figures: [
      { name: 'James Joule', years: '1818–1889', role: 'Mechanical equivalent of heat', tone: 'hot' },
      { name: 'William Thomson (Kelvin)', years: '1824–1907', role: 'Absolute temperature', tone: 'cold' },
    ],
  }),
  entropyChapter,
  stub({
    index: 4, id: 'atoms', title: 'Einstein’s Atoms', available: true,
    subtitle: 'Brownian motion, and the refrigerator Einstein actually patented',
    era: '1905 – 1933', mood: 'Jittering pollen and a patented fridge',
    palette: { primary: '#9a7bff', primarySoft: '#c2adff', secondary: '#4fd6c0', secondarySoft: '#a3ece0', bg: '#08080e', bgRaised: '#12121d' },
    figures: [
      { name: 'Albert Einstein', years: '1879–1955', role: 'Proved atoms real; co-invented a fridge', tone: 'hot' },
      { name: 'Jean Perrin', years: '1870–1942', role: 'Counted the molecules', tone: 'cold' },
      { name: 'Leó Szilárd', years: '1898–1964', role: 'Co-inventor of the fridge', tone: 'hot' },
    ],
  }),
  stub({
    index: 5, id: 'life', title: 'What Is Life?', available: true,
    subtitle: 'Schrödinger asks how living things hold entropy at bay',
    era: '1943 – 1944', mood: 'Order wrung from disorder',
    palette: { primary: '#5ec27f', primarySoft: '#a7e0b3', secondary: '#b6d95a', secondarySoft: '#e0efad', bg: '#06090a', bgRaised: '#101613' },
    figures: [
      { name: 'Erwin Schrödinger', years: '1887–1961', role: 'Life feeds on “negative entropy”', tone: 'cold' },
      { name: 'Max Delbrück', years: '1906–1981', role: 'The gene as a quantum-stable molecule', tone: 'hot' },
    ],
  }),
  stub({
    index: 6, id: 'information', title: 'Information', available: true,
    subtitle: 'Shannon turns entropy into the currency of communication',
    era: '1948 – 1961', mood: 'Bits, noise, and the price of forgetting',
    palette: { primary: '#2dd4bf', primarySoft: '#8fe9df', secondary: '#38bdf8', secondarySoft: '#a3e0fc', bg: '#06090c', bgRaised: '#0f1620' },
    figures: [
      { name: 'Claude Shannon', years: '1916–2001', role: 'Founder of information theory', tone: 'cold' },
      { name: 'Rolf Landauer', years: '1927–1999', role: 'Erasing a bit costs kT ln2', tone: 'hot' },
    ],
  }),
  stub({
    index: 7, id: 'blackholes', title: 'Black Holes and the End of Time', available: true,
    subtitle: 'Bekenstein and Hawking find entropy at the edge of a black hole',
    era: '1972 – present', mood: 'Entropy at the edge of a black hole',
    palette: { primary: '#9d7bff', primarySoft: '#c4adff', secondary: '#ffab5e', secondarySoft: '#ffd0a3', bg: '#05060b', bgRaised: '#0f1020' },
    figures: [
      { name: 'Jacob Bekenstein', years: '1947–2015', role: 'Black holes have entropy', tone: 'cold' },
      { name: 'Stephen Hawking', years: '1942–2018', role: 'Black holes radiate heat', tone: 'hot' },
    ],
  }),
];

function stub(o: Omit<Chapter, 'kicker' | 'beats' | 'available'> & { available?: boolean }): Chapter {
  const kickers = ['', 'Chapter One', 'Chapter Two', 'Chapter Three', 'Chapter Four', 'Chapter Five', 'Chapter Six', 'Chapter Seven'];
  return { ...o, kicker: kickers[o.index], beats: [], available: o.available ?? false };
}

/** Look up a chapter's metadata by id. */
export function chapterById(id: string): Chapter | undefined {
  return chapters.find((c) => c.id === id);
}
