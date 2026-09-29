#!/usr/bin/env node
// `herdr plugin install umeranjum17/muxr-herdr --ref vX.Y.Z` runs this in the
// fresh checkout before it registers the plugin. It never builds muxr from
// source: it downloads the published @trymuxr/cli release this checkout is
// tagged as, checks it against the sha256 pinned below, and installs it into
// the plugin root without running any package scripts.
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// sha256 of the npm tarball of @trymuxr/cli at this manifest's `version`.
// A release bumps `version` in herdr-plugin.toml, sets this, then tags vX.Y.Z.
const CLI_SHA256 = '';

const root = dirname(fileURLToPath(import.meta.url));
const fail = (message) => {
    process.stderr.write(`muxr plugin build: ${message}\n`);
    process.exit(1);
};

const major = Number(process.versions.node.split('.')[0]);
if (major < 22) fail(`Node.js 22 or newer is required; this is ${process.version}. Install it, then reinstall the plugin.`);

/**
 * Herdr checks out `--ref` detached, so the tag survives only in FETCH_HEAD
 * ("<sha>\t\ttag 'v1.2.3' of https://…"). A branch or bare commit names no
 * release, and installing an unpinned CLI would mix versions silently.
 */
function releaseTag() {
    let fetched = '';
    try { fetched = readFileSync(join(root, '.git', 'FETCH_HEAD'), 'utf8'); } catch { /* not a Herdr checkout */ }
    return /\ttag 'v(\d+\.\d+\.\d+[^']*)' of /.exec(fetched)?.[1];
}

const tag = releaseTag();
if (tag === undefined) fail('install a release: herdr plugin install umeranjum17/muxr-herdr --ref vX.Y.Z');
const pinned = /^version\s*=\s*"([^"]+)"/m.exec(readFileSync(join(root, 'herdr-plugin.toml'), 'utf8'))?.[1];
if (tag !== pinned) fail(`tag v${tag} does not match this checkout's version ${pinned}; install a release tag`);

const npm = process.env.MUXR_NPM_BIN?.trim() || 'npm';
const run = (args, options = {}) => {
    const result = spawnSync(npm, args, { stdio: ['ignore', 'inherit', 'inherit'], ...options });
    if (result.error) fail(`${npm} could not run: ${result.error.message}`);
    if (result.status !== 0) fail(`${npm} ${args[0]} failed`);
    return result;
};

// Lab only: MUXR_PLUGIN_CLI_TARBALL + MUXR_PLUGIN_CLI_SHA256 install a locally
// packed CLI instead of the published one, still checked against a sha256.
const scratch = mkdtempSync(join(tmpdir(), 'muxr-plugin-build-'));
process.on('exit', () => rmSync(scratch, { recursive: true, force: true }));
let tarball = process.env.MUXR_PLUGIN_CLI_TARBALL?.trim();
let expected = CLI_SHA256;
if (tarball) {
    expected = process.env.MUXR_PLUGIN_CLI_SHA256?.trim().toLowerCase() ?? '';
    if (!expected) fail('MUXR_PLUGIN_CLI_TARBALL needs MUXR_PLUGIN_CLI_SHA256');
} else {
    if (!expected) fail(`@trymuxr/cli ${tag} has no pinned sha256 in this checkout yet`);
    run(['pack', `@trymuxr/cli@${tag}`, '--pack-destination', scratch, '--ignore-scripts', '--silent'], { stdio: ['ignore', 'ignore', 'inherit'] });
    const packed = readdirSync(scratch).find((name) => name.endsWith('.tgz'));
    if (packed === undefined) fail(`npm pack produced no tarball for @trymuxr/cli@${tag}`);
    tarball = join(scratch, packed);
}
let actual;
try { actual = createHash('sha256').update(readFileSync(tarball)).digest('hex'); } catch (error) { fail(`cannot read ${tarball}: ${error.message}`); }
if (actual !== expected) fail(`sha256 mismatch for ${tarball}: expected ${expected}, got ${actual}`);

run(['install', '--prefix', root, '--no-save', '--no-package-lock', '--ignore-scripts', '--no-audit', '--no-fund', tarball]);

let installed;
try { installed = JSON.parse(readFileSync(join(root, 'node_modules', '@trymuxr', 'cli', 'package.json'), 'utf8')).version; } catch { /* reported below */ }
if (installed !== tag) fail(`installed @trymuxr/cli ${installed ?? 'nothing'}, expected ${tag}`);
process.stdout.write(`muxr plugin build: installed @trymuxr/cli ${tag} (sha256 verified)\n`);
