# mershonart.com

The source for Taylor Mershon's portfolio site. It's plain HTML/CSS/JS with no build step, so GitHub Pages serves this folder as-is.

To preview it on your computer, double-click `index.html`.

## Where things live

| To change… | Edit this file |
|---|---|
| Background, text colors, accent, fonts, corner rounding, spacing | `assets/theme.css` |
| Your name, tagline, intro, bio, experience, links, email, résumé | `content/site.js` |
| Section names, tile colors, section descriptions | `content/site.js` → `categories` |
| Section graphics (pen nib, shapes, magazine, book) | `assets/icons/*.svg`: replace a file with your own SVG or PNG, then update its path in `content/site.js` |
| Which pieces appear, their order, titles, captions, home-page picks | `content/works.js` |
| The images themselves | `images/full/` (large) and `images/thumb/` (grid), same file name in both |

### A background image or texture
In `assets/theme.css`, set `--bg-image: url("../images/backgrounds/your-file.jpg");`

### Taking a piece down
Delete its line in `content/works.js`.

### Featuring a piece on the home page
Add `"featured": true` to its line in `content/works.js`.

## Adding new work (e.g. from the iPad)

1. Export from Procreate (PNG or JPG) into the Dropbox folder **`website/new work`**.
2. Ask Claude: "add the new work to my site". It picks the strongest pieces, makes web-sized images, adds them to `content/works.js`, and publishes.

To do it by hand: make a 2000px-wide JPG in `images/full/` and a 900px-wide copy with the same name in `images/thumb/`, then add a line to `content/works.js` like this:

```js
{"id": "new-piece", "category": "illustration", "title": "Title", "meta": "Medium · client", "images": ["new-piece-1"], "ratio": 0.8},
```

`category` is one of `illustration`, `design`, `editorial`, `books`. `ratio` is width ÷ height.

`tools/build_images.py` regenerates all images from the originals listed in `tools/image-jobs.json`.

## Domain
`CNAME` points the site at **www.mershonart.com**. DNS setup is in the GitHub Pages docs: an apex domain gets A records, `www` gets a CNAME to `<username>.github.io`.
