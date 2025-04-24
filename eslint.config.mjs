import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config} */
export default [
  {
    ignores: ["dist/**", "node_modules/**"]
  },
  {
    files: ["**/*.js"],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
      },
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    rules: {
      "no-undef": "off"
    }
  },
  pluginJs.configs.recommended,
];