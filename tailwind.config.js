/** @type {import('tailwindcss').Config} */
import plugin from "tailwindcss/plugin";
import forms from "@tailwindcss/forms";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {},
  },
  plugins: [
    forms,
    plugin(function ({ addVariant }) {
      addVariant("ql", "& .ql-snow");
      addVariant("ql-dark", ".dark & .ql-snow");
    }),
  ],
};
