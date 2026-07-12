export type PlateId = 'engine' | 'waterfall' | 'cycle';

export type EngineBlock =
  | {
      kind: 'prose';
      eyebrow?: string;
      heading?: string;
      body: string[];
      pullquote?: { text: string; cite: string };
    }
  | {
      kind: 'plate';
      plate: PlateId;
      figure: string;
      title: string;
      caption: string;
    };

export const engineBlocks: EngineBlock[] = [
  {
    kind: 'prose',
    eyebrow: '1824 · the age of steam',
    heading: 'The machines that remade the world — and the question no one had asked',
    body: [
      'By the 1820s the steam engine had already turned the world upside down. It pumped water from the deep mines, drove the spinning mills of Manchester, and was about to put iron locomotives on rails. Yet for all their power, these engines were built almost blindly — improved by the intuition of mechanics, a better valve here, a tighter seal there.',
      'No one could say what a steam engine actually was, in the language of nature, or whether there was any ceiling on how much work you could squeeze from a given fire. Britain led the world in building them; it would take a young Frenchman to understand them.',
    ],
  },
  {
    kind: 'plate',
    plate: 'engine',
    figure: 'Plate I',
    title: 'The reciprocating engine',
    caption:
      'Fire boils water to steam; steam drives the piston; the connecting rod turns the flywheel, which carries the motion onward. Feed the firebox and the whole machine quickens — heat in, motion out.',
  },
  {
    kind: 'prose',
    eyebrow: 'Sadi Carnot',
    heading: 'A young soldier asks how good an engine could ever be',
    body: [
      'Sadi Carnot was a French military engineer, the son of one of Napoleon’s ministers, still in his twenties. Where others tinkered, he asked a question of pure principle: is there a limit to the motive power of heat, and does it depend on the working substance — steam, air, anything at all?',
      'In 1824 he published his answer in a slim volume, Réflexions sur la puissance motrice du feu. It sold poorly and was almost forgotten. Carnot died of cholera at thirty-six; for fear of contagion, many of his papers were buried with him. The book that founded a science nearly vanished with its author.',
    ],
    pullquote: {
      text: 'The motive power of heat is independent of the agents employed to realise it.',
      cite: 'Sadi Carnot, 1824',
    },
  },
  {
    kind: 'prose',
    eyebrow: 'The fall of heat',
    heading: 'Heat does its work by falling',
    body: [
      'Carnot reached for an image everyone in that age understood: the water wheel. A mill wheel does work not by consuming water but by letting it fall from a height to a lower one. Heat, he argued, drives an engine the same way — by falling from a hot body to a cold one. The greater the drop in temperature, the more work you can draw off.',
      'His mechanism was wrong in its details: Carnot pictured heat as an invisible, conserved fluid called caloric, which we now know it is not. But the insight riding on top of that error was profound and correct — what matters is the temperature difference. Erase it, and no amount of heat can do a thing.',
    ],
  },
  {
    kind: 'plate',
    plate: 'waterfall',
    figure: 'Plate II',
    title: 'The fall of heat',
    caption:
      'Raise the hot reservoir or deepen the cold one, and the fall grows — the wheel turns faster and yields more work. With no drop at all, the wheel stands still.',
  },
  {
    kind: 'prose',
    eyebrow: 'The perfect engine',
    heading: 'An engine that cannot be beaten',
    body: [
      'To find the ceiling, Carnot imagined an idealised engine with no friction, no waste, every step so gentle it could run backwards as easily as forwards. Such a reversible engine performs a four-stroke cycle: the gas expands while drinking heat from the hot reservoir, expands further while insulated and cooling, is compressed while dumping heat to the cold reservoir, then compressed further while insulated and warming back.',
      'No real engine can do better than this perfect, reversible one. It sets the absolute standard against which every actual machine — then and now — is measured.',
    ],
  },
  {
    kind: 'plate',
    plate: 'cycle',
    figure: 'Plate III',
    title: 'The ideal cycle',
    caption:
      'The four reversible strokes trace a closed loop on the pressure–volume plane; the area inside is the work produced. Drag the two temperatures and watch the loop — and the efficiency — respond.',
  },
  {
    kind: 'prose',
    eyebrow: 'The limit',
    heading: 'Only two temperatures matter',
    body: [
      'Here is Carnot’s astonishing conclusion. The best possible efficiency of any heat engine depends on nothing but the two temperatures it works between — not the fuel, not the gas, not the ingenuity of the builder. In modern terms, the ceiling is η = 1 − T꜀ / Tₕ, with the temperatures measured from absolute zero.',
      'To reach 100 percent you would need a cold reservoir at absolute zero, which the universe does not provide. So every engine ever built, and every one that ever will be, must throw some of its heat away to the cold side. Perfect conversion of heat into work is forbidden.',
    ],
    pullquote: { text: 'η = 1 − T꜀ / Tₕ', cite: 'The Carnot efficiency' },
  },
  {
    kind: 'prose',
    eyebrow: 'The seed',
    heading: 'The second law, thirty years early',
    body: [
      'Buried in Carnot’s reasoning was something larger than engine design. If a reversible engine is the best possible, then heat must flow of its own accord only from hot to cold, and you can never get work from nothing. That is the second law of thermodynamics in embryo — written decades before Rudolf Clausius would give its hidden bookkeeper a name: entropy.',
      'Carnot never saw any of it recognised. Only after his death did Émile Clapeyron and then William Thomson — the future Lord Kelvin — resurrect the little book, and with it launch the science of heat. The story of that rescue, and of the two laws it produced, is the next chapter.',
    ],
  },
];
