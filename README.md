# Second Wind

A small gaming blog built with plain HTML, CSS, and JavaScript. No frameworks,
no build step, no dependencies. Open `index.html` in a browser and it works.

## What it does

- Lists every post on the home view, newest first
- Each card shows the title, author, date, and a short excerpt
- Clicking a card opens the full article without reloading the page
- A "Back to all posts" link returns to the home view
- Each article has a bookmarkable `#post/ID` URL; reloads and browser Back/Forward keep the correct view
- Cards are native links, with keyboard focus indicators and open-in-new-tab support
- Article titles/descriptions update in the browser; social crawlers still see the static page shell
- Shows a friendly message if there are no posts

## Running it

Open `index.html` directly in any modern browser. That is the whole setup.

If you prefer a local server:

```bash
python -m http.server 8000
```

Then visit http://localhost:8000.

Run `node --test` for navigation regression checks (Node 20+). These also run on pull requests. Unknown article URLs display a clear recovery link without silently showing a different article.

## Files

```
index.html   page shell and masthead
styles.css   the editorial dark theme
posts.js     the six blog posts
script.js    list view, article view, and navigation
```

## Editing posts

All content lives in `posts.js` as an array of objects. Each post has an `id`,
`title`, `author`, `date` (in YYYY-MM-DD form), `excerpt`, and a `body` array
where each string is one paragraph. Add or remove entries and the home view
updates on the next load.

## Deploying to GitHub Pages

The site is static, so GitHub Pages can serve it straight from the repository
root. In the repo, open **Settings → Pages** and set the source to the `main`
branch with the `/ (root)` folder.
