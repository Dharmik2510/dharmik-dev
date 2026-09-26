# motion-primitives (ported)

Components adapted from [motion-primitives](https://motion-primitives.com/) by ibelick (MIT).
Ported to plain JSX + `framer-motion` (the project already uses it) and plain CSS
(`primitives.css`) instead of Tailwind, so no new dependencies are needed.

- `TextEffect`      – per-char / per-word staggered reveals (chapter titles, body copy)
- `TextScramble`    – departure-board scramble (city names, route codes)
- `SlidingNumber`   – odometer digits (km flown, local clock)
- `TextShimmer`     – shimmering hint text ("scroll to board")
- `ProgressiveBlur` – layered backdrop blur (film edges)
- `InView`          – reveal-on-enter wrapper
