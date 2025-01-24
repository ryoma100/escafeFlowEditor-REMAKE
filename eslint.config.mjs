// @ts-check

import eslint from "@eslint/js";
import prettierConfig from "eslint-config-prettier";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import solid from "eslint-plugin-solid/configs/typescript";
import unusedPlugin from "eslint-plugin-unused-imports";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: ["coverage/*", "dist/*", "storybook-static/*", "src-tauri/target/*"],
  },

  // @eslint/js
  eslint.configs.recommended,

  // typescript-eslint
  ...tseslint.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
        },
      ],
    },
  },

  // eslint-plugin-solid
  {
    files: ["src/**/*.{ts,tsx}"],
    ...solid,
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "tsconfig.json",
      },
    },
  },

  // eslint-plugin-unused-imports
  {
    plugins: { "unused-imports": unusedPlugin },
    rules: {
      "unused-imports/no-unused-imports": "warn",
    },
  },

  // eslint-plugin-simple-import-sort
  {
    plugins: { "simple-import-sort": simpleImportSort },
    rules: {
      "simple-import-sort/imports": "warn",
      "simple-import-sort/exports": "warn",
    },
  },

  // eslint-config-prettier
  prettierConfig,
);
