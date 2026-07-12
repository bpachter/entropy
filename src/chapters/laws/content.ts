import type { LogProse } from './components/LogEntry';

export type LawsBlock =
  | LogProse
  | { kind: 'instrument'; instrument: 'paddlewheel' | 'absolutezero' | 'ledger'; index: string; name: string; caption: string };

/**
 * Chapter Two content. Prose synthesized and then adversarially fact-checked by
 * a research workflow (history / physics / quotes lenses); the flagged
 * corrections — Dancer's thermometers, the 1845 mean vs paddlewheel value,
 * Helmholtz's age, the log-scale/−273 distinction — are applied here.
 */
export const lawsBlocks: LawsBlock[] = [
  {
    kind: 'entry',
    stamp: '1824 – 43',
    heading: 'What Carnot Left Behind',
    body: [
      'Sadi Carnot had handed the world a law without a mechanism. His engine wrung work from heat as it tumbled from a hot body to a cold one, and he had proved that no engine could ever do better than the ideal fall between two temperatures. But he had reasoned it all on a false premise: that heat was caloric, an invisible, indestructible fluid that poured through the engine unchanged, like water turning a mill wheel and flowing on undiminished. The efficiency law was right. The picture beneath it was wrong.',
      'That left a question with a sharp edge. If heat is a substance that is merely relocated, then the quantity that enters an engine must equal the quantity that leaves. But then where does the work come from? Something must be spent to move the piston. For a quarter-century the contradiction sat quietly inside the most successful theory of the age, waiting for someone stubborn enough to measure his way through it.',
    ],
  },
  {
    kind: 'entry',
    stamp: '1843',
    heading: 'Joule and the Tenth of a Degree',
    body: [
      'James Prescott Joule was not a professor. He was the son of a Salford brewer on the edge of Manchester, tutored briefly by John Dalton, running experiments in rooms adjoining the family brewery and paying for them out of his own pocket. What he had instead of a title was an almost unreasonable faith in the thermometer. Beginning in 1843, he set out to show that mechanical work and heat were two currencies of one thing, exchangeable at a fixed rate. His apparatus became famous for its plainness: weights on cords descended, turning a paddlewheel that churned water sealed inside an insulated vessel, and a thermometer watched for the warmth stirred up by the friction.',
      'The warming was maddeningly small — tenths of a degree over an entire run — and therein lay the whole difficulty and the whole drama. Joule read thermometers built to his exacting specification by the Manchester instrument-maker John Benjamin Dancer, trained himself to resolve differences as fine as a two-hundredth of a degree Fahrenheit, wound his weights up again and again to accumulate a measurable rise, and fought off every stray draft and trace of body heat. His numbers marched steadily toward the truth over his career: from a rough 838 foot-pounds per unit of heat in 1843, to around 817 as the mean of his 1845 measurements, and finally to 772.692 in his refined paper of 1850 — astonishingly close to the value we accept today.',
    ],
    pullquote: {
      text: "the grand agents of nature are, by the Creator's fiat, indestructible.",
      cite: 'James Prescott Joule, 1843',
    },
  },
  {
    kind: 'instrument',
    instrument: 'paddlewheel',
    index: 'I',
    name: 'Joule’s apparatus',
    caption:
      'A falling weight turns paddles that warm sealed water; every joule of work reappears as the same quantity of heat. Notice how slight the rise is — read it many times and the measured exchange rate settles down. That difficulty was Joule’s whole art.',
  },
  {
    kind: 'entry',
    stamp: '1842 – 47',
    heading: 'Energy Conserved, Caloric Buried',
    body: [
      "Joule's rate of exchange did more than convert units. It killed the caloric theory. If a fixed amount of work always produced a fixed amount of heat, then heat was not a conserved fluid but a form of energy, generated wherever motion was consumed. Nothing was created and nothing destroyed; the total was merely traded between forms. This is the first law of thermodynamics, and its modern bookkeeping is a single line: the change in a system's internal energy equals the heat added minus the work it does. Energy is conserved, and a machine that makes work from nothing — a perpetual-motion engine of the first kind — is impossible.",
      'Honesty requires naming more than one man. In Germany, the physician Julius Robert von Mayer had reasoned his way to conservation in print in 1842, writing that a force once in existence cannot be annihilated but only change its form. In 1847 Hermann von Helmholtz, then just twenty-five, gave the principle its rigorous mathematical shape in a pamphlet the establishment first thought too speculative to publish. Mayer wrote it, Helmholtz generalized it, and Joule measured it. The Anglophone habit of crediting Joule alone is a convenience of language, not a verdict of history.',
    ],
  },
  {
    kind: 'entry',
    stamp: '1848',
    heading: 'Thomson and the Coldest Possible Cold',
    body: [
      "Among the few who grasped Joule's importance early was a young Glasgow professor, William Thomson — decades away from the title Lord Kelvin. He had absorbed Carnot's theory secondhand, through Clapeyron's algebra, since Carnot's own memoir was nearly impossible to find. In 1848, still only twenty-four, Thomson noticed something elegant: because Carnot's ideal engine depends only on the two temperatures and never on the working substance, the work extracted as heat falls one degree could itself define temperature — a scale owing nothing to mercury or air or any particular material.",
      'It is worth being precise, because the story is usually flattened. His 1848 scale was logarithmic, not the one we use now; on it the coldest limit lay at negative infinity. Yet he noted that this infinite cold corresponds to a finite point on an ordinary gas thermometer — about minus 273 degrees Celsius, read from the reciprocal of a gas’s expansion coefficient. Only after working with Joule did he recast the scale, around 1851 to 1854, into the modern form in which temperature ratios equal heat ratios and the cold bottoms out at that same finite floor. We now fix it at exactly minus 273.15. There is a coldest possible temperature, and nature can approach it but never arrive.',
    ],
  },
  {
    kind: 'instrument',
    instrument: 'absolutezero',
    index: 'II',
    name: 'The absolute scale',
    caption:
      'Cool a gas at fixed volume and its pressure falls in a dead-straight line, striking zero at −273.15 °C — the same intercept for every gas. Below it lies nothing colder. That floor anchors a temperature scale that needs no substance at all.',
  },
  {
    kind: 'entry',
    stamp: '1850',
    heading: 'Clausius Rescues Carnot',
    body: [
      'Two truths now seemed to collide. Carnot insisted work required heat to descend from hot to cold; Joule insisted heat and work were interchangeable, so heat could be spent outright. If Joule was right, was Carnot simply wrong? In 1850 the German physicist Rudolf Clausius found the seam that let both stand. Carnot, he showed, was correct that producing work demands a fall of heat between temperatures, and correct about the efficiency ceiling. Where Carnot erred was in assuming the heat arrived at the cold reservoir undiminished. In truth, part of it is consumed and converted into the work itself.',
      'This single distinction saved everything worth saving. The caloric fluid was gone, replaced by energy in transit; Carnot’s efficiency limit survived intact, now resting on conservation rather than contradicting it. Out of this reconciliation came a second principle, independent of the first. Energy is conserved in quantity, said the first law. But its transformations run one way only, said the second. The two laws of the chapter’s title were now both on the table.',
    ],
  },
  {
    kind: 'entry',
    stamp: '1851 – 54',
    heading: 'The Second Law in Two Voices',
    body: [
      'The second law was stated twice, by two men, in two idioms that turn out to say the same thing. Clausius put it in the language of everyday experience, formulated in German in 1854 and rendered into English in 1856: heat can never pass from a colder to a warmer body without some other change occurring at the same time. A refrigerator can move heat uphill, but only by paying for it elsewhere. Thomson had already put it in the language of engines in his 1851 paper on the dynamical theory of heat: no purely material agency can draw mechanical effect from matter by cooling it below the coldest thing around it.',
      'The two forbid different-sounding miracles, yet each can be shown to imply the other; assume one is false and you can build a machine that breaks the other. Later Max Planck sharpened Thomson’s version into the crisp form textbooks now quote — that no cyclic engine can turn heat entirely into work with no other effect — which is why it is called the Kelvin–Planck statement and not Kelvin’s alone. Both statements draw the same line: some things that conserve energy are still forbidden.',
    ],
    pullquote: {
      text: 'Heat can never pass from a colder to a warmer body without some other change occurring at the same time.',
      cite: 'Rudolf Clausius, 1854',
    },
  },
  {
    kind: 'instrument',
    instrument: 'ledger',
    index: 'III',
    name: 'The engine ledger',
    caption:
      'Heat drawn from the hot reservoir splits into useful work and heat dumped to the cold one — Qₕ = W + Q꜀, always (the first law). But the work can never breach the Carnot ceiling 1 − T꜀/Tₕ, and whenever it falls short, entropy is generated (the second).',
  },
  {
    kind: 'entry',
    stamp: '1852 →',
    heading: 'A Universal Tendency',
    body: [
      'In 1852 Thomson followed the second law to its unsettling horizon. In a short paper read to the Royal Society of Edinburgh, he announced what he called a universal tendency in nature to the dissipation of mechanical energy. Energy is never lost, but it is relentlessly degraded — spread from concentrated and useful into diffuse and unavailable, like heat leaking from a warm room until everything sits at one lukewarm temperature and nothing more can be made to happen. For the first time, physics carried a direction. The equations of motion ran happily backward, but the world did not.',
      'Thomson drew the conclusion out to its end: the Earth had been, and would again be, unfit for human life. He had found the arrow of time hidden inside a law about engines. Yet the principle still lacked a name and a number — a single quantity that measured how far the degradation had gone. That quantity was already forming in Clausius’s mind, and in 1865 he would call it entropy, and declare that the entropy of the universe tends to a maximum. That is where the next chapter begins.',
    ],
    pullquote: {
      text: 'There is at present in the material world a universal tendency to the dissipation of mechanical energy.',
      cite: 'William Thomson, 1852',
    },
  },
];
