# Pair a phone and open a live agent terminal

Part of the muxr-herdr verification map. Source: `README.md`.

## How to get to it (user POV)

Open the Setup pane from the Herdr CLI, then follow the pairing step and open the pair flow on the phone or browser.

## Driving it

Harness: A terminal (shell) that runs the herdr CLI and records each command's output and exit code, plus a screenshot tool for the Herdr window. Pairing needs a real phone or browser that can scan the one-use QR or open the one-time link.

1. Launch the app as SKILL.md says and wait until it is ready.
2. Herdr plugin pane open --plugin muxr.control --entrypoint setup; scan the one-use QR or open the one-time link on the phone; compare the two words on both screens and approve; open an agent from the phone's list; type a prompt; confirm the output appears.
3. Capture: screenshot the resulting page to $DONE_DONE_EVIDENCE_ROOT/pair-a-phone-and-open-a-live-agent-termi.png, as SKILL.md's Evidence section says.
4. Stop what you started.

The drive changes no repo file: note findings in the run's report; after the drive, run done-done maintain to see what drifted, then fix the skill.
