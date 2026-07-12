import { Box, Typography, ThemeProvider } from '@mui/material';
import { entropyChapter } from '@/content/chapters';
import { makeChapterTheme } from '@/theme';
import { ChapterChrome } from '@/components/layout/ChapterChrome';
import { ChapterHero } from '@/components/layout/ChapterHero';
import { ChapterFooter } from '@/components/layout/ChapterFooter';
import { ScrollyChapter } from '@/components/scrolly/ScrollyChapter';

const theme = makeChapterTheme(entropyChapter.palette);

/** Chapter Three — the original showcase: a pinned interactive per narrative beat. */
export function EntropyChapter() {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: 'background.default', color: 'text.primary', minHeight: '100vh' }}>
        <ChapterChrome chapter={entropyChapter} />
        <ChapterHero chapter={entropyChapter} />

        <Box sx={{ textAlign: 'center', px: 3, pt: { xs: 2, md: 4 }, pb: { xs: 4, md: 8 } }}>
          <Typography variant="overline" sx={{ color: 'primary.light' }}>{entropyChapter.kicker}</Typography>
          <Typography variant="h2" sx={{ fontSize: { xs: '2.1rem', md: '3rem' } }}>{entropyChapter.title}</Typography>
        </Box>

        <ScrollyChapter chapter={entropyChapter} />
        <ChapterFooter chapter={entropyChapter} />
      </Box>
    </ThemeProvider>
  );
}
