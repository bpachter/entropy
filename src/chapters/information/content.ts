export type InfoBlock =
  | { kind: 'transmission'; marker: string; heading: string; body: string[]; pullquote?: { text: string; cite: string } }
  | { kind: 'signal'; visual: 'entropymeter' | 'channel' | 'landauer'; index: string; name: string; caption: string };

/**
 * Chapter Six content. Beats synthesized from six web-verified facets and
 * adversarially fact-checked. The verifiers' fixes are applied: the 1948
 * opening line is quoted WITHOUT internal commas (the original has none), and
 * the entropy↔information link is stated as "same mathematics, physically
 * joined by Landauer" rather than a naive full identity. Tukey coined "bit";
 * the cost is in ERASURE not measurement (Landauer/Bennett overturned
 * Szilárd/Brillouin); the von Neumann anecdote is flagged as reported.
 */
export const infoBlocks: InfoBlock[] = [
  {
    kind: 'transmission',
    marker: 'TX ▸ 01 · BELL LABS, 1948',
    heading: 'A Question Left on the Desk',
    body: [
      "Schrödinger had left physics with a riddle it was not built to answer. Life, he argued, runs on a script written into the chromosomes — an aperiodic crystal carrying instructions. But instructions in what currency? A gene, a sentence, a telegram, a symphony: all of them plainly carry something, and no equation in the physicist's toolkit had a name for it. Meaning felt too slippery to measure. So the question sat there, waiting for someone willing to throw meaning away.",
      "That someone was a lean, restless engineer at Bell Telephone Laboratories named Claude Shannon, who juggled in the hallways and would later ride a unicycle through them. In July and October of 1948, across two installments in the Bell System Technical Journal, he published 'A Mathematical Theory of Communication.' Its opening move is almost blunt in its modesty — communication, he wrote, is the problem of 'reproducing at one point either exactly or approximately a message selected at another point.' Not understanding the message. Reproducing it. With that single narrowing, a slippery philosophical word became an engineering quantity.",
    ],
  },
  {
    kind: 'transmission',
    marker: 'TX ▸ 02 · THE BIT',
    heading: 'Measuring Surprise',
    body: [
      "Shannon's radical simplification was to treat the meaning of a message as none of the channel's business. Whether the wire carries a love letter or a stock quote, the engineer's task is the same: deliver the exact sequence of symbols chosen at the far end. What matters, then, is not what a message says but how much it could have said — how many messages the sender might have picked and didn't. Information, in this austere sense, is the resolving of uncertainty. The more surprising the outcome, the more it tells you.",
      "The natural unit falls out of the simplest possible question: one with two equally likely answers, yes or no, on or off. Answering it conveys exactly one unit of information. A colleague at Bell Labs, the statistician John Tukey, had contracted 'binary digit' to a single crisp syllable in a memo dated January 1947; Shannon adopted it in print and gave him the credit — the units, he noted, 'may be called binary digits, or more briefly bits, a word suggested by J. W. Tukey.' A bit is not a thing. It is the amount of surprise in the flip of a fair coin.",
    ],
  },
  {
    kind: 'transmission',
    marker: 'TX ▸ 03 · ENTROPY H',
    heading: 'A Borrowed Name',
    body: [
      "To measure the average surprise of a source that emits symbols with probabilities p₁, p₂, p₃…, Shannon wrote down H = −Σ pᵢ log₂ pᵢ. Rare symbols carry more surprise, common ones less, and H is their weighted average, in bits per symbol. It is largest when every symbol is equally likely — maximum uncertainty, nothing predictable — and it falls to zero when one outcome is certain. A fair coin gives one bit; a fair die, log₂6 ≈ 2.585 bits; English text, once its redundancy is accounted for, only about one bit per letter.",
      "The formula would have looked eerily familiar to any physicist. Strip away the choice of logarithm and a constant, and it is the entropy Gibbs and Boltzmann had written for the disorder of a gas. As the story goes — and it is a story, told years afterward by Shannon to Myron Tribus and printed only in 1971, so treat it as reported rather than recorded — von Neumann urged him to call his quantity entropy for two reasons: the same expression already lived in statistical mechanics, and, he supposedly added, that no one really understood entropy, so it would win him every argument. Apocryphal or not, the joke pointed at something true. The resemblance was not a coincidence.",
    ],
    pullquote: {
      text: '…no one knows what entropy really is, so in a debate you will always have the advantage.',
      cite: 'attributed to John von Neumann — as Shannon later told it (reported 1971, not documented)',
    },
  },
  {
    kind: 'signal', visual: 'entropymeter', index: 'I', name: 'The entropy of a source',
    caption: 'Information is surprise. A source’s average surprise per symbol — maximal when all are equally likely, zero when one is certain — is its entropy, in bits. It is Boltzmann’s formula in a new suit.',
  },
  {
    kind: 'transmission',
    marker: 'TX ▸ 04 · THE NOISY CHANNEL',
    heading: 'Perfection Through Imperfect Wires',
    body: [
      'Every real channel corrupts what passes through it. Static, crosstalk, the random jostle of electrons — engineers had long assumed you fought noise the obvious way: shout louder, or slow down, accepting that flawless transmission over a flawed line was a limit you could only approach at the cost of speed or power. Shannon proved them wrong in the most disarming way. Every channel, he showed, has a finite capacity C, a hard ceiling in bits per second. And below that ceiling, error is not a fact of life to be tolerated — it is a problem that can be driven to zero.',
      'The trick is redundancy applied not symbol by symbol but across long blocks of them, so that the noise averages out and the intended message stands clear. As long as you transmit at any rate below C, there exists a code that makes the probability of error as small as you please. Above C, no code can save you. It was, and is, an astonishing guarantee — and a maddening one, because Shannon proved these codes exist without building a single one. He averaged over all possible codes to show good ones must be in the pile. Engineers spent the next half-century, up through the turbo and LDPC codes of the 1990s, learning how to actually construct what he had promised was there.',
    ],
  },
  {
    kind: 'signal', visual: 'channel', index: 'II', name: 'The noisy channel',
    caption: 'Noise flips bits at random, yet Shannon proved you can still communicate almost perfectly — with enough redundancy — up to a hard ceiling, the channel capacity C = 1 − H(p).',
  },
  {
    kind: 'transmission',
    marker: 'TX ▸ 05 · THE DEMON RETURNS',
    heading: 'Buying Work With a Fact',
    body: [
      'There was an old ghost in thermodynamics, and information theory walked straight into its room. In 1871 Maxwell had imagined a tiny being sorting fast molecules from slow through a trapdoor, manufacturing a temperature difference from nothing and mocking the second law. For decades it lurked, unexorcised. Then, in 1929, the Hungarian physicist Leó Szilárd stripped the demon to its skeleton: a box, a single molecule, a partition. Learn which side the molecule is on — one bit — and you can let it push the partition, extracting kT·ln2 of useful work from the surrounding heat, cycle after cycle.',
      "Szilárd's engine made the scandal quantitative. One bit of knowledge buys exactly kT·ln2 of work — the same magnitude that would later sit at the heart of the whole story. He had done something no one before him managed: he had put a price tag on a fact, denominated in energy, nineteen years before Shannon named the bit. But a price tag raises a question. If knowing the molecule's position lets you cheat the second law, where does the universe send the bill?",
    ],
  },
  {
    kind: 'transmission',
    marker: 'TX ▸ 06 · LANDAUER & BENNETT',
    heading: 'The Cost of Forgetting',
    body: [
      'Szilárd guessed, and Brillouin after him insisted, that the debt was paid in the act of measurement — that looking must cost something. They were wrong, and the correction is the deepest idea in the chapter. In 1961 Rolf Landauer at IBM proved that logically irreversible operations carry an unavoidable thermodynamic price: to erase one bit — to reset a memory to a blank, throwing away which state it was in — you must dissipate at least kT·ln2 of heat into the surroundings. About 2.9×10⁻²¹ joules at room temperature. Forgetting, not knowing, is the physical act with a floor beneath it.',
      'In 1982 Charles Bennett closed the case. Measurement, he showed, can in principle be done reversibly, at no entropy cost at all; the demon may look for free. But the demon has a finite memory, and to run forever it must eventually clear that memory to make room for the next observation. That erasure — and only that erasure — pays Landauer’s kT·ln2 per bit, exactly enough to cover the work the demon extracted. The second law was never in danger; the bookkeeping was simply filed under the wrong entry. Information is physical. The bill comes due when the demon forgets. In 2012 Antoine Bérut and colleagues watched a single colloidal particle in a double-well trap and measured the erasure heat settling onto Landauer’s bound, turning the argument into a laboratory fact.',
    ],
  },
  {
    kind: 'signal', visual: 'landauer', index: 'III', name: 'The demon’s bill',
    caption: 'A one-molecule engine turns one bit of information into kT ln2 of work — until the demon must erase that bit to run again, paying kT ln2 back. Information is physical; the second law holds.',
  },
  {
    kind: 'transmission',
    marker: 'TX ▸ 07 · ONE LAW, TWO FACES',
    heading: 'Toward the Edge of the Possible',
    body: [
      "So the two entropies were never merely analogous. Clausius's entropy, the measure of heat's irreversible spreading, and Shannon's entropy, the measure of a message's surprise, are built from the same mathematics — bridged, through Landauer, into a single physical account: erase one bit and the world grows measurably hotter by kT·ln2. A bit is not just a metaphor for disorder; it is disorder, counted in binary. The ledger of what can be known and the ledger of what can be done turn out to meet.",
      "Which turns the question outward, toward the most extreme object physics can name. If information is physical, if it cannot be destroyed without paying an entropy debt to the universe — then what happens to a bit that falls into a black hole, past a horizon from which nothing returns? Where does its entropy go, and how much can a region of space hold before it can hold no more? The demon's small accounting problem, carried to the edge of gravity, becomes a crisis about the nature of space itself.",
    ],
  },
];
