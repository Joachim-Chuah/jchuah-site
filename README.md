# jchuah-site

Personal site of Joachim Chuah: a logbook of squash results, things I’m building, and short stories behind some of them.

Plain HTML, CSS and JavaScript. No build step, no dependencies to install.

## Run it locally

The stories are loaded from files, and browsers block that when you open `index.html` directly. So run a small local server from the project folder:

```sh
cd ~/Desktop/personals/jchuah-site
python3 -m http.server 8765 --bind 127.0.0.1
```

Then open http://127.0.0.1:8765/ in your browser.

Stop the server with `Ctrl+C`.

Shortcut (start and open in one go):

```sh
cd ~/Desktop/personals/jchuah-site && { (sleep 1; open http://127.0.0.1:8765/) & python3 -m http.server 8765 --bind 127.0.0.1; }
```

If port 8765 is busy, use any other number (e.g. `8000`) in both the command and the URL.

Not seeing your changes? Press `Cmd+Shift+R` to reload without the cache.

## Project layout

```
index.html          the page (log entries live here)
assets/site.css     shared styles (light + dark)
assets/site.js      sounds, theme toggle, clocks, quote + fact of the day, rally game
posts/<name>/       one folder per story: post.md, cover.jpg, other photos and videos
img/                avatar, enlarged profile photo, favicon
```

The previous animated design lives on the `classic-design` branch.

## Add a story

1. Make a folder in `posts/`, e.g. `posts/my-story/`.
2. Add `post.md`:

   ```md
   ---
   title: The title
   date: 2026 · Somewhere
   ---
   First paragraph. A blank line starts a new one.

   ![A caption](photo.jpg)

   > A quote
   > — Who said it
   ```

3. Add `cover.jpg` (shown in the hover polaroid) and any other photos to the same folder.
4. In `index.html`, add `data-post="my-story"` to the log entry. The entry’s `<small>` text becomes its handwritten note.

Videos work the same way as photos: `![A caption](clip.mp4)`. If `clip.jpg` sits next to it, it’s used as the preview image.

## Shrink photos and videos before adding them

Phone photos are 3–8 MB. Resize to about 1400px on the long side (built into macOS):

```sh
sips -Z 1400 -s format jpeg -s formatOptions 72 IMG_1234.jpeg --out posts/my-story/photo.jpg
```

Videos: convert to 540p (also built into macOS):

```sh
avconvert --source IMG_1234.MOV --preset Preset960x540 --output posts/my-story/clip.mp4
```

## Editing the shared files

`index.html` loads `assets/site.css?v=N` and `assets/site.js?v=N`. When you change either file, bump `N` so browsers fetch the new version instead of a cached one.

## Quotes and facts

The quote of the day and the “Did you know?” fact come from the `QUOTES` and `FACTS` lists in `assets/site.js`. Add or remove lines freely.
