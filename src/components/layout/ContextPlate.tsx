import { Box, Typography, Link as MuiLink, useTheme } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { contextImages } from '@/assets/context';

/** Etched L-brackets at a plate's corners — the shared engineering-drawing detail. */
function CornerTicks({ color }: { color: string }) {
  const c = { position: 'absolute' as const, width: 13, height: 13, borderColor: color, pointerEvents: 'none' as const, zIndex: 2 };
  return (
    <>
      <Box sx={{ ...c, top: 7, left: 7, borderTop: '1.5px solid', borderLeft: '1.5px solid' }} />
      <Box sx={{ ...c, top: 7, right: 7, borderTop: '1.5px solid', borderRight: '1.5px solid' }} />
      <Box sx={{ ...c, bottom: 7, left: 7, borderBottom: '1.5px solid', borderLeft: '1.5px solid' }} />
      <Box sx={{ ...c, bottom: 7, right: 7, borderBottom: '1.5px solid', borderRight: '1.5px solid' }} />
    </>
  );
}

/**
 * A blown-up historical artifact set into a chapter, captioned like a textbook
 * figure. Engravings and diagrams (`paper`) sit on a warm matted card; photographs
 * stay dark and near-immersive. Colours come from the active chapter theme.
 */
export function ContextPlate({ slug }: { slug: string }) {
  const img = contextImages[slug];
  const theme = useTheme();
  if (!img) return null;
  const tone = theme.palette.primary.main;
  const mono = "'JetBrains Mono Variable', monospace";
  const paper = img.paper;

  return (
    <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.6 }}>
      <Box sx={{ maxWidth: 880, mx: 'auto', my: { xs: 5, md: 9 }, px: { xs: 0.5, md: 0 } }}>
        {/* the framed plate */}
        <Box
          sx={{
            position: 'relative',
            borderRadius: 2,
            overflow: 'hidden',
            border: `1px solid ${alpha(tone, paper ? 0.3 : 0.4)}`,
            boxShadow: `0 26px 70px -34px ${alpha(tone, 0.45)}, 0 2px 10px rgba(0,0,0,0.5)`,
            background: paper ? '#f4f0e6' : '#06070c',
            p: paper ? { xs: 1.5, md: 2.5 } : 0,
          }}
        >
          <Box
            component="img"
            src={img.url}
            alt={img.title}
            loading="lazy"
            sx={{
              display: 'block',
              width: '100%',
              height: 'auto',
              maxHeight: { xs: '68vh', md: '78vh' },
              objectFit: 'contain',
              mx: 'auto',
              borderRadius: paper ? 0.5 : 0,
            }}
          />
          <CornerTicks color={alpha(tone, paper ? 0.4 : 0.6)} />
        </Box>

        {/* caption block */}
        <Box sx={{ mt: 1.75, display: 'flex', gap: { xs: 1.5, md: 2.5 }, alignItems: 'flex-start', px: { xs: 1, md: 0 } }}>
          <Typography sx={{ fontFamily: mono, fontSize: 11, letterSpacing: '0.12em', color: tone, whiteSpace: 'nowrap', pt: 0.4, flexShrink: 0 }}>
            {img.label}
          </Typography>
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontFamily: "'Fraunces Variable', Georgia, serif", fontStyle: 'italic', fontSize: { xs: '1.05rem', md: '1.2rem' }, color: 'text.primary', lineHeight: 1.4 }}>
              {img.title}
            </Typography>
            <Typography sx={{ fontSize: { xs: 13, md: 14 }, color: 'text.secondary', mt: 0.75, lineHeight: 1.55 }}>
              {img.caption}
            </Typography>
            <MuiLink
              href={img.source}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ display: 'inline-block', mt: 1, fontFamily: mono, fontSize: 10.5, letterSpacing: '0.06em', color: 'text.secondary', textDecorationColor: alpha('#ffffff', 0.25), '&:hover': { color: 'text.primary' } }}
            >
              {img.license} · Wikimedia Commons ↗
            </MuiLink>
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
}
