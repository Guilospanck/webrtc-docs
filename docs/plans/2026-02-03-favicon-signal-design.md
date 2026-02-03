# Signal Waves Favicon Design

**Goal:** Replace the default Astro favicon with a WebRTC signal‑waves icon in the accent blue (`#7aa2f7`), matching the dark theme.

## Design
- Simple dot + three arcs to suggest wireless signal.
- Accent color `#7aa2f7` on transparent background.
- Provide both `public/favicon.svg` and `public/favicon.ico`.

## Implementation
- Update `public/favicon.svg` with the new icon.
- Regenerate `public/favicon.ico` from the SVG using ImageMagick `convert`.
