/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "surface": "#fbf9f9",
        "on-primary-container": "#858383",
        "on-error": "#ffffff",
        "on-error-container": "#93000a",
        "secondary": "#745b00",
        "on-surface-variant": "#444748",
        "on-tertiary-fixed-variant": "#454747",
        "surface-container": "#efeded",
        "secondary-fixed-dim": "#eac249",
        "primary-container": "#1c1b1b",
        "on-tertiary": "#ffffff",
        "tertiary-fixed": "#e2e2e2",
        "on-tertiary-container": "#838484",
        "inverse-surface": "#303031",
        "secondary-fixed": "#ffe08b",
        "outline": "#747878",
        "outline-variant": "#c4c7c7",
        "on-secondary-container": "#735a00",
        "on-surface": "#1b1c1c",
        "surface-container-low": "#f5f3f3",
        "primary": "#000000",
        "on-primary-fixed-variant": "#474746",
        "on-background": "#1b1c1c",
        "surface-container-high": "#e9e8e7",
        "error-container": "#ffdad6",
        "tertiary-fixed-dim": "#c6c6c7",
        "background": "#fbf9f9",
        "surface-container-lowest": "#ffffff",
        "inverse-primary": "#c8c6c5",
        "on-secondary-fixed": "#241a00",
        "on-tertiary-fixed": "#1a1c1c",
        "on-secondary": "#ffffff",
        "secondary-container": "#fcd358",
        "surface-tint": "#5f5e5e",
        "surface-dim": "#dbdad9",
        "primary-fixed": "#e5e2e1",
        "primary-fixed-dim": "#c8c6c5",
        "surface-bright": "#fbf9f9",
        "inverse-on-surface": "#f2f0f0",
        "error": "#ba1a1a",
        "on-secondary-fixed-variant": "#584400",
        "on-primary": "#ffffff"
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
      spacing: {
        "base": "8px",
        "container-max": "1200px",
        "gutter": "24px",
        "margin-mobile": "20px",
        "margin-desktop": "64px"
      },
      fontFamily: {
        "body-lg": ["Inter", "sans-serif"],
        "label-md": ["Inter", "sans-serif"],
        "headline-lg-mobile": ["Montserrat", "sans-serif"],
        "headline-md": ["Montserrat", "sans-serif"],
        "display-lg": ["Montserrat", "sans-serif"],
        "headline-lg": ["Montserrat", "sans-serif"],
        "body-md": ["Inter", "sans-serif"]
      },
      fontSize: {
        "body-lg": ["18px", { lineHeight: "1.6", fontWeight: "400" }],
        "label-md": ["14px", { lineHeight: "1", letterSpacing: "0.05em", fontWeight: "600" }],
        "headline-lg-mobile": ["28px", { lineHeight: "1.2", fontWeight: "600" }],
        "headline-md": ["24px", { lineHeight: "1.3", fontWeight: "600" }],
        "display-lg": ["48px", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" }],
        "headline-lg": ["32px", { lineHeight: "1.2", fontWeight: "600" }],
        "body-md": ["16px", { lineHeight: "1.5", fontWeight: "400" }]
      }
    },
  },
  plugins: [],
}
