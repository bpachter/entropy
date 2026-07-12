import type { JSX } from 'react';
import { EntropyChapter } from './entropy/EntropyChapter';
import { EngineChapter } from './engine/EngineChapter';
import { LawsChapter } from './laws/LawsChapter';
import { AtomsChapter } from './atoms/AtomsChapter';
import { LifeChapter } from './life/LifeChapter';
import { InformationChapter } from './information/InformationChapter';
import { BlackHolesChapter } from './blackholes/BlackHolesChapter';

/** Chapter id → its experience component. Only built chapters appear here. */
export const chapterComponents: Record<string, () => JSX.Element> = {
  engine: EngineChapter,
  laws: LawsChapter,
  entropy: EntropyChapter,
  atoms: AtomsChapter,
  life: LifeChapter,
  information: InformationChapter,
  blackholes: BlackHolesChapter,
};
