export interface ChapterPalette {
  /** Primary accent (the chapter's "warm" pole). */
  primary: string;
  primarySoft: string;
  /** Secondary accent (the chapter's "cool" pole). */
  secondary: string;
  secondarySoft: string;
  /** Page background + raised surface. */
  bg: string;
  bgRaised: string;
}

export type VisualKind = 'mixing' | 'microstates' | 'demon';

export interface Beat {
  id: string;
  eyebrow?: string;
  heading?: string;
  body: string[];
  visual: VisualKind;
  pullquote?: { text: string; cite?: string };
}

export interface Figure {
  name: string;
  years: string;
  role: string;
  /** 'hot' | 'cold' tints the avatar along the app's thermal axis. */
  tone: 'hot' | 'cold';
  /** Portrait slug in src/assets/portraits (e.g. 'boltzmann'); falls back to initials. */
  img?: string;
}

export interface Chapter {
  id: string;
  index: number;
  kicker: string;
  title: string;
  subtitle: string;
  era: string;
  figures: Figure[];
  palette: ChapterPalette;
  /** One-line motif shown on the contents page ("Steam, iron, and firelight"). */
  mood: string;
  beats: Beat[];
  available: boolean;
}
