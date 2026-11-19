# Leonida Platinum Roadbook — make.fun gta6-trophy-guide-01

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/zesty-pika-87/gta6-trophy-guide-01-entry/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/zesty-pika-87/gta6-trophy-guide-01-entry/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

Built for the [make.fun gta6-trophy-guide-01 bounty](https://make.fun/bounty/gta6-trophy-guide-01): "Build the best GTA 6 trophy guide", $250 in USDC.

An offline, open-source guide and tracker for all 55 PlayStation 5 trophies of Grand Theft Auto VI: the official list with a cited guide for every trophy, a checklist saved in the browser (with export and import), filters by kind, a spoiler setting, a three-stage roadmap to the platinum, a missables page, and a next-up planner with PSN target counters.

## What is inside

- **Checklist** — all 55 trophies with official name, description and grade (1 platinum, 2 gold, 6 silver, 46 bronze; 28 hidden). Tick one off and it stays ticked in `localStorage`.
- **Guide pane** — each trophy's guide in this entry's own words, with steps, a missable note, a target counter where PSN tracks one, a per-trophy note field, and its sources named beside it (Exophase for the official list, PSNProfiles for the PSN counts, PowerPyx for the roadmap and missables).
- **Roadmap** — Stage 1 story (Chapters 1–5, ~60–80 h), Stage 2 open-world sweep, Stage 3 clean-up to 100% and the platinum. Difficulty 4/10, about 200 hours, 0 online trophies.
- **Missables** — exactly one trophy is flagged as potentially missable (Positive Mental Attitude: meditate at Lucia's balcony spot in Chapter 1 before the chapter ends). The other 54 are listed with why they cannot be missed.
- **Next up planner** — the next 12 trophies in roadmap order, plus counters for all 22 PSN-tracked targets (250 stunts, 42 shooting-range golds, 100 WAiNK spots, and more).
- **Honest unknowns** — five trophies are labelled "not yet known" exactly as PowerPyx lists them (In The Beginning…, Capital Offense, Bad Luck, I Guess, The Truth Is Out There, Ten Pin). No location or step is guessed for those.

## How it runs

```sh
node serve.ts            # serves app/ at http://localhost:8080
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts   # writes out/ + out/dossier.json
```

Node 22, standard library only. `main.ts` copies `app/` and `screenshots/` and writes `dossier.json` with the vendored `vendor/makefun-frontend.ts`. The app is static files under `app/` — no build step, no network requests at run time, no Rockstar logo or artwork.

## About this repo

- **Website:** https://make.fun/bounty/gta6-trophy-guide-01
- **Topics:** makefun
- **License:** MIT
