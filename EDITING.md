# Editing this site

Everything you'll want to change day-to-day is in plain text/YAML — you shouldn't
need to touch the HTML files at all. After editing, commit and push; GitHub Pages
rebuilds automatically in a minute or two.

## Add a blog post
1. Copy `_posts/2026-09-25-hello-world.md`.
2. Rename it `YYYY-MM-DD-your-title.md` — the date sets its position in the list.
3. Edit the `title` and `date` at the top, then write the post below the `---`.
4. Push. It shows up on `/blog.html` and at its own URL automatically.
5. To edit an existing post, just open its file in `_posts/` and change the text.
6. To delete a post, delete its file.

## Add or edit a project
Open `_data/projects.yml`. Each project is one block:
```yaml
- title: Project Name
  description: One or two sentences.
  tech: [Python, React]
  github: https://github.com/you/repo
  demo: ""              # leave "" if there's no live demo
  image: /assets/images/project-placeholder.png
```
Copy a block to add a project, edit one in place to change it, or delete a block to remove it.

## Add or edit a skill
Open `_data/skills.yml`. Add a word to an existing category's `items` list, or copy
a whole `- category:` block to add a new category.

## Add or edit work/education history
Open `_data/experience.yml`. Copy a block to add an entry (job, internship, degree),
edit one in place to change it, or reorder blocks — they display top to bottom in
the order they're listed, so put your most recent first.

## Change your name, tagline, bio, or contact links
- Name, tagline, and contact info (email/GitHub/LinkedIn) → `_config.yml`
- The "About" paragraph on your home page → `index.md`

## Change the look
Colors, spacing, and fonts are all CSS variables and rules in `assets/css/style.css` —
the `:root { ... }` block at the top has the main color palette if you just want to
reskin it.
