# cPanel Git Version Control Deployment

This repository follows cPanel's documented **pull deployment** model.

## Deployment flow

```text
GitHub
  -> cPanel Update from Remote
  -> cPanel-managed Git checkout
  -> Deploy HEAD Commit
  -> .cpanel.yml
  -> ~/lien-phat-ai-production
  -> Passenger / Node
```

The Git checkout is the source/deployment repository. The live Node application is kept in a separate production directory.

## Git Version Control

Use the existing cPanel-managed clone of:

`CREDITGOTTI/lien-phat-ai-operating-system`

For each release:

1. Wait for GitHub Actions to create `deploy/Lien-Phat-AI-cPanel-Prebuilt.zip`.
2. In cPanel Git Version Control, click **Update from Remote**.
3. Confirm the checked-out HEAD changed to the latest GitHub commit.
4. Click **Deploy HEAD Commit**.
5. cPanel runs the checked-in root `.cpanel.yml`.

No `npm install` or `npm run build` runs on the cPanel account.

## Production Node application

Set the cPanel Node/Passenger application to:

- Application root: `lien-phat-ai-production`
- Startup file: `app.js`
- Application mode: `Production`
- Node: 20.19+ or Node 22

The deployment creates:

- `~/lien-phat-ai-production/.output/server/index.mjs`
- `~/lien-phat-ai-production/.output/public/`
- `~/lien-phat-ai-production/app.js`
- `~/lien-phat-ai-production/package.json`
- `~/lien-phat-ai-production/.env.example`
- `~/lien-phat-ai-production/tmp/restart.txt`

## Environment

If server-side environment variables are needed, create:

`~/lien-phat-ai-production/.env`

Do not place the real `.env` in GitHub.

## Deployment log

The deployment writes:

`~/lien-phat-ai-deployment.log`

A successful run ends with:

`DEPLOYMENT COMPLETE`
