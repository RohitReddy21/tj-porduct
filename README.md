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

## Microsoft Bookings
Add your public Microsoft Bookings page URL to `.env`:
```bash
VITE_MICROSOFT_BOOKINGS_URL=https://outlook.office.com/bookings/your-booking-page
```

The `/demo` page will:
- collect lead details,
- capture a preferred date and time,
- show the Microsoft Bookings calendar for final scheduling.

## Vercel Deployment
1. Import the `afsv5-react` folder into Vercel.
2. Keep the Framework Preset as **Vite**.
3. Add the `VITE_MICROSOFT_BOOKINGS_URL` environment variable in the Vercel project settings.
4. Deploy.

## TechJignyasa logo
Place the official logo in `public/assets/tj-logo.svg`, then replace the `.brand-mark` span in `src/components/Header.jsx` and `Footer.jsx` with:
```jsx
<img className="brand-logo" src="/assets/tj-logo.svg" alt="TechJignyasa" />
```
