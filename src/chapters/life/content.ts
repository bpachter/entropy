export type LifeBlock =
  | { kind: 'passage'; eyebrow?: string; heading?: string; body: string[]; pullquote?: { text: string; cite: string } }
  | { kind: 'demo'; visual: 'fluctuation' | 'entropypump' | 'codescript'; index: string; name: string; caption: string };

/**
 * Chapter Five content. Beats synthesized from six web-verified research facets
 * and adversarially fact-checked (history / physics / quotes lenses). Every
 * blockquote is a facet-verified quotation from "What Is Life?" (1944); the
 * myth-flags the research surfaced are honored in the prose — Schrödinger did
 * NOT predict DNA, life does NOT violate the second law, "negative entropy" is
 * the loose coinage he himself walked back, and the order-from-order dichotomy
 * he credited to Planck.
 */
export const lifeBlocks: LifeBlock[] = [
  {
    kind: 'passage',
    eyebrow: 'Dublin, February 1943',
    heading: 'A Physicist Asks an Impossible Question',
    body: [
      "The man at the lectern in Trinity College's crowded lecture theatre was a refugee twice over. Erwin Schrödinger had already left Germany in 1933, in revulsion at Nazi antisemitism — it was only after he reached Oxford that word came he would share that year's Nobel Prize for the wave equation that bears his name. An uneasy return to Graz followed, and then flight again after Austria was swallowed in the 1938 Anschluss. Éamon de Valera — Ireland's Taoiseach and a mathematician by training — had built him a refuge: the Dublin Institute for Advanced Studies, where a stateless theorist could think in peace. Schrödinger arrived in 1939; the Institute was chartered in 1940. He would call the Dublin years among the happiest of his life.",
      'On three consecutive Fridays that February he asked a question no self-respecting physicist was supposed to touch. Roughly four hundred people filled the room each time, and demand forced the lectures to be repeated. The opening was almost impudent in its plainness — how can the events inside the boundary of a living organism be accounted for by physics and chemistry? A wave-mechanic proposed to interrogate life itself, and to do it with thermodynamics and quantum theory rather than with the vital fluids of the biologists.',
    ],
    pullquote: {
      text: 'How can the events in space and time which take place within the spatial boundary of a living organism be accounted for by physics and chemistry?',
      cite: 'Erwin Schrödinger, What Is Life?, Ch. 1 (1944)',
    },
  },
  {
    kind: 'passage',
    eyebrow: 'The tyranny of large numbers',
    heading: 'Why Physical Law Needs a Crowd',
    body: [
      'Schrödinger began not with life but with a confession about physics: its famous laws are frauds of the crowd. A single molecule careens unpredictably; only when you average over uncountable multitudes does behaviour congeal into something you can call a law. Pressure, temperature, the smooth exponential of radioactive decay, the steady creep of diffusion — every one of them is a statistical illusion sharpened by sheer numbers. He gave it a name, the √n law: a physical regularity carries a probable relative error of order one over the square root of the number of particles cooperating to produce it.',
      "The arithmetic is merciless and beautiful. A hundred molecules leave you a wobble of ten percent; a million tighten it to a tenth of a percent — and even that, he noted drily, is hardly the dignity one wants in a Law of Nature. This is why, he argued, an organism 'must have a comparatively gross structure.' We are enormous by molecular reckoning not by accident but by necessity: only a body built of astronomical numbers of atoms can lean on laws precise enough to live by. Order, in ordinary physics, is squeezed out of disorder by averaging away the chaos.",
    ],
  },
  {
    kind: 'demo',
    visual: 'fluctuation',
    index: 'I',
    name: 'The √n law',
    caption:
      'Count how many of n molecules fall in the left half. With a handful the tally lurches; with a mole it never strays from 50/50. This is why life’s reliable machinery must be built from multitudes.',
  },
  {
    kind: 'passage',
    eyebrow: 'The paradox of heredity',
    heading: 'A Few Thousand Atoms That Should Not Obey',
    body: [
      "Then Schrödinger turned the √n law against itself. Heredity is fantastically precise: a trait can pass faithfully down through generations, across centuries, copied with a fidelity no statistical smear could ever guarantee. Yet the gene carrying it is minute. Following Delbrück's estimate, the hereditary unit might be a mere thousand or so atoms — 'incredibly small groups of atoms, much too small to display exact statistical laws' — and yet they dictate the orderly unfolding of a whole organism.",
      "Here was the scandal. By every rule he had just laid down, so few atoms should be a riot of thermal noise, their message dissolving in a single generation. The classical physicist's confident expectation — that anything this small must be statistically sloppy — was, Schrödinger insisted, simply wrong. Something in the living cell was doing what a handful of atoms has no statistical right to do. The averaging trick that underwrites all ordinary physics could not be the answer. Life needed a different principle.",
    ],
  },
  {
    kind: 'passage',
    eyebrow: 'The aperiodic crystal',
    heading: 'Order Written, Not Averaged',
    body: [
      "His answer was a molecule unlike any physics had catalogued. Ordinary crystals are dull, he said — periodic, a single motif stamped out endlessly like wallpaper. The gene, or perhaps the whole chromosome fibre, must instead be an 'aperiodic crystal' (he also called it an aperiodic solid): a structure with a crystal's rigid stability but a non-repeating arrangement of atoms, so that its very irregularity could spell out an enormous message. That message he called, with a hyphen, the 'code-script' — the entire pattern of the individual's future development held in the sequence itself. A Morse-like combinatorics made the point: two signs in groups of four already give thirty specifications; a longer alphabet explodes into astronomical variety.",
      "The physical guarantee of stability he borrowed openly from Max Delbrück's 1935 quantum model of the gene: a molecule locked into shape by quantum energy barriers, proof against the jostling of heat. It is crucial to say plainly what Schrödinger did and did not do. He predicted an information-bearing, aperiodic hereditary molecule whose structure was both 'law-code and executive power in one.' He did not predict DNA, did not describe a double helix, never wrote the word — and named no chemical at all, at a time when most of his contemporaries still assumed the gene would turn out to be a protein. The vision was conceptual, not chemical.",
    ],
    pullquote: {
      text: 'We believe a gene — or perhaps the whole chromosome fibre — to be an aperiodic solid.',
      cite: 'Erwin Schrödinger, What Is Life?, Ch. 1 (1944)',
    },
  },
  {
    kind: 'demo',
    visual: 'codescript',
    index: 'II',
    name: 'The aperiodic crystal',
    caption:
      'A repeating crystal is a wallpaper — orderly but nearly silent. Break the repetition and the same-sized molecule becomes a code-script: kᴸ arrangements, a whole library written in a thread of atoms.',
  },
  {
    kind: 'passage',
    eyebrow: 'Feeding on negative entropy',
    heading: 'Staying Alive Is Staying Far From Death',
    body: [
      "A crystal can hold its order because it is inert. A living thing cannot afford to be inert — it metabolizes, it churns, and every churn manufactures entropy. Left to itself, any physical system slides toward the flat grey maximum of thermodynamic equilibrium, which Schrödinger identified bluntly with death. So how does the organism keep from decaying? Not by exemption from the second law, he stressed, but by continually paying its entropy debt outward. It 'feeds upon negative entropy,' importing order and exporting disorder, holding itself at a low, steady level of entropy while the total for organism-plus-surroundings dutifully rises.",
      "It is his most quoted phrase and his most contested. In a note appended to the chapter, Schrödinger conceded to his physicist colleagues that he 'should have let the discussion turn on free energy instead' — the more correct notion — but had chosen 'negative entropy' because the term 'free energy' sits too close to the plain word 'energy' for a lay reader to feel the contrast between the two. Later critics were harsher: Linus Pauling judged the thermodynamics 'vague and superficial,' and the rigorous statement is indeed that an open system consumes free energy and exports entropy. The slogan is loose. It is also, pointing where it points, not wrong — and Léon Brillouin would soon compress it into 'negentropy' and wire it to information.",
    ],
    pullquote: {
      text: 'What an organism feeds upon is negative entropy.',
      cite: 'Erwin Schrödinger, What Is Life?, Ch. 6 (1944)',
    },
  },
  {
    kind: 'demo',
    visual: 'entropypump',
    index: 'III',
    name: 'Feeding on negative entropy',
    caption:
      'The organism holds its own entropy low only by pumping disorder into everything around it — the universe’s total never falls. Cut off the feeding and it slides to equilibrium: the physicist’s name for death.',
  },
  {
    kind: 'passage',
    eyebrow: 'Order from order',
    heading: 'The Principle Classical Physics Missed',
    body: [
      'From these threads Schrödinger drew his one genuinely new claim. There are, he said, two ways to make orderly events. The first is the statistical mechanism physicists had long celebrated — order from disorder, regularity wrung from the averaging of countless chaotic molecules. The second, which classical statistical physics had never needed, is order from order: an existing orderly structure begetting orderly behaviour directly, without leaning on large numbers at all. Life, uniquely, runs largely on the second. The gene does not average away noise; it copies a template faithfully, atom by specified atom.',
      "He was scrupulous about credit and about mysticism. The dichotomy itself, he acknowledged, was Max Planck's, drawn from a distinction between dynamical and statistical law. And the new principle was emphatically not a vital force — he named the old vitalisms, 'vis viva, entelechy,' only to dismiss them. Life's order-from-order, he wrote, 'is, in my opinion, nothing else than the principle of quantum theory over again': the quantum stability of a single molecule, doing lawfully what a crowd of atoms does only on average.",
    ],
    pullquote: {
      text: "...the 'statistical mechanism' which produces order from disorder and the new one, producing order from order.",
      cite: 'Erwin Schrödinger, What Is Life?, Ch. 7 (1944)',
    },
  },
  {
    kind: 'passage',
    eyebrow: 'The book that seeded a science',
    heading: 'A Vision, Vindicated With Caveats',
    body: [
      "The lectures became a slim book in 1944, and the slim book did something rare: it recruited a generation. Francis Crick and James Watson each traced their turn toward the gene to it — Crick wrote to Schrödinger in August 1953, months after the double helix, to say so and to call 'aperiodic crystal' an apt term. Maurice Wilkins, a solid-state physicist by training, found in it licence to become a biophysicist — and, later, an X-ray crystallographer of DNA. When the structure of DNA finally appeared — a stable molecule whose sequence of bases never repeats, its order a copyable code — Schrödinger's aperiodic crystal looked uncannily vindicated.",
      "Honesty demands the caveats the legend omits. Max Perutz's verdict stings and mostly holds: 'what was true in his book was not original, and most of what was original was known not to be true even when the book was written.' Schrödinger backed the wrong molecule, borrowed his best physics from Delbrück, and closed with a mystical epilogue on free will and the Vedantic oneness of mind that science-history retellings quietly drop. What he supplied was not an answer but a frame — the audacious, correct intuition that heredity is physics, that a gene is a message written in an aperiodic molecule. And that frame poses the question the next chapter must answer. If life runs on a code-script, if heredity is order copied rather than order averaged, then what, precisely and physically, is a code? What is information?",
    ],
  },
];
