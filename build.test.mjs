// node --test: drives build.mjs in a throwaway plugin checkout with a fake
// @trymuxr/cli tarball, so it needs no network and no real release.
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const version = /^version\s*=\s*"([^"]+)"/m.exec(readFileSync(join(here, 'herdr-plugin.toml'), 'utf8'))[1];

function fakeCli(cliVersion) {
    const dir = mkdtempSync(join(tmpdir(), 'muxr-fake-cli-'));
    writeFileSync(join(dir, 'package.json'), JSON.stringify({ name: '@trymuxr/cli', version: cliVersion }));
    const out = mkdtempSync(join(tmpdir(), 'muxr-fake-tgz-'));
    const packed = spawnSync('npm', ['pack', dir, '--pack-destination', out, '--silent'], { encoding: 'utf8' });
    assert.equal(packed.status, 0, packed.stderr);
    const tarball = join(out, readdirSync(out)[0]);
    return { tarball, sha256: createHash('sha256').update(readFileSync(tarball)).digest('hex') };
}

function build({ tag, env = {} }) {
    const root = mkdtempSync(join(tmpdir(), 'muxr-plugin-'));
    for (const file of ['build.mjs', 'herdr-plugin.toml']) copyFileSync(join(here, file), join(root, file));
    if (tag !== undefined) {
        mkdirSync(join(root, '.git'));
        writeFileSync(join(root, '.git', 'FETCH_HEAD'), `0123abcd\t\t${tag} of https://github.com/umeranjum17/muxr-herdr\n`);
    }
    const clean = Object.fromEntries(Object.entries(process.env).filter(([key]) => !key.startsWith('MUXR_PLUGIN_CLI_')));
    const result = spawnSync(process.execPath, [join(root, 'build.mjs')], { encoding: 'utf8', env: { ...clean, ...env } });
    return { root, status: result.status, output: result.stdout + result.stderr };
}

const good = fakeCli(version);
const lab = (sha256 = good.sha256, tarball = good.tarball) => ({ MUXR_PLUGIN_CLI_TARBALL: tarball, MUXR_PLUGIN_CLI_SHA256: sha256 });

test('refuses a checkout that is not a release tag', () => {
    for (const tag of [undefined, "branch 'main'"]) {
        const run = build({ tag, env: lab() });
        assert.equal(run.status, 1);
        assert.match(run.output, /install a release: herdr plugin install umeranjum17\/muxr-herdr --ref vX\.Y\.Z/);
    }
});

test('refuses a tag that differs from the manifest version', () => {
    const run = build({ tag: "tag 'v0.0.1' of", env: lab() });
    assert.equal(run.status, 1);
    assert.match(run.output, new RegExp(`tag v0\\.0\\.1 does not match this checkout's version ${version}`));
});

test('installs the verified tarball into the plugin root', () => {
    const run = build({ tag: `tag 'v${version}' of`, env: lab() });
    assert.equal(run.status, 0, run.output);
    assert.match(run.output, new RegExp(`installed @trymuxr/cli ${version} \\(sha256 verified\\)`));
    const installed = JSON.parse(readFileSync(join(run.root, 'node_modules', '@trymuxr', 'cli', 'package.json'), 'utf8'));
    assert.equal(installed.version, version);
    assert.equal(existsSync(join(run.root, 'package.json')), false, 'the build must not write a package.json into the checkout');
});

test('refuses a tarball whose sha256 differs', () => {
    const run = build({ tag: `tag 'v${version}' of`, env: lab('0'.repeat(64)) });
    assert.equal(run.status, 1);
    assert.match(run.output, /sha256 mismatch/);
    assert.equal(existsSync(join(run.root, 'node_modules')), false);
});

test('refuses a lab tarball without its sha256', () => {
    const run = build({ tag: `tag 'v${version}' of`, env: { MUXR_PLUGIN_CLI_TARBALL: good.tarball } });
    assert.equal(run.status, 1);
    assert.match(run.output, /MUXR_PLUGIN_CLI_TARBALL needs MUXR_PLUGIN_CLI_SHA256/);
});

test('refuses a tarball of another CLI version', () => {
    const other = fakeCli('0.0.1');
    const run = build({ tag: `tag 'v${version}' of`, env: lab(other.sha256, other.tarball) });
    assert.equal(run.status, 1);
    assert.match(run.output, new RegExp(`installed @trymuxr/cli 0\\.0\\.1, expected ${version}`));
});
