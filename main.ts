// Leonida Platinum Roadbook — the hand-in program for gta6-trophy-guide-01 (Node 22, stdlib only).
//
// The guide itself is plain static files in app/: index.html, its ES modules, CSS and
// app/data/trophies.json, with no build step and no network use. This program copies app/
// and screenshots/ from beside this file into the output directory and writes
// output/dossier.json with the vendored make.fun library, exactly as the kit asks.
// vendor/makefun-frontend.ts is the kit's copy and must stay unchanged: the scorer rebuilds
// the dossier with its own copy and compares the two byte for byte.
//
// Run it locally with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output.

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(outputDir, { recursive: true });
cpSync(join(repoRoot, 'app'), join(outputDir, 'app'), { recursive: true });
mkdirSync(join(outputDir, 'screenshots'), { recursive: true });
if (existsSync(join(repoRoot, 'screenshots'))) {
  cpSync(join(repoRoot, 'screenshots'), join(outputDir, 'screenshots'), { recursive: true });
}

// The scorer's caps, from the kit's reference/gate.json: the dossier text is capped at
// 160 KiB, at most 4 screenshots of 256 KiB each, and app/ holds at most 993 entries
// and 48 MiB. buildDossier refuses anything past those limits, as the scorer would.
writeFileSync(
  join(outputDir, 'dossier.json'),
  buildDossier(outputDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 50331648,
  }),
);
