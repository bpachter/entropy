/**
 * Historical "contextual" artifacts — engine plates, apparatus, patents, diagrams
 * and photographs that illustrate each chapter. All public-domain or Creative
 * Commons; each carries its own caption, license and source for on-plate credit.
 * `paper: true` marks line-art/engravings/diagrams that render on a warm matted
 * card (so black-on-transparent diagrams stay visible); photographs stay dark.
 */
const modules = import.meta.glob('./*.{jpg,jpeg,png}', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
const urlBySlug: Record<string, string> = {};
for (const [p, u] of Object.entries(modules)) urlBySlug[p.split('/').pop()!.replace(/\.[^.]+$/, '')] = u;

export interface ContextImage {
  slug: string;
  url: string;
  label: string;
  title: string;
  caption: string;
  license: string;
  source: string;
  paper?: boolean;
}

const meta: Omit<ContextImage, 'url'>[] = [
  {
    slug: 'steam-engine', label: 'PLATE · 1782', title: 'Watt’s double-acting steam engine',
    caption: 'From James Watt’s own patent specification — the machine whose wasted heat Sadi Carnot set out to understand.',
    license: 'Public domain', source: 'https://commons.wikimedia.org/wiki/File:Steam_engine_-_Mr._Watt%27s_double_steam_engine_from_his_specification_of_1782_LCCN2006691752.jpg', paper: true,
  },
  {
    slug: 'joule-apparatus', label: 'FIG. · c.1845', title: 'Joule’s paddle-wheel apparatus',
    caption: 'A falling weight turns paddles in an insulated drum; the tiny rise in temperature fixed the mechanical equivalent of heat.',
    license: 'Public domain', source: 'https://commons.wikimedia.org/wiki/File:Joule%27s_Apparatus_(Harper%27s_Scan).png', paper: true,
  },
  {
    slug: 'boltzmann-grave', label: 'VIENNA · ZENTRALFRIEDHOF', title: 'Boltzmann’s grave',
    caption: 'Carved in gold above his bust: S = k log W. Entropy as counting, cut into stone.',
    license: 'CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:Ludwig_Boltzmann_Grave_Zentralfriedhof_Vienna_2022.jpg',
  },
  {
    slug: 'einstein-fridge', label: 'US PATENT 1,781,541', title: 'The Einstein–Szilárd refrigerator',
    caption: 'A refrigerator with no moving parts, patented in 1930 and signed by both inventors. Chapter 4’s hidden invention, in full.',
    license: 'Public domain', source: 'https://commons.wikimedia.org/wiki/File:Einstein_Refrigerator_pat1781541_clarified.jpg', paper: true,
  },
  {
    slug: 'perrin-brownian', label: 'FIG. · BROWNIAN PATH', title: 'The jitter of a single grain',
    caption: 'One particle’s zig-zag walk, plotted point by point. Perrin traced these to prove that unseen molecules were doing the shoving.',
    license: 'Public domain', source: 'https://commons.wikimedia.org/wiki/File:PerrinPlot1.svg', paper: true,
  },
  {
    slug: 'shannon-diagram', label: 'FIG. · 1948', title: 'Shannon’s communication system',
    caption: 'Every message — telegraph to Wi-Fi — as source → transmitter → noisy channel → receiver → destination. The diagram that founded information theory.',
    license: 'Public domain', source: 'https://commons.wikimedia.org/wiki/File:Shannon_communication_system.svg', paper: true,
  },
  {
    slug: 'm87-blackhole', label: 'EHT · 2019', title: 'The first image of a black hole',
    caption: 'M87*, resolved by the Event Horizon Telescope: the shadow of an event horizon 55 million light-years away, ringed by its own light.',
    license: 'CC BY 4.0', source: 'https://commons.wikimedia.org/wiki/File:Black_hole_-_Messier_87_crop_max_res.jpg',
  },
  {
    slug: 'hubble-field', label: 'NASA/ESA · HUBBLE', title: 'The Ultra Deep Field',
    caption: 'Almost every speck here is a galaxy. Toward such a spread the second law quietly points — a universe running down toward its maximum.',
    license: 'Public domain', source: 'https://commons.wikimedia.org/wiki/File:Hubble_ultra_deep_field.jpg',
  },
];

export const contextImages: Record<string, ContextImage> = {};
for (const m of meta) if (urlBySlug[m.slug]) contextImages[m.slug] = { ...m, url: urlBySlug[m.slug] };
