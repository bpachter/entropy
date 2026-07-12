import { Box, Typography } from '@mui/material';
import ArrowForwardRounded from '@mui/icons-material/ArrowForwardRounded';
import LockRounded from '@mui/icons-material/LockRounded';
import { chapters } from '@/content/chapters';
import type { Chapter } from '@/content/types';
import { Link } from '@/router';
import { hexA } from './ChapterHero';

/** End-of-chapter block: onward to the next chapter, plus the inspiration note. */
export function ChapterFooter({ chapter }: { chapter: Chapter }) {
  const next = chapters.find((c) => c.index === chapter.index + 1);

  return (
    <Box component="footer" sx={{ px: { xs: 3, md: 8 }, py: { xs: 8, md: 12 }, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
      {next && (
        <Box sx={{ maxWidth: 760, mx: 'auto', mb: 8 }}>
          <Typography variant="overline" sx={{ color: 'text.secondary' }}>Next</Typography>
          {next.available ? (
            <Link to={`/${next.id}`} style={{ textDecoration: 'none' }}>
              <NextCard next={next} />
            </Link>
          ) : (
            <NextCard next={next} locked />
          )}
        </Box>
      )}

      <Box sx={{ textAlign: 'center' }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <Typography sx={{ color: 'primary.light', fontWeight: 600, fontSize: 14, mb: 3, '&:hover': { textDecoration: 'underline' } }}>
            ← All chapters
          </Typography>
        </Link>
        <Typography sx={{ color: 'text.secondary', fontSize: 13.5, maxWidth: 600, mx: 'auto', lineHeight: 1.7 }}>
          An original, interactive retelling of the history of thermodynamics, inspired by Paul Sen’s{' '}
          <em>Einstein’s Fridge</em>. The simulations are live — computed in your browser.
        </Typography>
      </Box>
    </Box>
  );
}

function NextCard({ next, locked }: { next: Chapter; locked?: boolean }) {
  const c = next.palette;
  return (
    <Box
      sx={{
        mt: 1.5,
        p: 3,
        borderRadius: 3,
        border: '1px solid rgba(255,255,255,0.1)',
        background: `linear-gradient(120deg, ${hexA(c.primary, 0.1)}, ${hexA(c.secondary, 0.08)})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        opacity: locked ? 0.6 : 1,
        transition: 'transform 0.2s, border-color 0.2s',
        '&:hover': locked ? {} : { transform: 'translateY(-2px)', borderColor: hexA(c.primary, 0.5) },
      }}
    >
      <Box>
        <Typography sx={{ fontFamily: "'JetBrains Mono Variable', monospace", fontSize: 12, color: 'text.secondary' }}>
          {next.kicker} · {next.era}
        </Typography>
        <Typography variant="h4" sx={{ fontSize: { xs: '1.4rem', md: '1.7rem' }, mt: 0.5 }}>{next.title}</Typography>
        <Typography sx={{ color: 'text.secondary', mt: 0.5, fontSize: 14 }}>{next.subtitle}</Typography>
      </Box>
      {locked ? <LockRounded sx={{ color: 'text.secondary' }} /> : <ArrowForwardRounded sx={{ color: c.primary }} />}
    </Box>
  );
}
