# Joachim Chuah — personal site

Personal website for Joachim Chuah: Malaysian professional squash player (PSA World Tour, career-high world #57 in Oct 2026, Malaysia No. 2) and Computer Science graduate (Trinity College, 2026) who builds software. The site's theme is "The Climb": his rise from #550 (2023) toward the top 10 and the LA 2028 Olympics.

## Files
- `index.html`: the whole site. CSS and JS are inline. No build step and no dependencies apart from Google Fonts.
- `img/`: hero.jpg (main action shot), young.jpg (Joachim as a kid diving), act2.jpg (Trinity team), asal.jpg (vs Mostafa Asal, Egyptian Open 2026).

## Direction (decided with Joachim)
- **Focus on the work, not trophies.** Two halves: "The work · on court" (training, schedule, ranking chart, media reach) and "The work · off court" (coding projects). Achievements are kept to one scrolling ticker.
- **Confident but honest.** It should feel elite, but never claim he is the world's best. Use true lines, for example "Tipped by the world No. 1 as a future top-10 player".
- **Inspired by joshwcomeau.com.** Friendly first-person voice ("Hey, I'm Joachim 👋"), sounds on hover and click, sparkles, springy hovers, a mascot, and a dark mode toggle.
- **Brand:** navy `#0A1530`, yellow `#FFC72C` (the pro squash ball's double yellow dot is the motif), court red `#D7263D`, paper `#F4F1EA`. Fonts: Bricolage Grotesque (display), Inter (body), JetBrains Mono (labels).

## Interactive pieces (all in index.html)
- **Hero squash game:** a canvas court with out line, service line and tin. Tap to hit the ball. Rally counter, best score in localStorage, confetti every 10 shots.
- **Sound engine (`Snd`):** Web Audio synthesised sounds (no audio files). Includes hover, click, hit, bounce, squeak, out, milestone and more. A toggle in the nav saves the choice to localStorage. Audio unlocks on the visitor's first click or tap.
- **Theme:** a `data-theme` attribute on `<html>` (light/dark). It defaults to the visitor's OS setting and is saved to localStorage.
- **Mascot:** an inline SVG placeholder ("mini Joachim" on a squash ball). It blinks, and when clicked it waves with rotating speech-bubble lines. It will be replaced by a commissioned 3D mascot later.
- **Climb chart:** an SVG built in JS. The ranking line draws on scroll with a ball tracing it, and dashed target lines show top 30 (2027) and top 10 (2028).
- **Tournament P&L widget:** worst/realistic/best toggle. The numbers are made up, labelled "Example numbers". Swap in real figures when available.
- **Terminal:** a typing animation in the projects section.

## Projects featured (from github.com/Joachim-Chuah)
athlete-tournament-tracker (featured), rylo, regression-classification-model (r-c-model), trading-bot (LEAP Screener), RESTful-microservice.

## Open items
- Confirm the rights to the Trinity Athletics and PSA photos before going public.
- Confirm Lawrence Chuah (sponsorship contact) is happy with his email being shown publicly.
- The hero photo caption "Chennai PSA Challenger · 2026" is inferred, so verify it.
- Joachim should review the first-person copy so it sounds like him.
- Ideas not done yet: a real mascot, a "Notes from tour" blog section, screenshots or live links for projects.
- Hosting plan: GitHub repo, then Vercel (he already uses Vercel), plus a custom domain.
