#!/usr/bin/env bash
# Drives the real plugin install and setup overlay in a guarded, disposable Herdr lab and writes the
# transcripts into $DONE_DONE_EVIDENCE_ROOT. Needs MUXR_LAB_TARBALL (a local trymuxr-cli-<version>.tgz).
# Never touches the default Herdr session or the owner's HOME: every call goes through the lab helper.
set -u
helper=${HERDR_LAB_HELPER:?point HERDR_LAB_HELPER at the guarded Herdr lab helper}
out=${DONE_DONE_EVIDENCE_ROOT:?DONE_DONE_EVIDENCE_ROOT is set by done-done run}
tarball=${MUXR_LAB_TARBALL:?point MUXR_LAB_TARBALL at the local CLI tarball}
repo=$(git rev-parse --show-toplevel)
version=$(sed -n 's/^version = "\(.*\)"$/\1/p' "$repo/herdr-plugin.toml")
sha=$(sha256sum "$tarball" | cut -d' ' -f1)
scratch=$(mktemp -d "${HOME}/.cache/fms/mxlab.XXXXXX")
session=$("$helper" name mxlab)
cleanup() { "$helper" teardown "$session" >/dev/null 2>&1; rm -rf -- "$scratch"; }
trap cleanup EXIT
lab() { "$helper" run "$session" "$@"; }
"$helper" provision "$session" >/dev/null || exit 1
# The overlay needs a foreground client; /usr/bin first keeps the viewer launcher off version-manager shims.
PATH=/usr/bin:$PATH "$helper" viewer start "$session" >/dev/null || exit 1
lab plugin list --json | tee "$out/registry-before.json"
git clone -q --bare "$repo" "$scratch/mirror" && git -C "$scratch/mirror" tag "v$version" HEAD
labhome=$(cat "${FM_HERDR_LAB_STATE_DIR:-${TMPDIR:-/tmp}/fm-herdr-lab-$UID}/$session.xdg-root")/home
printf '[url "%s"]\n\tinsteadOf = https://github.com/umeranjum17/muxr-herdr\n[url "%s"]\n\tinsteadOf = https://github.com/umeranjum17/muxr-herdr.git\n' "$scratch/mirror" "$scratch/mirror" > "$labhome/.gitconfig"
MUXR_PLUGIN_CLI_TARBALL=$tarball MUXR_PLUGIN_CLI_SHA256=$sha lab plugin install umeranjum17/muxr-herdr --ref "v$version" --yes > "$out/install.txt" 2>&1 || { cat "$out/install.txt"; exit 1; }
lab plugin list --json > "$out/plugin-list.json"
lab workspace create --label lab --no-focus >/dev/null
pane=$(lab plugin pane open --plugin muxr.control --entrypoint setup | jq -r '.result.plugin_pane.pane.pane_id')
lab pane wait-output "$pane" --match 'Choose 1-2' --timeout 30000 >/dev/null 2>&1 || sleep 8
lab pane read "$pane" --source visible > "$out/setup-overlay-step1.txt"
lab pane send-text "$pane" 2; lab pane send-keys "$pane" Enter; sleep 3
lab pane read "$pane" --source visible > "$out/setup-overlay-other-ways.txt"
lab pane read "$pane" --source visible --format ansi | sed 's/100\.[0-9]*\.[0-9]*\.[0-9]*/<tailnet-ip>/g' > "$scratch/other-ways.ansi"
node "$(dirname "$0")/ansi2svg.mjs" "$scratch/other-ways.ansi" "$scratch/other-ways.svg" && rsvg-convert "$scratch/other-ways.svg" -o "$out/setup-overlay-other-ways.png"
lab pane send-text "$pane" b; lab pane send-keys "$pane" Enter; sleep 2
lab pane send-text "$pane" b; lab pane send-keys "$pane" Enter; sleep 3
lab pane read "$pane" --source visible > "$out/setup-overlay-cancelled.txt"
sed -i 's/100\.[0-9]*\.[0-9]*\.[0-9]*/<tailnet-ip>/g' "$out"/setup-overlay-*.txt
jq -r '.result.plugins[] | "\(.plugin_id) \(.version) enabled=\(.enabled) \(.source.owner)/\(.source.repo)@\(.source.requested_ref)"' "$out/plugin-list.json" > "$out/plugin-summary.txt"
cat "$out/plugin-summary.txt"
jq -n --arg v "$version" '{target: {version: $v}, start: "a clean disposable Herdr 0.9.1 lab with an empty plugin registry",
  steps: ["install muxr.control from the mirror at the release tag with the pinned CLI tarball", "read the plugin list", "open the real setup overlay, choose Other ways, and cancel without applying"],
  result: "the plugin list shows muxr.control enabled from the mirror at the release tag, and the setup overlay lists the connection routes and cancels with Nothing changed"}' > "$out/steps.json"
