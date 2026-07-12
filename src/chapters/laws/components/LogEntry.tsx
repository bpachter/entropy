import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';

export interface LogProse {
  kind: 'entry';
  /** Mono margin stamp, e.g. a year or a short label. */
  stamp?: string;
  heading?: string;
  body: string[];
  pullquote?: { text: string; cite: string };
}

/** A dated logbook entry: mono margin stamp, ruled left edge, serif prose. */
export function LogEntry({ block }: { block: LogProse }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.55 }}>
      <Box sx={{ maxWidth: 720, mx: 'auto', py: { xs: 4, md: 6 }, display: 'flex', gap: { xs: 2, md: 3 } }}>
        {/* margin stamp */}
        <Box sx={{ flexShrink: 0, width: { xs: 0, md: 96 }, display: { xs: 'none', md: 'block' }, textAlign: 'right' }}>
          {block.stamp && (
            <Typography sx={{ fontFamily: "'JetBrains Mono Variable', monospace", fontSize: 12.5, color: 'primary.light', letterSpacing: '0.06em', mt: 1 }}>
              {block.stamp}
            </Typography>
          )}
        </Box>
        {/* ruled entry */}
        <Box sx={{ borderLeft: '1px solid rgba(245,183,60,0.28)', pl: { xs: 2.5, md: 4 }, flex: 1 }}>
          {block.stamp && (
            <Typography sx={{ display: { xs: 'block', md: 'none' }, fontFamily: "'JetBrains Mono Variable', monospace", fontSize: 12, color: 'primary.light', mb: 1 }}>
              {block.stamp}
            </Typography>
          )}
          {block.heading && (
            <Typography variant="h3" sx={{ fontSize: { xs: '1.7rem', md: '2.15rem' }, mb: 2.25, lineHeight: 1.14 }}>{block.heading}</Typography>
          )}
          {block.body.map((p, i) => (
            <Typography key={i} variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>{p}</Typography>
          ))}
          {block.pullquote && (
            <Box component="blockquote" sx={{ m: 0, mt: 3.5, pl: 3, borderLeft: '3px solid', borderColor: 'secondary.main' }}>
              <Typography sx={{ fontFamily: "'Fraunces Variable', Georgia, serif", fontStyle: 'italic', fontSize: '1.4rem', lineHeight: 1.4 }}>
                “{block.pullquote.text}”
              </Typography>
              <Typography sx={{ mt: 1, fontSize: 13, color: 'text.secondary' }}>— {block.pullquote.cite}</Typography>
            </Box>
          )}
        </Box>
      </Box>
    </motion.div>
  );
}
