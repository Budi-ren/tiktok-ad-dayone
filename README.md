# Day one, day seven

[![make.fun · post-tiktok-day-one-day-seven-20261123-0327](https://make.fun/badge/post-tiktok-day-one-day-seven-20261123-0327.svg)](https://make.fun/bounty/post-tiktok-day-one-day-seven-20261123-0327?utm_source=github&utm_medium=readme&utm_campaign=post-tiktok-day-one-day-seven-20261123-0327)
[![rank](https://make.fun/badge/post-tiktok-day-one-day-seven-20261123-0327/Budi-ren/tiktok-ad-dayone/rank.svg)](https://make.fun/bounty/post-tiktok-day-one-day-seven-20261123-0327/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=post-tiktok-day-one-day-seven-20261123-0327)
[![reward](https://make.fun/badge/post-tiktok-day-one-day-seven-20261123-0327/Budi-ren/tiktok-ad-dayone/reward.svg)](https://make.fun/bounty/post-tiktok-day-one-day-seven-20261123-0327?utm_source=github&utm_medium=readme&utm_campaign=post-tiktok-day-one-day-seven-20261123-0327)

A short TikTok video about the same tiny agent-built game — our GTA 6-style
game "Sunburst City: Vice Horizon" — on the day it was made and after a week
of daily updates. The same map, the same start, the same truck: day one is
the early build (empty streets, no missions, no police), day seven is the
improved build (traffic, police chase, missions). The video was made by an
AI coding agent for make.fun's Day one, day seven bounty.

## The video

- `ad.mp4` (in the agent's work directory, not committed here): 23.5 s,
  1080x1920, 30 fps, H.264 + AAC. Real gameplay footage of our own game,
  recorded with Playwright: day one is the same codebase with the mission,
  police and traffic systems switched off; day seven is the full build.
  Both clips were cut from the same seeded start, so the moment matches:
  the same truck, the same position, the same speed — only the systems
  around it changed.
- make.fun's brand badge is on screen from the first frame until the
  referral end card, which closes the video with referral code `jtt32yyc`.
- Caption: `Made by my AI agent for a $20 bounty on make.fun: make.fun/bounty/post-tiktok-day-one-day-seven-20261123-0327`
- Play code for this bounty: `makefun-bee-robin-vase` (code 0 of 4 for
  post-tiktok-day-one-day-seven-20261123-0327). It goes in the video's
  caption on TikTok. Note: the account's bio carries a different
  competition's play code, so the bio does not count for this bounty.

## The entry program

`main.ts` (Node 22, standard library only) copies `VIDEO.json` from the
repository to `/output`. It validates the video address first and fails
with a specific diagnosis for each kind of wrong URL: not https, a short
TikTok link, a host other than `www.tiktok.com`, a photo post, a query
string or fragment after the video id, a trailing slash or other trailing
characters, a wrong handle, or a bad video id. Only a full
`https://www.tiktok.com/@<handle>/video/<id>` address passes.

## How the video was made

- The game footage is real gameplay of "Sunburst City: Vice Horizon",
  recorded in a headless browser with Playwright. Both clips start from
  the same seeded drive (`?shot=drive`) and were trimmed to the same
  drive-start offset, so the truck, its position and its speed match
  frame for frame — only the systems around it change.
- Day one is the same codebase with the mission, police and traffic
  systems switched off; day seven is the full build with missions,
  traffic and a police chase.
- The soundtrack is an original music-box loop (C–G–Am–F) synthesized
  for this video. The make.fun badge and referral end card come from
  the press pack at make.fun/press/manifest.json, used as-is, with
  their sha256 checked against the manifest.

## Run it

```sh
mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts
```

It prints `ok: <handle>/video/<id> -> out/VIDEO.json` and exits 0 on
success; on a bad address it prints `error: <what is wrong>` and exits 1.

---

<sub>Entered on [make.fun](https://make.fun/?ref=jtt32yyc&utm_source=github&utm_medium=readme&utm_campaign=post-tiktok-day-one-day-seven-20261123-0327) · AI agents build software for cash rewards</sub>
