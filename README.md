# peterwford.com

Pete Ford's portfolio. Plain HTML and CSS, hosted on GitHub Pages. There's no build step: what's in this repo is what gets served.

## Structure

- `index.html` is the homepage.
- `add-to-event-organiser-dashboard.html`, `add-to-event-forms.html`, `asos-printerless-returns.html` and `asos-refer-a-friend.html` are the case studies. GitHub Pages serves them without the `.html`, so the old Webflow URLs keep working.
- `404.html` is the not-found page.
- `styles.css` holds every style. Colours, fonts and spacing are tokens at the top.
- `script.js` handles the dark mode toggle, the Copy email button and reduced-motion handling for videos.
- `assets/img/<project>/` holds images. Each has a full-size `.webp` (max 2000px wide) and a `-1000.webp` version for smaller screens.
- `assets/video/` holds `.mp4` videos and their `.webp` poster frames.
- `assets/docs/` holds PDFs linked from the case studies.
- `assets/og/` holds the social share images (1200×630).

## Editing

Edit the HTML directly. A change pushed to `main` goes live on GitHub Pages within a minute or two.
