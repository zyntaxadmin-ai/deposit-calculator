# Security Deposit Return Deadline + Penalty Calculator

Static site: plain HTML, CSS, and vanilla JS. No build step.

## Deploy on Vercel
Import the GitHub repo, set **Framework Preset: Other**, leave build command and output directory empty.

## Update state rules
Edit `data/states.js`. Each row is documented at the top of the file. Set `verify` to `1` to show a "Please verify this rule" tag.

## Cache note
`/css`, `/js`, `/data` are cached as immutable. After editing them, bump the `?v=1` query string in `index.html`.

## Disclaimer
General information and estimates only, not legal advice. Verify rules against official statutes.
