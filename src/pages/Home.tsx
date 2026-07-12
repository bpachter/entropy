import { Box, Typography, Chip } from '@mui/material';
import LockRounded from '@mui/icons-material/LockRounded';
import ArrowForwardRounded from '@mui/icons-material/ArrowForwardRounded';
import { motion, useScroll } from 'framer-motion';
import { chapters } from '@/content/chapters';
import type { Chapter } from '@/content/types';
import { Link } from '@/router';
import { FigureRow } from '@/components/layout/FigureRow';
import { hexA } from '@/components/layout/ChapterHero';

/** The book's cover + table of contents. Each chapter card previews its palette. */
export function Home() {
  const { scrollYProgress } = useScroll();
  return (
    <Box sx={{ position: 'relative' }}>
      <motion.div
        style={{
          scaleX: scrollYProgress, transformOrigin: '0%', position: 'fixed', top: 0, left: 0, right: 0, height: 3, zIndex: 20,
          background: 'linear-gradient(90deg,#3aa0ff,#d7dae6,#ff5330)',
        }}
      />

      {/* Cover */}
      <Box sx={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', px: { xs: 3, md: 8 }, py: 12, overflow: 'hidden' }}>
        <Box aria-hidden sx={{ position: 'absolute', inset: 0, background:
          'radial-gradient(55% 75% at 10% 35%, rgba(255,90,60,0.20), transparent 60%),' +
          'radial-gradient(55% 75% at 90% 65%, rgba(70,183,255,0.18), transparent 60%),' +
          'radial-gradient(120% 120% at 50% 120%, rgba(7,8,12,0.5), #07080c 72%)' }} />
        <Box sx={{ position: 'relative', maxWidth: 940 }}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <Typography variant="overline" sx={{ color: 'text.secondary', fontSize: 13 }}>
              An interactive history of thermodynamics · after Paul Sen’s <em>Einstein’s Fridge</em>
            </Typography>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}>
            <Typography variant="h1" sx={{ fontSize: { xs: '4rem', sm: '6rem', md: '8.5rem' }, lineHeight: 0.95, my: 2,
              background: 'linear-gradient(100deg,#ff9166 0%,#eef1f8 45%,#7ad3ff 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Entropy
            </Typography>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.25 }}>
            <Typography sx={{ fontFamily: "'Fraunces Variable', Georgia, serif", fontSize: { xs: '1.35rem', md: '1.9rem' }, color: 'text.primary', maxWidth: 760, lineHeight: 1.3 }}>
              How the difference between hot and cold explains the universe — told in seven chapters, each one a story you can play with.
            </Typography>
          </motion.div>
        </Box>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} style={{ position: 'absolute', bottom: 30, left: '50%', transform: 'translateX(-50%)' }}>
          <Typography sx={{ fontSize: 12, letterSpacing: '0.18em', color: 'text.secondary' }}>THE CHAPTERS</Typography>
        </motion.div>
      </Box>

      {/* Table of contents */}
      <Box sx={{ maxWidth: 940, mx: 'auto', px: { xs: 2.5, md: 5 }, pb: { xs: 8, md: 14 } }}>
        {chapters.map((ch, i) => (
          <ChapterCard key={ch.id} chapter={ch} index={i} />
        ))}
      </Box>
    </Box>
  );
}

function ChapterCard({ chapter, index }: { chapter: Chapter; index: number }) {
  const c = chapter.palette;
  const inner = (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.05 }}
    >
      <Box
        sx={{
          position: 'relative', mb: 2.5, p: { xs: 2.5, md: 3.5 }, borderRadius: 3, overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.09)',
          background: `linear-gradient(120deg, ${hexA(c.primary, 0.09)}, ${hexA(c.secondary, 0.06)} 70%, transparent)`,
          opacity: chapter.available ? 1 : 0.62,
          transition: 'transform 0.2s, border-color 0.2s',
          '&:hover': chapter.available ? { transform: 'translateY(-3px)', borderColor: hexA(c.primary, 0.55) } : {},
        }}
      >
        <Box sx={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: `linear-gradient(${c.primary}, ${c.secondary})` }} />
        <Box sx={{ display: 'flex', alignItems: { md: 'center' }, justifyContent: 'space-between', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
          <Box sx={{ minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
              <Typography sx={{ fontFamily: "'JetBrains Mono Variable', monospace", fontSize: 12, color: 'text.secondary' }}>
                {chapter.kicker} · {chapter.era}
              </Typography>
              {chapter.available ? (
                <Chip size="small" label="Ready" sx={{ height: 20, bgcolor: hexA(c.primary, 0.16), color: c.primarySoft, border: `1px solid ${hexA(c.primary, 0.4)}` }} />
              ) : (
                <Chip size="small" icon={<LockRounded sx={{ fontSize: 13 }} />} label="Coming soon" sx={{ height: 20, bgcolor: 'rgba(255,255,255,0.05)', color: 'text.secondary' }} />
              )}
            </Box>
            <Typography variant="h3" sx={{ fontSize: { xs: '1.6rem', md: '2rem' }, mt: 0.5 }}>{chapter.title}</Typography>
            <Typography sx={{ color: 'text.secondary', mt: 0.5, fontStyle: 'italic', fontFamily: "'Fraunces Variable', serif" }}>{chapter.mood}</Typography>
            <Box sx={{ mt: 2 }}><FigureRow figures={chapter.figures} compact /></Box>
          </Box>
          {chapter.available && <ArrowForwardRounded sx={{ color: c.primary, flexShrink: 0 }} />}
        </Box>
      </Box>
    </motion.div>
  );

  return chapter.available ? (
    <Link to={`/${chapter.id}`} style={{ textDecoration: 'none' }}>{inner}</Link>
  ) : (
    inner
  );
}
