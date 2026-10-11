# Pit Wall: David Soldat's portfolio

An F1 pit-wall themed portfolio built with Angular 22 and Tailwind CSS v4, prerendered to static HTML and hosted on Vercel.

## Develop

    npm install          # needs Node 22.22.3+ or 24.15+
    npx ng serve          # http://localhost:4200
    npx ng test           # unit tests (Vitest)
    npm run build         # static output in dist/pitwall/browser

Content lives in `src/app/content/`: projects (with architecture diagrams), profile and stack.
To add a screenshot, put the image in `public/projects/<slug>/` and set `src: '/projects/<slug>/<file>'` on the matching entry in `shots`.

## Contact form

`api/contact.ts` is a Vercel function that sends mail through Gmail. Set these environment variables in Vercel:

- `SMTP_EMAIL`: the Gmail address that sends and receives
- `SMTP_PASSWORD`: a Gmail app password for that address

## Deploy

1. Push this repo to GitHub.
2. Import it in Vercel. `vercel.json` sets the build command and output directory.
3. Add the two environment variables, then deploy.
