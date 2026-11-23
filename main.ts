// tiktok-ad-dayone — main.ts
// Entry program for the make.fun bounty "Day one, day seven"
// (post-tiktok-day-one-day-seven-20261123-0327).
// Copies VIDEO.json from the repository to /output, nothing else.
// Node 22, standard library only.
import { copyFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const HANDLES = ['@Approximatelly6', '@approximatelly888', '@approximatelly'];

function fail(message) {
  console.error(`error: ${message}`);
  process.exit(1);
}

function main() {
  const botDir = process.env.MAKEFUN_BOT_DIR || '/bot';
  const outDir = process.env.MAKEFUN_OUTPUT_DIR || '/output';
  const videoPath = join(botDir, 'VIDEO.json');

  if (!existsSync(videoPath)) fail(`VIDEO.json not found at ${videoPath}`);

  let parsed;
  try {
    parsed = JSON.parse(readFileSync(videoPath, 'utf8'));
  } catch {
    fail('VIDEO.json is not valid JSON');
  }
  if (!parsed || typeof parsed.url !== 'string') {
    fail('VIDEO.json must be an object with a string "url"');
  }
  const url = parsed.url;

  // Specific diagnostics before the general format check, so a wrong URL
  // says exactly what is wrong with it instead of one generic error.
  if (!url.startsWith('https://')) {
    fail('url must use https, not http (and must be a www.tiktok.com address)');
  }
  if (/^https:\/\/(vt|vm)\.tiktok\.com\//.test(url) || /^https:\/\/www\.tiktok\.com\/t\//.test(url)) {
    fail('url is a short TikTok link; use the full video address instead');
  }
  const host = url.slice('https://'.length).split('/')[0];
  if (host !== 'www.tiktok.com') {
    fail(`url must be on www.tiktok.com, not ${host}; use the full video address on www.tiktok.com`);
  }
  if (url.includes('/photo/')) {
    fail('url names a TikTok photo post, not a video');
  }
  if (/\/video\/[0-9]+\?/.test(url)) {
    fail('url has a query string after the video id; use the bare video address without the ?... part');
  }
  if (/\/video\/[0-9]+#/.test(url)) {
    fail('url has a fragment after the video id; use the bare video address without the #... part');
  }
  if (/\/video\/[0-9]+[^0-9]/.test(url)) {
    fail('url has trailing characters after the video id');
  }

  const m = url.match(/^https:\/\/www\.tiktok\.com\/(@[A-Za-z0-9._]+)\/video\/([0-9]+)$/);
  if (!m) fail('url must be a full TikTok video address: https://www.tiktok.com/@<handle>/video/<id>');
  const [, handle, id] = m;
  if (!HANDLES.includes(handle)) fail(`unexpected TikTok handle ${handle}`);
  if (!/^[1-9][0-9]{9,18}$/.test(id)) fail('video id must be 10-19 digits, not all zeros, no leading zero');

  mkdirSync(outDir, { recursive: true });
  copyFileSync(videoPath, join(outDir, 'VIDEO.json'));
  console.log(`ok: ${handle}/video/${id} -> ${outDir}/VIDEO.json`);
}

main();
