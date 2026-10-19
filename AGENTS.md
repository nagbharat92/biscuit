# Biscuit

## Product

Biscuit, a pixel art tool for our games. Grow one useful feature at a time.
The current scope is one page for selecting character color depth. Generation,
reference uploads, animation, project management and provider calls are not built.
Do not imply that unavailable features work.

## Interface

- All UI is 1-bit: black and white only, regardless of the selected character bit depth.
- Do not add gray, colored accents, gradients, translucent effects or shadows.
- Artwork previews may use their selected palettes; this does not change the monochrome UI.
- Use the locally bundled Silkscreen pixel font everywhere. Keep its OFL license.
- Minimize copy. Prefer visual examples and short labels to explanatory paragraphs.
- Show bit-depth choices as side-by-side visual cards, wrapping on small screens.
- Keep screens simple, readable and friendly. Use clear language and native controls.
- Character palette settings affect artwork, never the interface theme.
- Keep keyboard navigation, visible focus and responsive layouts working.
- Inspect actual browser rendering and interactions before handing off UI changes.

## Artwork terminology

Color-depth choices are 1-bit (2 palette entries), 2-bit (4), 4-bit (16) and
8-bit (256). These are palette budgets, not complete art styles or PNG encoding
requirements. Future strict indexed exports must explicitly account for transparency.
The four current illustrations show the same original sample character processed
into different palettes. They are not AI generations or complete art-style presets.

## Development

This first screen uses plain HTML, CSS and JavaScript with no dependencies.
Run `npm run dev`, then open http://127.0.0.1:4317.
The development server requires Python 3 and is bound to loopback only.

Keep secrets in environment variables and out of browser code, logs and exports.
Do not add frameworks or extra screens without a concrete need.

## Publishing

Repository: https://github.com/nagbharat92/biscuit
Site: https://nagbharat92.github.io/biscuit/
GitHub Pages serves the root of `main` directly. No build step is required.
Keep asset URLs relative so they work under the `/biscuit/` path.
