module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  extends: [
    "react-app",
    "airbnb-typescript",
    "prettier",
    "plugin:storybook/recommended",
  ],
  parserOptions: {
    project: "./tsconfig.eslint.json",
    tsconfigRootDir: __dirname,
  },
  plugins: [
    "@typescript-eslint/eslint-plugin",
    "json-format",
    "prettier",
    "simple-import-sort",
  ],
  rules: {
    "import/no-extraneous-dependencies": "off",
    "@typescript-eslint/consistent-type-imports": [
      "error",
      {
        prefer: "type-imports",
        disallowTypeAnnotations: false,
      },
    ],
    "prettier/prettier": [
      "error",
      {
        singleQuote: false,
        semi: true,
        tabWidth: 2,
        useTabs: false,
        trailingComma: "all",
        printWidth: 80,
        arrowParens: "always",
      },
      {
        usePrettierrc: false,
      },
    ],
    "import/extensions": [
      "error",
      {
        js: "always",
        json: "always",
      },
    ],
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
  },
};
