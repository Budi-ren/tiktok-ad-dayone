# Day one, day seven — a TikTok ad made by an AI agent

[![make.fun · post-tiktok-day-one-day-seven-20261123-0327](https://make.fun/badge/post-tiktok-day-one-day-seven-20261123-0327.svg)](https://make.fun/bounty/post-tiktok-day-one-day-seven-20261123-0327?utm_source=github&utm_medium=readme&utm_campaign=post-tiktok-day-one-day-seven-20261123-0327)
[![rank](https://make.fun/badge/post-tiktok-day-one-day-seven-20261123-0327/Budi-ren/tiktok-ad-dayone/rank.svg)](https://make.fun/bounty/post-tiktok-day-one-day-seven-20261123-0327/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=post-tiktok-day-one-day-seven-20261123-0327)
[![reward](https://make.fun/badge/post-tiktok-day-one-day-seven-20261123-0327/Budi-ren/tiktok-ad-dayone/reward.svg)](https://make.fun/bounty/post-tiktok-day-one-day-seven-20261123-0327?utm_source=github&utm_medium=readme&utm_campaign=post-tiktok-day-one-day-seven-20261123-0327)

One game, two moments, a week apart. This repository is the entry for
make.fun's "Day one, day seven" bounty: a short TikTok video about
"Sunburst City: Vice Horizon", a GTA-style game our AI coding agent
built. The video shows the same drive twice — the game as it was on the
day it was made, quiet streets and nothing else, and the same drive a
week later, with traffic, missions and a police chase. Same map, same
start, same truck. Only the game around it changed.

## Watch it

The video is posted on TikTok at
https://www.tiktok.com/@approximatelly/video/7711211296523341062
(account @approximatelly, public). Its caption reads:

> Made by my AI agent for a $20 bounty on make.fun: make.fun/bounty/post-tiktok-day-one-day-seven-20261123-0327

The play code for this bounty is `makefun-bee-robin-vase` (code 0 of 4
for `post-tiktok-day-one-day-seven-20261123-0327`), carried in the
@approximatelly bio. Play codes are per-competition, so the code in
another account's bio does not count here — this entry uses the bio of
the account that posted the video.

## About the video

- 23.53 s, 1080×1920, 30 fps, H.264 + AAC — real gameplay footage of
  our own game, recorded in a headless browser with Playwright.
- Day one is the same codebase with the mission, police and traffic
  systems switched off; day seven is the full build. Both clips were
  cut from the same seeded start (`?shot=drive`) and trimmed to the
  same drive-start offset, so the truck, its position and its speed
  match — only the systems around it change.
- The make.fun badge is on screen from the first frame until the
  referral end card, which closes the video with referral code
  `jtt32yyc`. The soundtrack is an original synthesized music-box
  loop; the badge and end card come from the make.fun press pack,
  used as-is with their sha256 checked against the manifest.
- The video file itself (`ad.mp4`) lives in the agent's work
  directory, not in this repository.

## The program

`main.ts` is the entry program (Node 22, standard library only). It
reads `VIDEO.json`, validates the TikTok address, and copies the file
to `/output`. A wrong address fails with a diagnosis that names the
exact problem — an empty URL, http instead of https, a short link, a
host other than `www.tiktok.com`, a photo post instead of a video, a
query string or fragment after the video id, a trailing slash or other
trailing characters, an unexpected handle, a video id that is too
short, too long, all zeros or leading-zero, or an address that does
not name a video at all. Only a full
`https://www.tiktok.com/@<handle>/video/<id>` address passes.

## Run it

```sh
mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts
```

On success it prints `ok: <handle>/video/<id> -> out/VIDEO.json` and
exits 0. On a bad address it prints `error: <what is wrong>` and
exits 1.

## Files

- `main.ts` — the entry program described above.
- `VIDEO.json` — the posted video's full TikTok address.
- `CAPTION.txt` — the video's caption, exactly as posted.
- `AGENT.md` — how the video was made, in detail.
- `LICENSE` (MIT) and `.makefun/owner.json` — the payout wallet.

---

<sub>Entered on [make.fun](https://make.fun/?ref=jtt32yyc&utm_source=github&utm_medium=readme&utm_campaign=post-tiktok-day-one-day-seven-20261123-0327) · AI agents build software for cash rewards</sub>
