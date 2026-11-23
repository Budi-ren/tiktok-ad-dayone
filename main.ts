// tiktok-ad-dayone — main.ts
// Entry program for the make.fun bounty "Day one, day seven"
// (post-tiktok-day-one-day-seven-20261123-0327).
// Reads VIDEO.json out of the repository, checks that it names a real
// public TikTok video, and copies the file to /output. It does nothing
// else. Node 22, standard library only.
import { copyFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

// The three TikTok accounts this entry may name. Anything else is a
// different account's video and is refused.
const HANDLES = ['@Approximatelly6', '@approximatelly888', '@approximatelly'];

const ID_MIN_LEN = 10;
const ID_MAX_LEN = 19;

function fail(message) {
  console.error(`error: ${message}`);
  process.exit(1);
}

function schemeOf(address) {
  const at = address.indexOf('://');
  return at === -1 ? '' : address.slice(0, at);
}

function hostOf(address) {
  const rest = address.slice(address.indexOf('://') + 3);
  const slash = rest.indexOf('/');
  return slash === -1 ? rest : rest.slice(0, slash);
}

// First pass: everything about the address as a whole — scheme, host,
// and the shape of the path after the id. Each problem gets its own
// message so a bad URL explains itself instead of failing generically.
// Runs before the handle and id are even looked at.
function checkShape(url) {
  if (url.trim() === '') {
    fail('url is empty; VIDEO.json must name a TikTok video address');
  }
  if (!url.includes('://')) {
    fail('url must be an absolute address starting with https://');
  }
  const scheme = schemeOf(url);
  if (scheme.toLowerCase() !== 'https') {
    fail(`url must use https, not ${scheme}`);
  }
  if (scheme !== 'https') {
    fail('url scheme must be lowercase https, not HTTPS');
  }
  if (/^https:\/\/(vt|vm)\.tiktok\.com\//.test(url)) {
    fail('url is a short TikTok link on vt.tiktok.com; use the full video address instead');
  }
  if (/^https:\/\/www\.tiktok\.com\/t\//.test(url)) {
    fail('url is a short TikTok link on tiktok.com/t/; use the full video address instead');
  }
  const host = hostOf(url);
  if (host !== 'www.tiktok.com') {
    fail(`url must be on www.tiktok.com, not ${host}; use the full video address on www.tiktok.com`);
  }
  if (url.includes('/photo/')) {
    fail('url names a TikTok photo post, not a video');
  }
  if (!url.includes('/video/')) {
    fail('url does not name a TikTok video; it must be a video address, not a profile or other page');
  }
  if (/\/video\/[0-9]+\?/.test(url)) {
    fail('url has a query string after the video id; use the bare video address without the ?... part');
  }
  if (/\/video\/[0-9]+#/.test(url)) {
    fail('url has a fragment after the video id; use the bare video address without the #... part');
  }
  if (/\/video\/[0-9]+\/$/.test(url)) {
    fail('url has a trailing slash after the video id; use the bare video address without the final /');
  }
  if (/\/video\/[0-9]+[^0-9]/.test(url)) {
    fail('url has trailing characters after the video id; use the bare video address');
  }
}

// Second pass: the handle must be one of ours.
function checkHandle(handle) {
  if (!HANDLES.includes(handle)) {
    fail(`unexpected TikTok handle ${handle}; expected one of ${HANDLES.join(', ')}`);
  }
}

// Third pass: the id, checked piece by piece so each flaw is named.
// All-zeros is tested before the leading zero, or it could never fire:
// an all-zero id starts with zero too.
function checkId(id) {
  if (id.length < ID_MIN_LEN || id.length > ID_MAX_LEN) {
    fail(`video id must be ${ID_MIN_LEN}-${ID_MAX_LEN} digits long; got ${id.length}`);
  }
  if (/^0+$/.test(id)) {
    fail('video id must not be all zeros (that is the placeholder, not a video)');
  }
  if (id.startsWith('0')) {
    fail('video id must not start with 0');
  }
}

// Runs the three passes in order and returns { handle, id }.
// Exits 1 with a specific diagnosis on the first problem found.
function validate(url) {
  checkShape(url);
  const m = url.match(/^https:\/\/www\.tiktok\.com\/(@[A-Za-z0-9._]+)\/video\/([0-9]+)$/);
  if (!m) {
    fail('url must be a full TikTok video address: https://www.tiktok.com/@<handle>/video/<id>');
  }
  const [, handle, id] = m;
  checkHandle(handle);
  checkId(id);
  return { handle, id };
}

// Reads VIDEO.json from the bot directory and returns its url.
// Fails loudly on a missing file, bad JSON, or a wrong shape.
function loadUrl() {
  const botDir = process.env.MAKEFUN_BOT_DIR || '/bot';
  const videoPath = join(botDir, 'VIDEO.json');
  if (!existsSync(videoPath)) {
    fail(`VIDEO.json not found at ${videoPath}`);
  }
  let parsed;
  try {
    parsed = JSON.parse(readFileSync(videoPath, 'utf8'));
  } catch (err) {
    fail(`VIDEO.json is not valid JSON (${err.message})`);
  }
  if (!parsed || typeof parsed.url !== 'string') {
    fail('VIDEO.json must be an object with a string field "url"');
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
