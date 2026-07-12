/**
 * Bundled historical portraits, keyed by figure slug (e.g. 'boltzmann').
 * Vite resolves each file to a hashed asset URL at build time. Sources and
 * licenses are recorded in credits.json and surfaced by <PortraitCredits/>.
 */
const modules = import.meta.glob('./*.{jpg,jpeg,png}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

export const portraitBySlug: Record<string, string> = {};
for (const [path, url] of Object.entries(modules)) {
  const slug = path.split('/').pop()!.replace(/\.[^.]+$/, '');
  portraitBySlug[slug] = url;
}
