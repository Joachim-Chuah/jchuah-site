# Joachim Chuah — personal site

Personal website for Joachim Chuah: Malaysian professional squash player (PSA World Tour, career-high world #57 in Oct 2026, Malaysia No. 2) and Computer Science graduate (Trinity College, 2026) who builds software. Subtitle: "Athlete & engineer".

The site is a **logbook**: a minimal, single-column, dated log of squash results and code projects, newest first, with short stories (blog posts) behind some entries.

## Files
- `index.html`: the page. Header, intro, "What I’m chefing" card, the log, On the road, contact. Page-specific CSS and JS (margin notes, polaroids, reading panel, Markdown reader) are inline.
- `assets/site.css`: shared tokens (light + dark), section labels, quote card, rally game, toggles.
- `index.html` loads them as `assets/site.css?v=N` / `assets/site.js?v=N`: **bump N whenever either file changes**, or browsers keep serving the old cached copy.
- `assets/site.js`: sound engine, theme + sound toggles, clocks, quote of the day (`QUOTES`), fact of the day (`FACTS`), the mini rally game.
- `posts/<slug>/post.md` + `cover.jpg` (+ any photos): one folder per story.
- `img/`: avatar, favicon, apple-touch icon.
- The previous, more animated "The Climb" design (hero squash game, ranking chart, mascot) and the other mockups live on the `classic-design` branch.

## How things work
- **Log entries** are `.entry` rows with `data-k` = `court` | `code`. Text inside `<small>` becomes a handwritten margin note (Kalam font, blue "ink") with a hand-drawn arrow on hover; on narrow screens it shows under the title.
- **Posts:** an entry with `data-post="<slug>"` gets a hover polaroid (its `cover.jpg` + the note) and opens `posts/<slug>/post.md` in a right-side reading panel; URL `#/<slug>` links straight to it. `post.md` has front matter (`title`, `date`), then simple Markdown: paragraphs, `#` headings, `>` quotes, `-` lists, `![caption](photo.jpg)` on its own line, `**bold**`, `_italic_`, `[links](url)`, `` `code` ``. Image paths are relative to the post folder.
- Posts are fetched, so **previewing needs a local server** (`python3 -m http.server 8765` in this folder, then http://127.0.0.1:8765/). Opening the file directly can't load posts.
- **Sounds** (Web Audio, no files): click = "Pop" (press + release), hover tick only on the All/Court/Code pills, "single bloop" when a margin note appears. Mute toggle saved in localStorage (`jc-sound`). Audio starts after the visitor's first click.
- **Theme:** `data-theme` on `<html>`, set before paint from localStorage (`jc-theme`) or the OS. Toggle in the header.
- **"What I’m chefing" card** (replaced the quote-of-the-day card, Nov 2026): "On the stove" (now) and "On the menu" (next), items tagged `.tag code` or `.tag food` (Joachim cooks real food too). Edit the `<figure class="chef">` markup directly and update the month label. Only list things Joachim has named; use TBD otherwise. The old QUOTES/FACTS code in site.js is unused now (no-ops without `.qotd`).

## Direction (decided with Joachim)
- Minimal and calm. Modest tone: let facts speak, avoid a highlight-reel feel (a chapter-style "story" version was rejected as too self-centred).
- Joachim writes the personal stories and margin notes himself; don't invent feelings or anecdotes for him. Facts come from his partnership deck (keep pricing and phone numbers off the site).
- Brand: lime `#C6F432` (highlights), ball-dot yellow `#F5C518`, blue ink for handwriting, Inter (body), Bricolage Grotesque (display), JetBrains Mono (labels), Kalam (handwriting).
- Favicon: 3D toy figure of Joachim (from toy_me_front.png, Nov 2026); replaced the earlier illustration by his sister. Favicon = head only, background removed (transparent); apple-touch-icon keeps the grey backdrop (iOS fills transparency with black). Favicon links carry ?v=N: bump it when the icon changes, since browsers cache favicons hard.
- Contact email on the site: jchuah.han@gmail.com.

## Open items
- Link-preview (Open Graph) tags and a share image.
- Joachim to write the posts in `posts/` (each has ✏️ prompts) and add photos (resize large phone photos first).
- Hosting plan: Vercel from this repo (private for now), then a custom domain.
