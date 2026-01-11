# Sensebase Frontend

## Autors
- Dídac Dalmases
- Omar Antonio Cornejo
- Rubén Palà
- Enrique De Vicente Tutor

**Tech stack**
- **React** for UI components  
- **TypeScript** for type-safe development  
- **Vite** for blazing-fast dev and build  
- **Tailwind CSS** for utility-first styling  

**Other Libraries**
- **Nivo** for charts
- **Motion** for animations
- **React router** for routing
---

## Getting started

Clone the repository and install dependencies:
```sh
npm install
```

Before running the application, you must configure the environment variables.

Create a `.env` file in the root directory of the project.

Add the `VITE_API_URL` variable to define the backend endpoint.

Default development configuration:
```env
VITE_API_URL=http://localhost:8000/api
```

Run the development server:
```sh
npm run dev
```

## Deployment (Netlify)

Th deployment method is a GitHub Action that builds the site and deploys to Netlify using the Netlify CLI. A `netlify.toml` file is already included to handle SPA redirects (prevents 404s on client routes like `/register`).

Recommended (GitHub Action)
- A workflow file is included at `.github/workflows/netlify-deploy.yml`.
- The workflow uses `npm install` to avoid failures when `package-lock.json` is not present.
- Required repository secrets (in your fork):
  - `NETLIFY_AUTH_TOKEN` — create a Personal Access Token in Netlify and add it as a secret.
  - `NETLIFY_SITE_ID` — the Netlify site id.

Steps to enable automatic deploys with the Action:
1. Fork this repository.
2. In your fork, add the two repository secrets under Settings → Secrets and variables → Actions.
3. Push to the branch configured in the workflow — the workflow will run, build the app and publish `dist` to the Netlify site configured by `NETLIFY_SITE_ID`.

Quick local build (same as CI):
```sh
npm install
npm run build
# preview the built files locally
npx serve -s dist
```

Optional: Netlify CLI (manual deploys)
- If you prefer to deploy manually from your machine you can still use the Netlify CLI:
```sh
npm i -g netlify-cli
netlify login
npx netlify deploy --dir=dist           # draft deploy (preview URL)
npx netlify deploy --prod --dir=dist   # publish to production
```
