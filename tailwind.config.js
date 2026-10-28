/** 웹 globals.css 토큰 v2. RN은 줄높이 배수 · em 자간을 못 받아 px로 계산해 둔다 */
const type = (size, lineHeight, weight, tracking = 0) => [
  `${size}px`,
  { lineHeight: `${Math.round(size * lineHeight)}px`, fontWeight: weight, letterSpacing: `${+(size * tracking).toFixed(2)}px` },
];

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#101318',
        'primary-press': '#343942',
        'primary-tint': '#f2f3f5',
        ink: '#101318',
        sub: '#6b7078',
        line: '#d8d9dc',
        hair: '#e3e5e8',
        surface: '#f2f3f5',
        page: '#ffffff',
      },
      fontSize: {
        'ds-display': type(30, 1.3, '600', -0.028),
        'ds-headline': type(24, 1.45, '600', -0.02),
        'ds-title-1': type(19, 1.5, '600', -0.018),
        'ds-title-2': type(17, 1.45, '600', -0.015),
        'ds-body-1': type(17, 1.65, '400', -0.008),
        'ds-body-2': type(14, 1.6, '400'),
        'ds-caption': type(12, 1.5, '400'),
      },
      spacing: { gutter: '20px' },
    },
  },
  plugins: [],
};
