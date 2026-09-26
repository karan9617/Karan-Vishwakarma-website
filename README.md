# Your Portfolio Site

A lightweight Jekyll site for a software/tech portfolio: About, Projects, Skills,
Experience, and Contact pages. No external theme dependency — the layout and CSS
are in this repo, so it works out of the box on GitHub Pages.

## Edit your content

See **[EDITING.md](EDITING.md)** for a full walkthrough — adding a blog post,
adding/editing a project, skill, or experience entry, and changing your name,
bio, or contact links. Short version: everything lives in `_config.yml`,
`_data/*.yml`, `index.md`, and `_posts/` — you never need to touch the HTML.

## Preview locally (optional)

Requires Ruby installed.

```bash
gem install bundler
bundle install
bundle exec jekyll serve
```

Then open http://localhost:4000

## Deploy to GitHub Pages

1. Create a new GitHub repo. For a user site, name it `yourusername.github.io`
   (it'll be live at that exact URL). For a project site, any name works and
   it'll be live at `yourusername.github.io/repo-name`.
2. Push all these files to the repo's `main` branch.
3. In the repo, go to **Settings → Pages**, and under "Build and deployment"
   set Source to **Deploy from a branch**, branch `main`, folder `/ (root)`.
4. Wait a minute or two, then visit the URL GitHub Pages shows you.
5. If you used a project-site repo name, set `baseurl: "/repo-name"` in
   `_config.yml` so links resolve correctly.

That's it — no build step to run yourself; GitHub Pages builds Jekyll sites
automatically on every push.
