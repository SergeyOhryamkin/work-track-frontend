import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";
import { defineConfig } from "eslint/config";

export default defineConfig([
  { files: ["**/*.{js,mjs,cjs,ts,mts,cts,vue}"], plugins: { js }, extends: ["js/recommended"], languageOptions: { globals: globals.browser } },
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  {
    rules: {
      "@typescript-eslint/no-unnecessary-type-parameters": "warn",
    },
  },
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        extraFileExtensions: [".vue", ".ts", ".js", ".mjs", ".cjs", ".mts", ".cts"],
      },
    },
  },
  pluginVue.configs["flat/recommended"],
  {
    files: ["**/*.vue"],
    languageOptions: { parserOptions: { parser: tseslint.parser } },
    rules: {
      "vue/singleline-html-element-content-newline": "off",
    },
  },
]);
