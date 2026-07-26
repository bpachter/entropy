import { useEffect, useRef, type ReactNode } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { motion } from 'framer-motion';

/**
 * A live CPython cell, running in the reader's browser.
 *
 * The actual runtime is `public/kernel-embed.js` — a vendored copy of the
 * canonical script at bpachter.github.io/kernel/embed.js, shared with the
 * other explainer sites. This component is only a themed React shell around
 * it: it renders the markup contract the runtime expects, hands the node over
 * once, and then leaves that subtree alone (the runtime owns those children,
 * so React must never re-render into them).
 *
 * Nothing is downloaded until the reader presses Run — a chapter that is only
 * read costs no extra bytes.
 */

declare global {
  interface Window {
    KernelEmbed?: { upgrade: (root?: ParentNode) => void; upgradeCell: (el: Element) => void };
  }
}

const RUNTIME_URL = new URL('kernel-embed.js', document.baseURI).href;
let runtimePromise: Promise<void> | null = null;

function loadRuntime(): Promise<void> {
  if (window.KernelEmbed) return Promise.resolve();
  if (runtimePromise) return runtimePromise;
  runtimePromise = new Promise<void>((resolve, reject) => {
    const s = document.createElement('script');
    s.src = RUNTIME_URL;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('could not load kernel-embed.js'));
    document.head.appendChild(s);
  });
  return runtimePromise;
}

export function KernelCell({
  title,
  code,
  packages,
  caption,
  intro,
}: {
  /** short label for the cell's title bar */
  title: string;
  /** the Python source, exactly as it should ship */
  code: string;
  /** Pyodide packages; omit for stdlib-only (much faster to boot) */
  packages?: string[];
  /** optional line under the cell, e.g. provenance of a constant */
  caption?: string;
  /** optional lede above the cell, earning its place in the chapter */
  intro?: ReactNode;
}) {
  const theme = useTheme();
  const hostRef = useRef<HTMLDivElement | null>(null);
  const done = useRef(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || done.current) return;
    done.current = true;

    host.setAttribute('data-kernel-cell', '');
    host.setAttribute('data-title', title);
    if (packages && packages.length) host.setAttribute('data-packages', packages.join(','));

    const src = document.createElement('script');
    src.type = 'text/x-python';
    src.textContent = code;
    host.appendChild(src);

    let cancelled = false;
    loadRuntime()
      .then(() => {
        if (!cancelled) window.KernelEmbed?.upgradeCell(host);
      })
      .catch(() => {
        if (cancelled) return;
        // Runtime unreachable — still show the source rather than an empty box.
        host.textContent = '';
        const pre = document.createElement('pre');
        pre.style.cssText =
          "margin:0;padding:16px;overflow:auto;font-family:'JetBrains Mono Variable',monospace;font-size:12.5px;line-height:1.55;color:#c7cedb";
        pre.textContent = code;
        host.appendChild(pre);
      });

    return () => {
      cancelled = true;
    };
  }, [title, code, packages]);

  const tone = theme.palette.primary.main;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ maxWidth: 860, mx: 'auto', my: { xs: 4, md: 6 } }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.25,
            mb: 1.25,
          }}
        >
          <Typography
            sx={{
              fontFamily: "'JetBrains Mono Variable', monospace",
              fontSize: 11.5,
              letterSpacing: '0.18em',
              color: tone,
            }}
          >
            LIVE PYTHON
          </Typography>
          <Box
            sx={{
              flex: 1,
              maxWidth: 140,
              height: 1,
              background: `linear-gradient(90deg, ${alpha(tone, 0.6)}, transparent)`,
            }}
          />
        </Box>

        {intro && (
          <Typography
            sx={{
              fontSize: '1.02rem',
              lineHeight: 1.7,
              color: 'text.primary',
              mb: 1.75,
              maxWidth: 760,
            }}
          >
            {intro}
          </Typography>
        )}

        {/* The runtime owns everything inside this node. */}
        <Box
          ref={hostRef}
          sx={{
            '--kc-accent': tone,
            '--kc-out': theme.palette.secondary.light,
            '--kc-bg': '#0e1017',
            '--kc-bg2': '#141822',
            '--kc-line': alpha(tone, 0.22),
            '--kc-text': theme.palette.text.primary,
            '--kc-bright': '#ffffff',
            '--kc-faint': theme.palette.text.secondary,
            '--kc-mono': "'JetBrains Mono Variable', monospace",
            minHeight: 80,
            border: `1px solid ${alpha(tone, 0.22)}`,
            borderRadius: 2,
          }}
        />

        {caption && (
          <Typography
            sx={{
              fontFamily: "'JetBrains Mono Variable', monospace",
              fontSize: 11,
              color: 'text.secondary',
              mt: 1,
              lineHeight: 1.5,
            }}
          >
            {caption}
          </Typography>
        )}
      </Box>
    </motion.div>
  );
}
