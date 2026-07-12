import { useState } from 'react';
import { Box, Typography, Collapse, Link as MuiLink } from '@mui/material';
import ExpandMoreRounded from '@mui/icons-material/ExpandMoreRounded';
import credits from '@/assets/portraits/credits.json';
import { chapters } from '@/content/chapters';

// slug -> the display name we already use elsewhere in the app
const nameBySlug: Record<string, string> = {};
for (const c of chapters) for (const f of c.figures) if (f.img) nameBySlug[f.img] = f.name;

/** Tidy the raw Wikimedia metadata: HTML entities, footnote markers, doubled strings. */
const clean = (s: string) =>
  (s || '')
    .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#0?39;|&apos;/g, "'")
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/\[\d+\]/g, '')
    .replace(/^(.+)\1$/, '$1')
    .trim();

/** Unobtrusive, expandable attribution for the bundled portraits. */
export function PortraitCredits() {
  const [open, setOpen] = useState(false);
  return (
    <Box sx={{ mt: 6, pt: 4, borderTop: '1px solid rgba(255,255,255,0.07)', textAlign: 'center' }}>
      <Box
        component="button"
        onClick={() => setOpen((v) => !v)}
        sx={{
          display: 'inline-flex', alignItems: 'center', gap: 0.5, mx: 'auto',
          background: 'none', border: 'none', cursor: 'pointer', color: 'text.secondary',
          fontFamily: "'JetBrains Mono Variable', monospace", fontSize: 12, letterSpacing: '0.12em',
          textTransform: 'uppercase', p: 1, '&:hover': { color: 'text.primary' },
        }}
      >
        Portrait credits
        <ExpandMoreRounded sx={{ fontSize: 16, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </Box>
      <Collapse in={open}>
        <Box sx={{ maxWidth: 720, mx: 'auto', mt: 2, textAlign: 'left' }}>
          <Typography sx={{ fontSize: 12.5, color: 'text.secondary', mb: 1.5, lineHeight: 1.6 }}>
            Portraits are sourced from Wikimedia Commons — most are in the public domain; a few carry Creative
            Commons licenses, credited below. Each links to its source file.
          </Typography>
          <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, display: 'grid', gap: 0.75 }}>
            {credits.map((c) => {
              const artist = clean(c.artist);
              const showArtist = artist && !/^unknown/i.test(artist) && !/wikimedia commons/i.test(artist);
              return (
                <Box component="li" key={c.slug} sx={{ fontSize: 12, color: 'text.secondary', lineHeight: 1.5 }}>
                  <Box component="span" sx={{ color: 'text.primary', fontWeight: 600 }}>
                    {nameBySlug[c.slug] ?? c.title}
                  </Box>
                  {' — '}
                  <MuiLink href={c.source} target="_blank" rel="noopener noreferrer" sx={{ color: 'inherit', textDecorationColor: 'rgba(255,255,255,0.3)' }}>
                    {c.license}
                  </MuiLink>
                  {showArtist && ` · ${artist}`}
                </Box>
              );
            })}
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
}
