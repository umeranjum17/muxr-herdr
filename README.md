<h1 align="center">
  <a href="https://trymuxr.com"><img src="docs/assets/icon.png" width="72" alt="muxr" valign="middle" /></a> muxr for Herdr
</h1>

<p align="center">
  <a href="https://herdr.dev/plugins/"><img alt="Herdr plugin" src="https://img.shields.io/badge/herdr-plugin-111?style=flat" /></a>
  <a href="https://www.npmjs.com/package/@trymuxr/cli"><img alt="npm 0.3.0" src="https://img.shields.io/badge/npm-0.3.0-CB3837?style=flat&logo=npm&logoColor=white" /></a>
  <a href="https://github.com/umeranjum17/muxr-herdr/actions/workflows/ci.yml"><img alt="CI" src="https://img.shields.io/github/actions/workflow/status/umeranjum17/muxr-herdr/ci.yml?style=flat&branch=main" /></a>
  <a href="LICENSE"><img alt="Apache 2.0" src="https://img.shields.io/badge/license-Apache--2.0-666?style=flat" /></a>
</p>

<p align="center">
  <strong>Every agent. The real terminal. In your pocket.</strong><br/>
  This plugin installs <a href="https://github.com/umeranjum17/muxr">muxr</a> from inside Herdr. One command gets you setup, pairing and service control as Herdr actions and panes; your phone then sees every agent Herdr runs, opens its exact live terminal, and prompts it like you're at the desk.
</p>

<p align="center">
  <picture>
    <source srcset="docs/assets/hero-night.webp" media="(prefers-color-scheme: dark)" />
    <img src="docs/assets/hero-day.webp" alt="An agent running on the desktop and the same live workspace on the phone: the agent waiting for approval, its Little shop workspace, and its live terminal with the tab row and prompt box" width="880" />
  </picture>
</p>

<p align="center">
  <sub>An agent on the desktop, and the same live workspace in your pocket — one session, the same terminal.</sub>
</p>

## Why muxr in Herdr

Herdr runs the agents; muxr puts them in your pocket. Start a run on the desktop, then step away and keep prompting the same live terminal from your phone — same session, same keys, same output.

- **Every agent, one screen.** Your phone lists every agent Herdr runs, grouped by the workspace it lives in.
- **The real terminal.** Open any agent and type into its actual TTY — the tab row, key row and prompt box are the ones you already use.
- **Nothing exposed publicly.** Pairing is a one-use QR (or a one-time link) with a two-word check; the recommended route serves over your tailnet, not the open internet.

## Install

