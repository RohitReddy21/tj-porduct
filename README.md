# AFSv5 React Website

React/Vite conversion of the approved AFSv5 static frontend.

## Local
```bash
npm install
npm run dev
```

## Production
```bash
npm run build
```
Deploy to Vercel with Framework Preset **Vite**. The included `vercel.json` supports SPA routes.

## TechJignyasa logo
Place the official logo in `public/assets/tj-logo.svg`, then replace the `.brand-mark` span in `src/components/Header.jsx` and `Footer.jsx` with:
```jsx
<img className="brand-logo" src="/assets/tj-logo.svg" alt="TechJignyasa" />
```
