# Deploying this static site to Netlify

This project is a static site (HTML/CSS/JS) and can be deployed directly to Netlify.

Recommended steps (CLI):

1. Install Netlify CLI (if not already installed):

```bash
# global install
npm install -g netlify-cli
# or use npx
npx netlify-cli --help
```

2. Log in to Netlify (opens browser):

```bash
netlify login
```

3. From the project root (this repo), run a draft deploy to test:

```bash
# choose the site or create a new one interactively
netlify deploy --dir=.
```

4. To deploy to production (you will be asked to pick or create a site):

```bash
netlify deploy --prod --dir=.
```

Token-based non-interactive deploy (CI):

If you have a Netlify Personal Access Token you can deploy non-interactively (useful in CI):

```bash
# export token (do NOT share your token)
export NETLIFY_AUTH_TOKEN="<YOUR_TOKEN>"
# deploy to existing site (pass site id)
netlify deploy --prod --dir=. --site=<YOUR_SITE_ID>
```

Alternative: Connect a Git repo to Netlify via the Netlify dashboard and point the build/publish settings to the project root (publish directory `.`).

Notes

- This workspace is static; no build step is required by default. If you add a build step (e.g., webpack, rollup, or a static site generator), update `netlify.toml`'s `build.command` and `build.publish` accordingly.
- If you'd like, I can attempt to run the `netlify deploy` command from this environment, but I'll need network access and either interactive login or a Personal Access Token from you.
