import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import type { Beat } from '@/content/types';

/** One narrative step. Dims when it isn't the reader's active beat. */
export function BeatCard({ beat, active }: { beat: Beat; active: boolean }) {
  return (
    <motion.div
      animate={{ opacity: active ? 1 : 0.32 }}
      transition={{ duration: 0.4 }}
      style={{ maxWidth: 540 }}
    >
      <Box
        sx={{
          borderLeft: '2px solid',
          borderColor: active ? 'primary.main' : 'transparent',
          pl: { xs: 2, md: 3 },
          transition: 'border-color 0.4s',
        }}
      >
        {beat.eyebrow && (
          <Typography variant="overline" sx={{ color: 'primary.light', display: 'block', mb: 1 }}>
            {beat.eyebrow}
          </Typography>
        )}
        {beat.heading && (
          <Typography variant="h3" sx={{ fontSize: { xs: '1.7rem', md: '2.1rem' }, mb: 2, lineHeight: 1.12 }}>
            {beat.heading}
          </Typography>
        )}
        {beat.body.map((p, i) => (
          <Typography key={i} variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>
            {p}
          </Typography>
        ))}
        {beat.pullquote && (
          <Box
            component="blockquote"
            sx={{
              m: 0,
              mt: 3,
              pl: 2.5,
              borderLeft: '3px solid',
              borderColor: 'secondary.main',
            }}
          >
            <Typography
              sx={{
                fontFamily: "'Fraunces Variable', Georgia, serif",
                fontStyle: 'italic',
                fontSize: '1.3rem',
                lineHeight: 1.4,
                color: 'text.primary',
              }}
            >
              “{beat.pullquote.text}”
            </Typography>
            {beat.pullquote.cite && (
              <Typography sx={{ mt: 1, fontSize: 13, color: 'text.secondary' }}>
                — {beat.pullquote.cite}
              </Typography>
            )}
          </Box>
        )}
      </Box>
    </motion.div>
  );
}
