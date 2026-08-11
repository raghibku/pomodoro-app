# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start the Vite dev server (default http://localhost:5173)
- `npm run build` — production build
- `npm run preview` — serve the production build locally
- `npm run lint` — run Oxlint

There is no test suite configured yet.

## Architecture

This is a Vite + React 19 app, currently a minimal scaffold (Pomodoro timer app, features not yet built). Entry point is `src/main.jsx`, which mounts `src/App.jsx` into `#root` in `index.html`.

**Styling: Tailwind CSS v4.** This project uses the v4 Vite-plugin integration (`@tailwindcss/vite`), not the older PostCSS/config-file setup — there is no `tailwind.config.js` or `postcss.config.js`. Tailwind is enabled via the plugin in `vite.config.js` and a single `@import "tailwindcss";` in `src/index.css`. Use utility classes directly in JSX; don't add a Tailwind config file unless a feature genuinely requires theme customization (v4 supports `@theme` blocks in CSS for that instead).

**Linting:** Oxlint (`.oxlintrc.json`) with the `react` and `oxc` plugins. `react/rules-of-hooks` is set to `error`.