Three steps on Linux or macOS. You need [Herdr](https://herdr.dev) 0.9.1 or newer and [Node.js 22 or newer](https://nodejs.org/).

**1. Install the plugin into Herdr**

```bash
herdr plugin install umeranjum17/muxr-herdr --ref v0.3.0
```

**2. Open the Setup pane**

```bash
herdr plugin pane open --plugin muxr.control --entrypoint setup
```

<p align="center">
  <picture>
    <source srcset="docs/assets/hero-plugin-night.webp" media="(prefers-color-scheme: dark)" />
    <img src="docs/assets/hero-plugin-day.webp" alt="The muxr Setup pane running inside Herdr: the muxr wordmark, 'Setup step 2 of 5', and the recommended phone-connection route" width="760" />
  </picture>
</p>

It detects the machine, walks you through how your phone should reach it (Tailscale Serve is the recommended route), and starts the muxr service. Nothing changes until you choose **Apply setup**.

**3. Pair your phone**

Scan the one-use QR with the muxr app, or open the one-time link in a browser, then check that both screens show the same two words before you approve. The pairing card is the first shot under **On the phone** below.

```text
“Browser” wants to pair with this computer.

  Compare these words on the phone:  diamond cliff

Only approve if the words match. Approve this device? (y/N) y
  ✓ paired and verified Browser

  ok    muxr versions      CLI 0.3.0 · host 0.3.0
        Herdr plugin 0.3.0 (umeranjum17/muxr-herdr@v0.3.0)
```

Get the app from [trymuxr.com/downloads](https://trymuxr.com/downloads) (Android APK, Google Play testing, iOS TestFlight), or pair a browser for eight hours. Pair more devices later from the **Pair muxr** pane.

### Why a release tag

| Release | Installs | CLI tarball sha256 |
|---|---|---|
| [`v0.3.0`](https://github.com/umeranjum17/muxr-herdr/releases) | [`@trymuxr/cli` 0.3.0](https://www.npmjs.com/package/@trymuxr/cli) | pinned at release |

Always install a release tag. Each tag is one muxr release: the install downloads `@trymuxr/cli` at exactly that version, checks it against the sha256 pinned in [build.mjs](build.mjs), and installs it into the plugin folder with install scripts turned off. Nothing is built from source, and a branch or bare commit is refused. Every release is listed on [the releases page](https://github.com/umeranjum17/muxr-herdr/releases); install the newest tag with `--ref`.

## On the phone

Once paired, your phone is the same workspace. Four captures from a demo machine, in order:

<p align="center">
  <img src="docs/assets/phone-pair.webp" alt="01 Pair once — the phone showing the two words diamond cliff to compare with the computer" width="380" />
  <img src="docs/assets/phone-terminal.webp" alt="02 Check the real run — an agent's live terminal on the phone, with the tab row, key row and prompt box" width="380" />
</p>
<p align="center">
  <img src="docs/assets/phone-agent.webp" alt="03 Pick up the thread — prompting the agent from the phone like you're at the desk" width="380" />
  <img src="docs/assets/phone-files.webp" alt="04 Look at the code — reading the code an agent is working on, from the phone" width="380" />
</p>

## What you get in Herdr

The plugin installs as `muxr.control`:

<p align="center">
  <picture>
    <source srcset="docs/assets/plugin-list-night.webp" media="(prefers-color-scheme: dark)" />
    <img src="docs/assets/plugin-list-day.webp" alt="herdr plugin list showing muxr.control enabled from github:umeranjum17/muxr-herdr@v0.3.0" width="760" />
  </picture>
</p>

| | |
|---|---|
| **Panes** | setup, pair, devices, doctor, service, self-host relay, logs, uninstall, screen-sharing approval |
| **Actions** | start, stop, restart, status, sync agent integrations, update, put `muxr` on PATH, split right, split down, uninstall, screen-sharing approval |

Run an action with `herdr plugin action invoke <action> --plugin muxr.control`, or open a pane with `herdr plugin pane open --plugin muxr.control --entrypoint <pane>`. The **Put muxr on PATH** action links `muxr` into `~/.local/bin`, so your shell and your agents can run `muxr name` and `muxr share`.

## How it works

The plugin is a launcher. Each action and pane runs one bounded `muxr` command and exits. The relay and host run under your user service manager (`muxr.service` on Linux, launchd on macOS) through `muxr up`, so they keep serving your phone while Herdr restarts and after you log in again.

Herdr runs plugin commands with its server's environment, not your shell's, so the plugin finds your muxr home from the installed service definition. `muxr doctor` shows whether the plugin, the CLI and the running host are the same release.

## Update and uninstall

- **Update:** run the **Update muxr** action. It reinstalls this plugin at the new release tag, which brings the matching CLI with it, and restarts the service. If the service does not come back, it rolls back to the previous tag.
- **Uninstall** has three layers, in this order:
  1. The **Uninstall muxr** pane runs `muxr uninstall`, which removes the service, ingress, pairings and state. It asks before removing anything.
  2. `herdr plugin uninstall muxr.control` removes the plugin. The pane offers to do this for you.
  3. Herdr keeps each plugin's config and state folders. Remove them yourself if you want them gone; `herdr plugin config-dir muxr.control` prints where the config lives.

## Already use muxr from npm?

Both install the same plugin id, `muxr.control`, and a machine has one of them. Setup from npm links Herdr to the copy inside the npm package. Herdr refuses to install over a linked copy, so to switch, unlink it first:

```bash
herdr plugin unlink muxr.control
herdr plugin install umeranjum17/muxr-herdr --ref v0.3.0
```

The npm install ([`@trymuxr/cli`](https://www.npmjs.com/package/@trymuxr/cli)) stays the way to run muxr without Herdr's plugin system, on a VPS relay, or in Docker. See the [muxr README](https://github.com/umeranjum17/muxr#install).

## Releasing

A muxr release that should reach Herdr needs a matching tag here:

1. Set `version` in [herdr-plugin.toml](herdr-plugin.toml) to the published `@trymuxr/cli` version, and copy any changed actions and panes from muxr's `resources/control/herdr-plugin.toml`, pointing them at `./node_modules/@trymuxr/cli/resources/control/run.mjs`.
2. Set `CLI_SHA256` in [build.mjs](build.mjs) to the sha256 of that version's npm tarball: `npm pack @trymuxr/cli@X.Y.Z && sha256sum trymuxr-cli-X.Y.Z.tgz`. Put the same version and sha256 in the release table under **Install**.
3. Merge, then tag the merge commit `vX.Y.Z`. The **Update muxr** action installs the tag named after the npm version, so every published version needs its tag.

`node --test build.test.mjs` checks the build without a network or a real release. To try an unreleased CLI in a lab, point the build at a locally packed tarball, which is still checked against a sha256 you supply:

```bash
MUXR_PLUGIN_CLI_TARBALL=/path/trymuxr-cli-X.Y.Z.tgz MUXR_PLUGIN_CLI_SHA256=<sha256> \
  herdr plugin install umeranjum17/muxr-herdr --ref vX.Y.Z
```

## License

Apache License 2.0, like muxr itself. See [LICENSE](LICENSE). The muxr name and marks are covered by muxr's [TRADEMARK.md](https://github.com/umeranjum17/muxr/blob/main/TRADEMARK.md).
