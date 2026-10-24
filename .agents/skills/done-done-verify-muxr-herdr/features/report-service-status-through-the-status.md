# Report service status through the status action

Part of the muxr-herdr verification map. Source: `README.md`.

## How to get to it (user POV)

Invoke the status action from the Herdr CLI.

## Driving it

Harness: A terminal (shell) that runs the herdr CLI and records each command's output and exit code, plus a screenshot tool for the Herdr window. Pairing needs a real phone or browser that can scan the one-use QR or open the one-time link.

1. Launch the app as SKILL.md says and wait until it is ready.
2. Herdr plugin action invoke status --plugin muxr.control; record the output and exit code.
3. Capture: save the output and exit status to $DONE_DONE_EVIDENCE_ROOT/report-service-status-through-the-status.txt, as SKILL.md's Evidence section says.
4. Stop what you started.

The drive changes no repo file: note findings in the run's report; after the drive, run done-done maintain to see what drifted, then fix the skill.
