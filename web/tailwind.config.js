const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(
      __dirname,
      '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}'
    ),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      colors: {
        'base-100': '#FFFFFF',
        'base-200': '#FFFFFF',
        'base-300': '#FFFFFF',
      },
    },
  },
  daisyui: {
    themes: [
      {
        mons: {
          primary: "#F5F5F5",
        },
      },
    ],
  },
  plugins: [require('daisyui')],
};
