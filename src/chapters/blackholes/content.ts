export type BlackHoleBlock =
  | { kind: 'movement'; eyebrow?: string; heading: string; body: string[]; pullquote?: { text: string; cite: string }; finale?: boolean }
  | { kind: 'panel'; visual: 'horizon' | 'temperature' | 'heatdeath'; index: string; name: string; caption: string };

/**
 * Chapter Seven content — the book's finale. Beats synthesized from six
 * web-verified facets and adversarially fact-checked (the physics lens
 * confirmed every worked number). Verifier fixes applied: Bekenstein was in his
 * mid-twenties (25) in 1972, not "barely into his twenties"; the Wheeler teacup
 * conversation is dated to the early 1970s. Credit order held: Bekenstein
 * proposed entropy∝area + the generalized second law; Hawking supplied the
 * temperature/radiation and fixed the exact 1/4. The far-future timescales are
 * flagged as theoretical, and the Clausius closing quote is exact.
 */
export const blackHoleBlocks: BlackHoleBlock[] = [
  {
    kind: 'movement',
    eyebrow: 'Princeton, early 1970s',
    heading: 'A Graduate Student’s Heresy',
    body: [
      "John Wheeler is said to have needled his student with a thought experiment as ordinary as a cooling cup of tea. Set a hot cup beside a cold one and let them come to rest at the same lukewarm temperature, and you have paid the second law its due: entropy, the universe's tally of disorder, has gone up, and the ledger can never be un-run. But suppose a black hole drifts past. Tip both cups over its edge, Wheeler mused, and you have hidden the evidence of your crime. The heat, the disorder, the very entropy you created has fallen out of the world entirely. The great law that had governed everything since Carnot's firebox appeared, at the horizon, to have a loophole.",
      "Jacob Bekenstein, in his mid-twenties, refused to accept the loophole. If dropping entropy into a black hole seemed to destroy it, then the black hole itself must be carrying that entropy, hidden but not gone. In 1972 he made the audacious claim: a black hole possesses an entropy, and it is proportional not to its volume but to the AREA of its event horizon, measured in the impossibly small squares of the Planck scale. He rescued the second law by generalizing it, so that the entropy outside a hole plus the entropy of the hole itself can never decrease. It was, to nearly everyone senior to him, a young man's error.",
    ],
  },
  {
    kind: 'movement',
    eyebrow: 'The objection',
    heading: 'If It Has Entropy, It Must Burn',
    body: [
      'The objection was not stubbornness; it was thermodynamics itself, turned against Bekenstein. Every physicist knew the chain of reasoning that Clausius and Kelvin had forged a century before: a thing with entropy has a temperature, and a thing with a temperature glows, radiating heat into whatever is colder around it. But a black hole was defined by the one thing it could never do. Nothing escaped it — not light, not warmth, not a whisper. To grant it a temperature was to demand that it shine, and that seemed a plain contradiction in terms.',
      'Stephen Hawking was among the sharpest skeptics. He had proved, in 1971, a beautiful theorem: the total area of black-hole horizons can never shrink. The parallel to entropy’s relentless increase was almost too neat, and Hawking, with Bardeen and Carter, laid out in 1973 a full set of laws for black-hole mechanics that shadowed the laws of heat point for point. Yet he insisted the resemblance was mere poetry. The area was like entropy; the surface gravity was like temperature. Analogy, nothing more. He set out, in part, to prove Bekenstein wrong.',
    ],
  },
  {
    kind: 'movement',
    eyebrow: '1974',
    heading: 'Black Holes Ain’t So Black',
    body: [
      "When Hawking finally did the calculation, quantum theory betrayed his own intuition. Tracking how the vacuum itself behaves in the warped spacetime just outside a horizon, he found that the emptiness there is not empty, and not silent. The horizon glows. A black hole radiates a faint thermal light at a genuine temperature, T = ħc³ / 8πGMk — a formula that stitches together, in a single breath, the constants of gravity, of quantum mechanics, and of heat. The analogy was no analogy. It was physics.",
      'The temperature runs backward from every intuition about size. It is inversely proportional to mass, so the largest holes are the coldest and the smallest are infernos. A black hole with the Sun’s mass simmers at six hundredths of a millionth of a degree above absolute zero — colder than the empty sky. But let a hole grow tiny and its temperature screams upward toward a final flash. Because it radiates, it loses mass; because it loses mass, it grows hotter still. Hawking, who had come to refute the young man, had instead handed him the missing half of his idea. Black holes, it turned out, were not quite black.',
    ],
  },
  {
    kind: 'panel', visual: 'temperature', index: 'I', name: 'The temperature of a black hole',
    caption: 'Hawking found the horizon must glow at a real temperature, T = ħc³/8πGMk — inverse in the mass. The smallest holes are infernos that evaporate in a flash; the largest are colder than deep space.',
  },
  {
    kind: 'movement',
    eyebrow: 'The equation',
    heading: 'A Quarter of the Area',
    body: [
      "With the temperature in hand, the undetermined constant in Bekenstein's guess snapped into place. The entropy of a black hole is exactly one quarter of its horizon area, counted in Planck squares: S = k·A / 4l_P². Bekenstein had found the shape of the truth; Hawking's radiation fixed the number. Together their names now sit on what many physicists call the most beautiful equation in physics, because no other formula asks Newton's G, Planck's ħ, Einstein's c, and Boltzmann's k to stand in the same small room at once.",
      'And the numbers it yields are almost violent in their scale. Because entropy tracks area, and area grows as the square of mass, a single black hole of the Sun’s mass carries about 10⁷⁷ units of entropy — roughly a hundred quintillion times the entropy of all the ordinary matter that could have formed it. The collapse of a star into a black hole is the most entropy-producing event the universe knows. Count up everything in the observable cosmos and the supermassive holes at the hearts of galaxies dwarf all the starlight and all the microwave glow combined. The universe, it turns out, keeps most of its disorder locked behind horizons.',
    ],
    pullquote: {
      text: 'S = k · A / 4l_P²',
      cite: 'The Bekenstein–Hawking entropy — a quarter of the horizon, in Planck tiles',
    },
  },
  {
    kind: 'panel', visual: 'horizon', index: 'II', name: 'A quarter of the area',
    caption: 'Entropy lives on the surface — a quarter of the horizon area in Planck-sized tiles. Because area grows as mass squared, a sun’s worth of black hole hides more disorder than every atom that made it.',
  },
  {
    kind: 'movement',
    eyebrow: 'The paradox',
    heading: 'What the Fire Forgets',
    body: [
      "But the glow carried a poison. Hawking radiation is exactly thermal — as featureless as the heat off any warm body, depending on nothing but the hole's mass. So if a black hole slowly radiates itself away to nothing, what becomes of everything that fell in? The star, the encyclopedia, the astronaut, every intricate arrangement of quantum information vanishes, and out comes only structureless heat. In 1976 Hawking spelled out the crisis: evaporation seemed to erase information for good. That collided head-on with the previous chapter's hard-won lesson that information is physical, and with the deepest rule of quantum mechanics — that the past is always recoverable from the present.",
      "What followed was a quarrel that ran for decades — the war Leonard Susskind later named — with Susskind and Gerard 't Hooft insisting information could not simply die and Hawking holding his ground. In 1997 Hawking bet against it; in 2004 he conceded, handing over a baseball encyclopedia, though the argument was more a gesture than a proof and Kip Thorne never conceded at all. The fight left a stranger clue behind. Because a hole's information scales with its bounding AREA and not its volume, 't Hooft and Susskind proposed the holographic principle: perhaps everything inside any region is written, like a hologram, on its surface. Today most physicists lean toward information surviving — recent calculations coax the right answer out of gravity itself — but how it escapes remains open country, live physics still being argued.",
    ],
  },
  {
    kind: 'movement',
    eyebrow: 'The long dark',
    heading: 'The Last Things',
    body: [
      'Follow the second law far enough and it writes the obituary of the cosmos. First the stars: over the next hundred trillion years the last of them gutter out, and the Stelliferous Era ends in darkness. Then the long Degenerate Era of cold cinders — white dwarfs, neutron stars — which may themselves dissolve if protons decay. What remains, for an almost unimaginable stretch, is black holes: the universe’s final macroscopic structures, its deepest reservoirs of entropy, presiding over an emptying sky.',
      'And then even they surrender. The same Hawking glow that made them thermal makes them mortal. A stellar-mass hole takes some 10⁶⁷ years to evaporate; the largest supermassive giants hold on until about 10¹⁰⁰ — a googol years, 10⁹⁰ times the present age of the universe. When the last horizon finally boils away in a final flicker, there is nothing left to fall and nothing left to burn. The cosmos drifts toward maximum entropy: cold, dilute, featureless, near absolute zero. This is the heat death that Kelvin glimpsed in 1852 in the mere dissipation of an engine’s warmth — not a fire, in the end, but a fading. (Every date here is a theoretical extrapolation; no one has ever detected a black hole evaporating, and the far future hangs on assumptions about dark energy and the fate of the proton.)',
    ],
  },
  {
    kind: 'panel', visual: 'heatdeath', index: 'III', name: 'The long dark',
    caption: 'Wound all the way forward, entropy reaches its maximum: stars die, matter decays, black holes evaporate over ~10¹⁰⁰ years — the heat death Kelvin and Clausius foresaw, a cosmos too even to do any work.',
  },
  {
    kind: 'movement',
    finale: true,
    eyebrow: 'Finale',
    heading: 'From the Firebox to the End of Time',
    body: [
      'And so the book closes where a single idea has carried it the whole way. It began with Carnot listening to the fall of heat through a steam engine and asking why some of it always slips beyond use. Clausius gave the loss a name — entropy — and a law: it only ever grows. Boltzmann found what it counted, the sheer number of ways the unseen atoms could be arranged. Einstein saw those atoms jitter in a bead of pollen. Schrödinger asked how life holds its fragile order against the tide, and Shannon showed that a message, too, is measured in the same coin, and that to erase a bit is to pay a thermodynamic price. One quantity has run through every chapter: entropy, the difference between hot and cold, the reason time has a direction at all.',
      'Now it reaches its farthest shore. The same law that capped a Victorian engine’s efficiency sets the destiny of the entire universe, and it does its final accounting at the edge of a black hole, where gravity, quantum theory, and heat are forced at last to speak as one. Kelvin foresaw the dissipation; Clausius wrote the ending in a single line that still holds after everything.',
    ],
    pullquote: {
      text: 'The energy of the universe is constant; the entropy of the universe tends to a maximum.',
      cite: 'Rudolf Clausius, 1865',
    },
  },
];
