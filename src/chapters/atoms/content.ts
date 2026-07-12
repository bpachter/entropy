/**
 * Chapter Four content. Grounded in three web-verified research facets
 * (Perrin, the Einstein–Szilárd fridge, sim physics); claims those facets
 * flagged as legend or secondhand are hedged exactly to their attestation
 * level (the kitchen tragedy, Einstein's remark, Gabor's jackal). A full
 * adversarial verify pass is queued to re-check the remaining facets.
 */

export type AtomsBlock =
  | {
      kind: 'prose';
      section: string;
      stamp: string;
      heading: string;
      body: string[];
      sidenote?: { title: string; lines: string[] };
      pullquote?: { text: string; cite: string };
    }
  | { kind: 'specimen'; visual: 'brownian' | 'ruler'; index: string; name: string; label: string; caption: string }
  | { kind: 'patent'; visual: 'fridge'; fig: string; title: string; caption: string }
  | { kind: 'divider'; label: string };

export const atomsBlocks: AtomsBlock[] = [
  { kind: 'divider', label: 'MOVEMENT I · UNDER THE MICROSCOPE' },
  {
    kind: 'prose',
    section: '§ 1',
    stamp: 'c. 1900',
    heading: 'The Age That Didn’t Believe in Atoms',
    body: [
      'By 1900 the atom was in a strange position: indispensable and unwelcome. Chemists weighed and combined as though matter came in countable pieces, and Boltzmann had rebuilt heat and entropy on molecules in restless motion. Yet no instrument had ever caught an atom in the act of existing. In Vienna, Ernst Mach — whose austere philosophy of science shaped a generation — insisted that physics speak only of what can be observed, and met talk of atoms with a standing challenge: had anyone ever seen one? In Leipzig, the great physical chemist Wilhelm Ostwald preached “energetics”: energy as the only reality, atoms a bookkeeping fiction that science would outgrow.',
      'The stakes ran deeper than philosophy. If atoms were fiction, then Boltzmann’s entropy — disorder counted over arrangements of molecules — was fiction too, and the second law hung in the air without a mechanism beneath it. What the atomists needed was a bridge between scales: some visible event in which the invisible left fingerprints. One had been waiting in the microscopists’ cabinets for seventy-five years.',
    ],
    sidenote: {
      title: 'What hung on it',
      lines: ['S = k log W presumes molecules to count.', 'No atoms → no counting → no statistical second law.'],
    },
  },
  {
    kind: 'prose',
    section: '§ 2',
    stamp: '1827',
    heading: 'The Botanist’s Restless Dust',
    body: [
      'In the summer of 1827 the botanist Robert Brown — Britain’s most celebrated microscopist, veteran of an Australian expedition — was examining pollen of the wildflower Clarkia pulchella. Suspended in the water were minute granules spilled from the pollen grains, a few thousandths of a millimetre across, and they would not hold still. Each one jittered, staggered, pivoted — tirelessly, going nowhere, for as long as he cared to watch.',
      'Brown’s first thought was that he had glimpsed the elementary motion of life. So he set about killing his own hypothesis: granules from plants a century dead in herbaria danced just as vigorously; so did powdered glass, soot, ground minerals — even, famously, dust from a fragment of the Sphinx. Everything small enough danced. The motion belonged not to life but to smallness itself, and for three-quarters of a century it stayed what he left it: a universal, unexplained fidget at the bottom of the visible world.',
    ],
  },
  {
    kind: 'specimen',
    visual: 'brownian',
    index: 'A',
    name: 'The restless grain',
    label: 'granules in water · after Brown, 1827',
    caption:
      'Brown’s puzzle, live: the grain staggers, tireless and directionless, and he could never see why. Flip the switch — reveal what no microscope of his century could.',
  },
  {
    kind: 'prose',
    section: '§ 3',
    stamp: 'May 1905',
    heading: 'A Memo from the Patent Office',
    body: [
      'The explanation came from a twenty-six-year-old examiner at the Swiss patent office in Bern — technical expert, third class — who did physics after hours. In a short paper sent to Annalen der Physik in May 1905, Albert Einstein argued that if heat really is molecular motion, then particles big enough to see must be measurably shoved by molecules too small to see. He allowed, with careful modesty, that the motions he was predicting might well be the same ones the microscopists had long called Brownian.',
      'The genius lay in choosing what to measure. Velocity, he saw, was the wrong thing to chase: the path is so crumpled that no instant of it has a well-defined speed. Displacement is the honest observable. Einstein showed that the square of the wander grows in proportion to time — ⟨x²⟩ = 2Dt — roughly six thousandths of a millimetre of drift in a minute for micron-sized grains in water. And packed inside the slope was the count of the molecules themselves: Avogadro’s number, readable off dancing dust. Others were closing on the same law — William Sutherland in Melbourne, Marian Smoluchowski in Lviv — but it was Einstein’s paper, with its measurable prescription, that handed the experimenters their orders.',
    ],
    sidenote: {
      title: 'On the same desk, 1905',
      lines: ['March — light quanta', 'April — a thesis on molecular sizes', 'May — this paper', 'June — special relativity', 'September — E = mc²'],
    },
  },
  {
    kind: 'specimen',
    visual: 'ruler',
    index: 'B',
    name: 'Einstein’s ruler',
    label: '420 grains · ⟨x²⟩ vs t · micrometres and seconds',
    caption:
      'Velocity diverges — sample twice as finely and it only grows. But ⟨x²⟩ climbs a dead-straight line of slope 2D, and written into that slope is Avogadro’s number.',
  },
  {
    kind: 'prose',
    section: '§ 4',
    stamp: '1908 – 13',
    heading: 'Counting the Invisible',
    body: [
      'Turning the prescription into proof took a virtuoso. At the Sorbonne, Jean Perrin spent months centrifuging gamboge and mastic — gum resins — into emulsions of microscopic spheres, fractionated until they were effectively identical, then counted them by the tens of thousands through a camera lucida. In a water droplet his spheres arranged themselves into a miniature atmosphere, thinning with height exactly as kinetic theory demanded; from that gradient alone he could read off the number of molecules in a mole. And his student Chaudesaigues tracked grain displacements at thirty-second intervals, reporting late in 1908 that Einstein’s straight line held.',
      'The numbers landed in a tight crowd. Perrin’s own series pointed to about 7 × 10²³; gas viscosity, radioactivity and the blue of the sky — phenomena with nothing else in common — converged on the same figure. One value seen through many windows could not be coincidence: matter is grained. Ostwald conceded in print in 1909, with the grace of a real scientist; Mach went to his grave in 1916 unconvinced. Perrin collected the Nobel Prize in 1926 — and Boltzmann, who had died by his own hand in 1906 with the argument still open, was vindicated in full, three years after Ostwald’s concession he never read.',
    ],
    pullquote: {
      text: 'for his work on the discontinuous structure of matter, and especially for his discovery of sedimentation equilibrium',
      cite: 'Perrin’s Nobel citation, 1926',
    },
    sidenote: {
      title: 'The tally',
      lines: [
        'Perrin, 1909: ≈ 7.05 × 10²³',
        'Across methods: 6 – 7 × 10²³',
        'Modern (exact): 6.02214076 × 10²³',
        'The proof was the convergence, not the decimals.',
      ],
    },
  },
  { kind: 'divider', label: 'MOVEMENT II · THE FRIDGE' },
  {
    kind: 'prose',
    section: '§ 5',
    stamp: 'Berlin, c. 1926',
    heading: 'A Death in the Kitchen',
    body: [
      'Two decades on, Einstein sat at the summit of German science in Berlin — and refrigerators were replacing iceboxes in middle-class kitchens. Every working gas of the era was poisonous: methyl chloride, sulfur dioxide, ammonia. Compressors rattled, joints worked loose, seals wept. As Leó Szilárd later told the story, Einstein read a newspaper account of a family — parents and children — killed in their sleep by fumes leaking from their kitchen refrigerator, and put the paper down shaken. There must, he reportedly said, be a better way.',
      'Szilárd was twenty-eight: a Hungarian physicist of restless brilliance who had won Einstein’s respect with a doctoral thesis that did something Einstein had casually declared impossible — and who, three years later, would in passing exorcise Maxwell’s demon by showing that the demon’s information itself carries an entropy price. The two struck a partnership with the flavour of the old Bern patent office about it: invent jointly, file patents, split whatever came. Beginning in the winter of 1925–26, the most famous theorist alive went into the refrigerator business.',
    ],
    sidenote: {
      title: 'Attestation',
      lines: [
        'The tragedy story reaches us secondhand — Szilárd’s telling, decades on.',
        'No year, city or gas is documented; all three period refrigerants could kill.',
      ],
    },
  },
  {
    kind: 'patent',
    visual: 'fridge',
    fig: 'FIG. 1 · U.S. 1,781,541',
    title: 'Refrigeration — Einstein & Szilárd',
    caption:
      'One loop stands for three fluids — butane, ammonia and water in pressure balance, no compressor, no seals to weep. Light the flame: heat drawn from the cold box rides the loop and is dumped, with the flame’s own heat, into the kitchen. The ledger always balances.',
  },
  {
    kind: 'prose',
    section: '§ 6',
    stamp: '1926 – 31',
    heading: 'The Machine with No Moving Parts',
    body: [
      'A refrigerator is the second law run backward on purpose. Heat never drifts from cold to hot on its own — Clausius’s old commandment — but it can be driven uphill, provided something else pays. A compressor pays with work from a motor; a motor needs a shaft, and a shaft needs a seal: the weak joint through which the poison escaped. Einstein and Szilárd abolished the weakness rather than the poison. In their absorption design the only “pump” is a small flame. Heat drives butane, ammonia and water around a sealed circuit held in pressure balance, and cold falls out of the chemistry. Nothing turns. Nothing wears. Nothing can leak from a machine that is welded shut forever.',
      'Over seven years the partners filed more than forty-five patent applications in at least six countries. The absorption design became U.S. Patent 1,781,541 — filed December 1927, granted November 11, 1930 — and was bought by Electrolux, largely to protect its own machines; it was never built. The boldest design went to the electrical giant AEG: a pump with no piston, a column of liquid metal driven down a tube by travelling electromagnetic fields — Einstein himself supplying the fix, drive it by induction, when the alkali metal chewed through the wiring insulation. A complete prototype ran continuously from July 1931. It worked. It was also loud: Dennis Gabor teased that it howled like a jackal, though the engineer who ran it heard rushing water — and largely tuned the howl away.',
    ],
    pullquote: {
      text: 'All three machines work without moving parts, and are hermetically sealed.',
      cite: 'Leó Szilárd to his brother Béla, 1926',
    },
    sidenote: {
      title: 'The prototype',
      lines: ['AEG Research Institute, Berlin', 'running from 31 July 1931', 'potassium–sodium alloy · pentane', '136 watts, in a GE cabinet'],
    },
  },
  {
    kind: 'prose',
    section: '§ 7',
    stamp: '1930 – 33',
    heading: 'Freon, Fire, and Exile',
    body: [
      'What killed the project was not engineering. In April 1930 an American chemist, Thomas Midgley, demonstrated a new refrigerant by inhaling it and blowing out a candle: Freon — nonflammable, nontoxic — and the safety argument for the Einstein–Szilárd machines evaporated with it. (The irony matured slowly: four decades later the “harmless” chlorofluorocarbons were found to be eating the planet’s ozone layer.) Then the Depression halved AEG’s research institute, and the final report closed the refrigerator file in August 1932. Five months later Hitler was chancellor. Einstein, abroad that winter, never set foot in Germany again; Szilárd left for London.',
      'The echoes outlasted the machine. The patent royalties — some three thousand dollars a year — carried Szilárd through his first stateless years: the fridge quietly financed the physicist who, on 12 September 1933, waiting at a Bloomsbury traffic light after reading Rutherford dismiss atomic energy as “moonshine,” conceived the neutron chain reaction, as he later told it, just as the light changed. The electromagnetic pump found its true calling half a century on, silently circulating liquid metal through the cores of breeder reactors. And the deeper current flows onward: atoms are real, and everything warm obeys their statistics — so how does a living cell, adrift in the molecular storm, hold its order together for a lifetime? In wartime Dublin, a physicist would stand up to ask exactly that.',
    ],
  },
];
