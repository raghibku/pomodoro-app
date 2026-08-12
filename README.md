# Pomodoro Timer

A minimal Pomodoro timer built with React 19 and Tailwind CSS v4.

**Live site:** https://raghibku.github.io/pomodoro-app/

## Features

- Work/break countdown timer with automatic cycle switching
- Configurable work and break durations
- Session counter
- Desktop notifications on session end (falls back to an audio beep if notifications aren't granted)
- Settings and session count persist across reloads via `localStorage`
- Responsive layout with mode-based theming (green for work, blue for break)

## Development

```bash
npm install
npm run dev      # start the dev server
npm run build    # production build
npm run preview  # preview the production build locally
npm run lint      # run Oxlint
```

## Deployment

The site is deployed to GitHub Pages from the `gh-pages` branch:

```bash
npm run deploy
```

This builds the app and publishes `dist/` to `gh-pages` via the `gh-pages` package.
