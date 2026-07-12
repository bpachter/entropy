import { useState } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { motion } from 'framer-motion';
import type { Figure } from '@/content/types';
import { portrait } from '@/assets/portraits';

function initials(name: string) {
  return name.split(' ').filter(Boolean).map((w) => w[0]).slice(0, 2).join('');
}

/** Etched L-brackets at a plate's corners — the engineering-drawing detail. */
function CornerTicks({ color }: { color: string }) {
  const c = { position: 'absolute' as const, width: 12, height: 12, borderColor: color, pointerEvents: 'none' as const };
  return (
    <>
      <Box sx={{ ...c, top: 6, left: 6, borderTop: '1.5px solid', borderLeft: '1.5px solid' }} />
      <Box sx={{ ...c, top: 6, right: 6, borderTop: '1.5px solid', borderRight: '1.5px solid' }} />
      <Box sx={{ ...c, bottom: 6, left: 6, borderBottom: '1.5px solid', borderLeft: '1.5px solid' }} />
      <Box sx={{ ...c, bottom: 6, right: 6, borderBottom: '1.5px solid', borderRight: '1.5px solid' }} />
    </>
  );
}

/** The framed photographic plate itself (image with graceful initials fallback). */
function Plate({ figure, tone, width, ratio = 0.82, large = false }: { figure: Figure; tone: string; width: number; ratio?: number; large?: boolean }) {
  const [broken, setBroken] = useState(false);
  const url = portrait(figure.img, large);
  return (
    <Box
      sx={{
        position: 'relative',
        width,
        aspectRatio: `${ratio}`,
        borderRadius: 1.5,
        overflow: 'hidden',
        flexShrink: 0,
        border: `1px solid ${alpha(tone, 0.45)}`,
        background: `linear-gradient(160deg, ${alpha(tone, 0.14)}, #0c0e14)`,
        boxShadow: `0 10px 34px ${alpha(tone, 0.22)}, inset 0 1px 0 rgba(255,255,255,0.06)`,
      }}
    >
      {url && !broken ? (
        <Box
          component="img"
          src={url}
          alt={figure.name}
          loading="lazy"
          onError={() => setBroken(true)}
          sx={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 16%', display: 'block', filter: 'grayscale(0.15) contrast(1.03)' }}
        />
      ) : (
        <Box sx={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center', fontFamily: "'Fraunces Variable', serif", fontWeight: 600, fontSize: width * 0.3, color: tone }}>
          {initials(figure.name)}
        </Box>
      )}
      {/* readability vignette + corner ticks */}
      <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 55%, rgba(0,0,0,0.5))', pointerEvents: 'none' }} />
      <CornerTicks color={alpha(tone, 0.55)} />
    </Box>
  );
}

/**
 * A historical figure rendered as a captioned "plate" — the textbook-of-the-future
 * motif. `card` is a compact vertical plate for chapter openers; `banner` is a
 * large editorial spotlight for setting into the body of a chapter. Colours come
 * from the active chapter theme, so each plate wears its chapter's palette.
 */
export function FigurePlate({
  figure,
  layout = 'card',
  index,
  blurb,
  toneOverride,
}: {
  figure: Figure;
  layout?: 'card' | 'banner';
  index?: number;
  blurb?: string;
  toneOverride?: string;
}) {
  const theme = useTheme();
  const tone = toneOverride ?? (figure.tone === 'cold' ? theme.palette.secondary.main : theme.palette.primary.main);
  const mono = "'JetBrains Mono Variable', monospace";
  const label = index != null ? `PLATE ${roman(index)}` : 'FIG.';

  if (layout === 'card') {
    return (
      <Box sx={{ width: 120, textAlign: 'center' }}>
        <Plate figure={figure} tone={tone} width={120} />
        <Typography sx={{ mt: 1.25, fontWeight: 700, fontSize: 14, lineHeight: 1.2 }}>{figure.name}</Typography>
        <Typography sx={{ fontFamily: mono, fontSize: 11, color: 'text.secondary', mt: 0.25 }}>{figure.years}</Typography>
        <Typography sx={{ fontSize: 11.5, color: 'text.secondary', mt: 0.5, lineHeight: 1.35 }}>{blurb ?? figure.role}</Typography>
      </Box>
    );
  }

  // banner
  return (
    <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.6 }}>
      <Box
        sx={{
          maxWidth: 860,
          mx: 'auto',
          my: { xs: 5, md: 8 },
          p: { xs: 2.5, md: 3.5 },
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'center', sm: 'stretch' },
          gap: { xs: 2.5, md: 4 },
          borderRadius: 3,
          border: `1px solid ${alpha(tone, 0.28)}`,
          background: `linear-gradient(115deg, ${alpha(tone, 0.09)}, transparent 65%)`,
        }}
      >
        <Plate figure={figure} tone={tone} width={186} ratio={0.8} large />
        <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: { xs: 'center', sm: 'left' } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, justifyContent: { xs: 'center', sm: 'flex-start' }, mb: 1 }}>
            <Typography sx={{ fontFamily: mono, fontSize: 11.5, letterSpacing: '0.18em', color: tone }}>{label}</Typography>
            <Box sx={{ flex: 1, maxWidth: 120, height: 1, background: `linear-gradient(90deg, ${alpha(tone, 0.6)}, transparent)`, display: { xs: 'none', sm: 'block' } }} />
          </Box>
          <Typography sx={{ fontFamily: "'Fraunces Variable', Georgia, serif", fontWeight: 600, fontSize: { xs: '1.55rem', md: '1.95rem' }, lineHeight: 1.1 }}>
            {figure.name}
          </Typography>
          <Typography sx={{ fontFamily: mono, fontSize: 13, color: 'text.secondary', mt: 0.75 }}>{figure.years}</Typography>
          <Typography sx={{ fontFamily: "'Fraunces Variable', Georgia, serif", fontStyle: 'italic', fontSize: { xs: '1.05rem', md: '1.15rem' }, color: 'text.primary', mt: 1.5, lineHeight: 1.5 }}>
            {blurb ?? figure.role}
          </Typography>
        </Box>
      </Box>
    </motion.div>
  );
}

/** Small roman numeral for plate labels (1–20 is plenty here). */
function roman(n: number): string {
  const map: [number, string][] = [[10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];
  let out = '';
  for (const [v, s] of map) while (n >= v) { out += s; n -= v; }
  return out || 'I';
}
