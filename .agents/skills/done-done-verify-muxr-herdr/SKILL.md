---
name: "done-done-verify-muxr-herdr"
description: "Drive the muxr-herdr Herdr plugin (muxr.control) driven through the herdr CLI: panes and actions in the Herdr terminal UI, plus the paired muxr phone or browser app the way a user does and capture proof it works. Use when proving a muxr-herdr change, capturing evidence, or keeping the feature map honest."
---

# done-done-verify-muxr-herdr

Written by `done-done init` through claude from this repo's own files (surface: Herdr plugin (muxr.control) driven through the herdr CLI: panes and actions in the Herdr terminal UI, plus the paired muxr phone or browser app). The drive changes no repo file: note findings in the run's report; after the drive, run done-done maintain to see what drifted, then fix the skill.

## Launch

Never install into the owner's Herdr. Use the guarded Herdr lab (`bin/fm-herdr-lab.sh`: `name`, `provision`, then every call through `run <session> ...`, teardown only through the helper) with its disposable HOME and XDG, and require `plugin list --json` to be empty first.

`herdr plugin install umeranjum17/muxr-herdr --ref v0.2.14 --yes`, with the lab override `MUXR_PLUGIN_CLI_TARBALL=<local trymuxr-cli-0.2.14.tgz> MUXR_PLUGIN_CLI_SHA256=<its sha256>`. `build.mjs` refuses a branch or bare commit, so before a public tag exists point the lab HOME's gitconfig `url.<local bare clone>.insteadOf` at a clone carrying a local-only `v0.2.14` tag.

Ready: the install prints `Installed muxr.control` and `plugin list --json` shows `muxr.control` 0.2.14, enabled, source `umeranjum17/muxr-herdr`, ref `v0.2.14`. `herdr plugin pane open --plugin muxr.control --entrypoint setup` then shows `Setup step 1 of 3`. Stop with `b` at the review step: applying setup would touch the user service manager. Tear down only through the lab helper.

## Drive

Harness: A terminal (shell) that runs the herdr CLI and records each command's output and exit code, plus a screenshot tool for the Herdr window. Pairing needs a task-owned emulator app paired to a lab host started from the installed package (`linkHerdrLab`); never a real computer's service. Drive through the repo's real handles that each feature file names:

- [Pair a phone and open a live agent terminal](features/pair-a-phone-and-open-a-live-agent-termi.md) (core journey): Open the Setup pane from the Herdr CLI, then follow the pairing step and open the pair flow on the phone or browser (`README.md`)
- [Check plugin, CLI and host versions with doctor](features/check-plugin-cli-and-host-versions-with-.md): Open the doctor pane from the Herdr CLI (`README.md`)
- [Report service status through the status action](features/report-service-status-through-the-status.md): Invoke the status action from the Herdr CLI (`README.md`)

## Core journey

[Pair a phone and open a live agent terminal](features/pair-a-phone-and-open-a-live-agent-termi.md) is the core user journey: the one thing a user cannot live without. A proof that the app works drives it end to end on the real target; a proof of another feature alone does not show the app works.

## Evidence

What to capture: Terminal transcripts with exit codes for the install, the pane opens and the action invokes. Screenshots of the Setup pane, the Herdr plugin list and the paired phone or browser showing the live agent terminal. The pairing words shown in the Setup pane must match the phone. Exercise the real user path, not internal setters; done-done's judge checks every capture in the run folder against the outcome, so save only captures of the resulting state there and keep any of earlier steps outside it; verify side effects alongside what is visible. Evidence goes to the run folder `done-done run` prints.

## Cleanup

Stop the instances this run started and remove scratch state. Evidence survives cleanup: never delete the run folder.
