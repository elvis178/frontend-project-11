import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config} */
export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        process: "readonly",
      },
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    rules: {
      "no-undef": "error",
    },
  },
  {
    files: ["webpack.config.js"],
    languageOptions: {
      globals: {
        ...globals.node,
        process: "readonly",
      },
    },
  },
  pluginJs.configs.recommended,
];