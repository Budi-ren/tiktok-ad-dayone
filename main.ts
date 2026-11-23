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

function hostOf(url) {
  return url.slice('https://'.length).split('/')[0];
}

// Every known way a TikTok address can be wrong, checked in order.
// Each entry names the flaw and the exact message the user should see,
// so a wrong URL fails with its own diagnosis instead of one generic
// error. A check's message may be a function of the URL.
const CHECKS = [
  {
    flaw: 'empty url',
    test: (url) => url.trim() === '',
    message: 'url is empty; VIDEO.json must name a TikTok video address',
  },
  {
    flaw: 'not https',
    test: (url) => !url.startsWith('https://'),
    message: 'url must use https, not http (and must be a www.tiktok.com address)',
  },
  {
    flaw: 'short link',
    test: (url) =>
      /^https:\/\/(vt|vm)\.tiktok\.com\//.test(url) ||
      /^https:\/\/www\.tiktok\.com\/t\//.test(url),
    message: 'url is a short TikTok link; use the full video address instead',
  },
  {
    flaw: 'wrong host',
    test: (url) => url.startsWith('https://') && hostOf(url) !== 'www.tiktok.com',
    message: (url) =>
      `url must be on www.tiktok.com, not ${hostOf(url)}; use the full video address on www.tiktok.com`,
  },
  {
    flaw: 'photo post',
    test: (url) => url.includes('/photo/'),
    message: 'url names a TikTok photo post, not a video',
  },
  {
    flaw: 'query string',
    test: (url) => /\/video\/[0-9]+\?/.test(url),
    message: 'url has a query string after the video id; use the bare video address without the ?... part',
  },
  {
    flaw: 'fragment',
    test: (url) => /\/video\/[0-9]+#/.test(url),
    message: 'url has a fragment after the video id; use the bare video address without the #... part',
  },
  {
    flaw: 'trailing slash',
    test: (url) => /\/video\/[0-9]+\/$/.test(url),
    message: 'url has a trailing slash after the video id; use the bare video address without the final /',
  },
  {
    flaw: 'trailing characters',
    test: (url) => /\/video\/[0-9]+[^0-9]/.test(url),
    message: 'url has trailing characters after the video id',
  },
];

// Runs every diagnostic, then the format, handle and id checks.
// Returns { handle, id } for a valid address; exits 1 otherwise.
function validate(url) {
  for (const check of CHECKS) {
    if (check.test(url)) {
      fail(typeof check.message === 'function' ? check.message(url) : check.message);
    }
  }
  const m = url.match(/^https:\/\/www\.tiktok\.com\/(@[A-Za-z0-9._]+)\/video\/([0-9]+)$/);
  if (!m) fail('url must be a full TikTok video address: https://www.tiktok.com/@<handle>/video/<id>');
  const [, handle, id] = m;
  if (!HANDLES.includes(handle)) fail(`unexpected TikTok handle ${handle}`);
  if (!/^[1-9][0-9]{9,18}$/.test(id)) fail('video id must be 10-19 digits, not all zeros, no leading zero');
  return { handle, id };
}

function loadUrl() {
  const botDir = process.env.MAKEFUN_BOT_DIR || '/bot';
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
  return { videoPath, url: parsed.url };
}

function main() {
  const outDir = process.env.MAKEFUN_OUTPUT_DIR || '/output';
  const { videoPath, url } = loadUrl();
  const { handle, id } = validate(url);
  mkdirSync(outDir, { recursive: true });
  copyFileSync(videoPath, join(outDir, 'VIDEO.json'));
  console.log(`ok: ${handle}/video/${id} -> ${outDir}/VIDEO.json`);
}

main();
