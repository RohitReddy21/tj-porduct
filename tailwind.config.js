/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  // styles.css already defines `.container` (min(1180px, 100% - 48px)) and every
  // page uses it. Tailwind's own `.container` collides with that exact class name
  // and forces its breakpoint max-widths (640/768/1024/1280/1536px) onto all of
  // them, squeezing page content narrower than the design intends. Turn it off so
  // the site's container is the only one.
  corePlugins: {
    container: false,
  },
  theme: {
    extend: {},
  },
  plugins: [],
};

