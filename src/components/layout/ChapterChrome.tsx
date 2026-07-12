import { Box, Typography } from '@mui/material';
import ArrowBackRounded from '@mui/icons-material/ArrowBackRounded';
import { motion, useScroll } from 'framer-motion';
import type { Chapter } from '@/content/types';
import { Link } from '@/router';

/** Fixed top bar (Contents link + chapter label) and a reading-progress bar. */
export function ChapterChrome({ chapter }: { chapter: Chapter }) {
  const { scrollYProgress } = useScroll();
  const { palette } = chapter;
  return (
    <>
      <motion.div
        style={{
          scaleX: scrollYProgress,
          transformOrigin: '0%',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          zIndex: 20,
          background: `linear-gradient(90deg, ${palette.secondary}, #d7dae6, ${palette.primary})`,
        }}
      />
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 48,
          zIndex: 15,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: { xs: 2, md: 3 },
          bgcolor: 'rgba(7,8,12,0.66)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Link to="/" style={{ textDecoration: 'none' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, color: 'text.secondary', '&:hover': { color: 'text.primary' } }}>
            <ArrowBackRounded sx={{ fontSize: 16 }} />
            <Typography sx={{ fontWeight: 700, letterSpacing: '0.2em', fontSize: 12 }}>CONTENTS</Typography>
          </Box>
        </Link>
        <Typography sx={{ fontSize: 12, color: 'text.secondary', letterSpacing: '0.05em' }}>
          {chapter.kicker} · {chapter.title}
        </Typography>
      </Box>
    </>
  );
}
