import { Box, Typography, Chip } from '@mui/material';
import LockRounded from '@mui/icons-material/LockRounded';
import ArrowForwardRounded from '@mui/icons-material/ArrowForwardRounded';
import AutoStoriesRounded from '@mui/icons-material/AutoStoriesRounded';
import TouchAppRounded from '@mui/icons-material/TouchAppRounded';
import ScienceRounded from '@mui/icons-material/ScienceRounded';
import { motion, useScroll } from 'framer-motion';
import { chapters } from '@/content/chapters';
import type { Chapter } from '@/content/types';
import { Link } from '@/router';
import { FigureRow } from '@/components/layout/FigureRow';
import { PortraitCredits } from '@/components/layout/PortraitCredits';
import { hexA } from '@/components/layout/ChapterHero';

const HOW = [
  { icon: <AutoStoriesRounded />, label: 'Scroll to read', sub: 'The animations move in step with the story.' },
  { icon: <TouchAppRounded />, label: 'Reach in and play', sub: 'Drag sliders and flip switches — the physics responds live.' },
  { icon: <ScienceRounded />, label: 'See it, don’t solve it', sub: 'Every idea is a picture you can poke, not a formula.' },
];

/** The book's cover + table of contents. Each chapter card previews its palette. */
export function Home() {
  const { scrollYProgress } = useScroll();
  const firstChapter = chapters.find((c) => c.available)?.id ?? 'engine';
  return (
    <Box sx={{ position: 'relative' }}>
      <motion.div
        style={{
          scaleX: scrollYProgress, transformOrigin: '0%', position: 'fixed', top: 0, left: 0, right: 0, height: 3, zIndex: 20,
          background: 'linear-gradient(90deg,#3aa0ff,#d7dae6,#ff5330)',
        }}
      />

      {/* Cover */}
      <Box sx={{ position: 'relative', minHeight: { md: '100vh' }, display: 'flex', flexDirection: 'column', justifyContent: 'center', px: { xs: 3, md: 8 }, py: { xs: 8, md: 12 }, overflow: 'hidden' }}>
        <Box aria-hidden sx={{ position: 'absolute', inset: 0, background:
          'radial-gradient(55% 75% at 10% 35%, rgba(255,90,60,0.20), transparent 60%),' +
          'radial-gradient(55% 75% at 90% 65%, rgba(70,183,255,0.18), transparent 60%),' +
          'radial-gradient(120% 120% at 50% 120%, rgba(7,8,12,0.5), #07080c 72%)' }} />
        <Box sx={{ position: 'relative', maxWidth: 960 }}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <Typography variant="overline" sx={{ color: 'text.secondary', fontSize: 13 }}>
              An interactive history of thermodynamics · after Paul Sen’s <em>Einstein’s Fridge</em>
            </Typography>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}>
            <Typography variant="h1" sx={{ fontSize: { xs: '4rem', sm: '6rem', md: '8.5rem' }, lineHeight: 1.04, display: 'inline-block', pb: '0.08em', mt: 1.5, mb: 1.5,
              background: 'linear-gradient(100deg,#ff9166 0%,#eef1f8 45%,#7ad3ff 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Entropy
            </Typography>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.22 }}>
            <Typography sx={{ fontFamily: "'Fraunces Variable', Georgia, serif", fontSize: { xs: '1.35rem', md: '1.9rem' }, color: 'text.primary', maxWidth: 780, lineHeight: 1.3 }}>
              How the difference between hot and cold explains the universe — told in seven chapters, each one a story you can play with.
            </Typography>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.34 }}>
            <Typography sx={{ mt: 3, maxWidth: 660, fontSize: { xs: '1rem', md: '1.08rem' }, lineHeight: 1.7, color: 'text.secondary' }}>
              Two hundred years ago, a handful of engineers and dreamers chasing a better steam engine stumbled onto
              the deepest rule in all of physics — the one that decides why time runs forwards, why your coffee always
              goes cold, and how the universe itself will end. <Box component="span" sx={{ color: 'text.primary' }}>Entropy</Box> retraces
              their discoveries as something you can actually touch. No equations to memorize and no background needed —
              just curiosity.
            </Typography>
          </motion.div>

          {/* How it works */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.46 }}>
            <Box sx={{ mt: 4, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 2, sm: 3.5 }, maxWidth: 780 }}>
              {HOW.map((h) => (
                <Box key={h.label} sx={{ display: 'flex', gap: 1.5, flex: 1, alignItems: 'flex-start' }}>
                  <Box sx={{ color: 'text.secondary', mt: '2px', display: 'flex', '& svg': { fontSize: 22 } }}>{h.icon}</Box>
                  <Box>
                    <Typography sx={{ fontWeight: 700, fontSize: 14.5, lineHeight: 1.3 }}>{h.label}</Typography>
                    <Typography sx={{ fontSize: 12.5, color: 'text.secondary', lineHeight: 1.45, mt: 0.25 }}>{h.sub}</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </motion.div>

          {/* Call to action */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.58 }}>
            <Box sx={{ mt: 4.5, display: 'flex', alignItems: 'center', gap: 2.5, flexWrap: 'wrap' }}>
              <Link to={`/${firstChapter}`} style={{ textDecoration: 'none' }}>
                <Box
                  component="span"
                  sx={{
                    display: 'inline-flex', alignItems: 'center', gap: 1, px: 2.75, py: 1.25, borderRadius: 2,
                    fontWeight: 700, fontSize: 15, color: '#0a0a0f', cursor: 'pointer',
                    background: 'linear-gradient(100deg,#ff9166,#7ad3ff)',
                    boxShadow: '0 8px 30px rgba(255,120,80,0.25)',
                    transition: 'transform 0.18s, box-shadow 0.18s',
                    '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 12px 38px rgba(120,180,255,0.35)' },
                    '& svg': { fontSize: 18 },
                  }}
                >
                  Begin with Chapter One <ArrowForwardRounded />
                </Box>
              </Link>
              <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>or browse all seven below ↓</Typography>
            </Box>
          </motion.div>
        </Box>
      </Box>

      {/* Table of contents */}
      <Box sx={{ maxWidth: 940, mx: 'auto', px: { xs: 2.5, md: 5 }, pb: { xs: 8, md: 14 } }}>
        <Typography sx={{ fontFamily: "'JetBrains Mono Variable', monospace", fontSize: 12, letterSpacing: '0.22em', color: 'text.secondary', textAlign: 'center', mb: 4 }}>
          THE CHAPTERS
        </Typography>
        {chapters.map((ch, i) => (
          <ChapterCard key={ch.id} chapter={ch} index={i} />
        ))}
        <PortraitCredits />
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
