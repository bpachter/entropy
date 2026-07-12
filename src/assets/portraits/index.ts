/**
 * Bundled historical portraits, keyed by figure slug (e.g. 'boltzmann').
 * Two resolutions: small (avatars) and `-lg` (feature plates). Vite resolves
 * each file to a hashed asset URL at build time. Sources and licenses are
 * recorded in credits.json and surfaced by <PortraitCredits/>.
 */
const modules = import.meta.glob('./*.{jpg,jpeg,png}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

export const portraitBySlug: Record<string, string> = {};
export const portraitLgBySlug: Record<string, string> = {};

for (const [path, url] of Object.entries(modules)) {
  const base = path.split('/').pop()!.replace(/\.[^.]+$/, '');
  if (base.endsWith('-lg')) portraitLgBySlug[base.slice(0, -3)] = url;
  else portraitBySlug[base] = url;
}

/** Best available portrait URL for a slug; prefers hi-res when `large`, falling back gracefully. */
export function portrait(slug?: string, large = false): string | undefined {
  if (!slug) return undefined;
  return large ? portraitLgBySlug[slug] ?? portraitBySlug[slug] : portraitBySlug[slug] ?? portraitLgBySlug[slug];
}
