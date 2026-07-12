import { createTheme, type Theme } from '@mui/material/styles';
import type { ChapterPalette } from './content/types';

const sharedTypography = {
  fontFamily: "'Inter Variable', system-ui, -apple-system, sans-serif",
  h1: { fontFamily: "'Fraunces Variable', Georgia, serif", fontWeight: 600, letterSpacing: '-0.02em' },
  h2: { fontFamily: "'Fraunces Variable', Georgia, serif", fontWeight: 600, letterSpacing: '-0.015em' },
  h3: { fontFamily: "'Fraunces Variable', Georgia, serif", fontWeight: 600, letterSpacing: '-0.01em' },
  h4: { fontFamily: "'Fraunces Variable', Georgia, serif", fontWeight: 600 },
  h5: { fontFamily: "'Inter Variable', sans-serif", fontWeight: 600 },
  h6: { fontFamily: "'Inter Variable', sans-serif", fontWeight: 600 },
  body1: { lineHeight: 1.75, fontSize: '1.075rem' },
  button: { textTransform: 'none' as const, fontWeight: 600 },
  overline: { letterSpacing: '0.18em', fontWeight: 600 },
};

const sharedComponents = {
  MuiButton: { styleOverrides: { root: { borderRadius: 999, paddingInline: 20 } } },
};

/**
 * Build a dark theme tuned to one chapter's palette. The whole app shares the
 * same typographic system, but each chapter recolours its accents so it reads as
 * its own place. Home uses `theme` (the Entropy palette) as a neutral default.
 */
export function makeChapterTheme(p: ChapterPalette): Theme {
  return createTheme({
    palette: {
      mode: 'dark',
      background: { default: p.bg, paper: p.bgRaised },
      primary: { main: p.primary, light: p.primarySoft },
      secondary: { main: p.secondary, light: p.secondarySoft },
      text: { primary: '#eef1f8', secondary: '#9aa3b8' },
      divider: 'rgba(255,255,255,0.08)',
    },
    typography: sharedTypography,
    shape: { borderRadius: 12 },
    components: sharedComponents,
  });
}

/**
 * A "thermal" dark theme. The whole app lives on the hot↔cold axis, so the
 * palette is built from an ember-orange (hot) and a glacier-blue (cold) with a
 * near-black background so the simulations glow. Display type is a serif
 * (Fraunces) to lend the history-of-science material a booklike gravity;
 * body is Inter; numeric readouts are JetBrains Mono.
 */
export const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#07080c',
      paper: '#0e1017',
    },
    primary: { main: '#ff5a3c', light: '#ff9166' }, // hot
    secondary: { main: '#46b7ff', light: '#7ad3ff' }, // cold
    text: {
      primary: '#eef1f8',
      secondary: '#9aa3b8',
    },
    divider: 'rgba(255,255,255,0.08)',
  },
  typography: {
    fontFamily: "'Inter Variable', system-ui, -apple-system, sans-serif",
    h1: { fontFamily: "'Fraunces Variable', Georgia, serif", fontWeight: 600, letterSpacing: '-0.02em' },
    h2: { fontFamily: "'Fraunces Variable', Georgia, serif", fontWeight: 600, letterSpacing: '-0.015em' },
    h3: { fontFamily: "'Fraunces Variable', Georgia, serif", fontWeight: 600, letterSpacing: '-0.01em' },
    h4: { fontFamily: "'Fraunces Variable', Georgia, serif", fontWeight: 600 },
    h5: { fontFamily: "'Inter Variable', sans-serif", fontWeight: 600 },
    h6: { fontFamily: "'Inter Variable', sans-serif", fontWeight: 600 },
    body1: { lineHeight: 1.75, fontSize: '1.075rem' },
    button: { textTransform: 'none', fontWeight: 600 },
    overline: { letterSpacing: '0.18em', fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 999, paddingInline: 20 },
      },
    },
  },
});

// Shared non-MUI tokens for canvas/three code that can't read the theme object.
export const thermal = {
  bg: '#07080c',
  ink: '#eef1f8',
  inkDim: '#9aa3b8',
  hot: '#ff5a3c',
  hotSoft: '#ff9166',
  cold: '#46b7ff',
  coldSoft: '#7ad3ff',
} as const;
