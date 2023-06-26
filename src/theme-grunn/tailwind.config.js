/** @type {import('tailwindcss').Config} */
// colors vars set in tailwind/base.css

// get the theme name
const package = require("../../package.json");
const theme = package.config.theme;

const colors = require("./tailwind/designToken-color");
const fontsize = require("./tailwind/designToken-fontSize");
const fontfamily = require("./tailwind/designToken-fontFamily");

module.exports = {
  content: [
    "src/" + theme + "/layouts/*.liquid",
    "src/" + theme + "/layouts/**/*.liquid",
    "src/" + theme + "/includes/*.liquid",
    "src/" + theme + "/includes/**/*.liquid",
    "src/content/styleguide/*.liquid",
    "src/content/styleguide/**/*.liquid",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: fontfamily,
      fontSize: fontsize,
      colors: colors,
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
};
