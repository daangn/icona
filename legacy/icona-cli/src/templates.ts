import dedent from "dedent";

export const iconaConfigTemplate = dedent(`
  {
    "$schema": "https://raw.githubusercontent.com/daangn/icona/main/packages/types/schema.json",
    "svg": {
      "active": true,
      "svgoConfig": {}
    },
    "drawable": {
      "active": false,
      "svg2vectordrawableConfig": {}
    },
    "pdf": {
      "active": false,
      "pdfKitConfig": {}
    },
    "react": {
      "active": false,
      "svgrConfig": {}
    }
  }\n
`);

// TODO: 가이드로 빼는게 나을듯
// export const generateSvgActionTemplate = dedent(`
//   # generate svg github action
//   on:
//     push:
//       branches:
//         - 'icona-update-**'
//       files:
//         - 'icons.json'
//         - 'config.json'

//   name: Generate SVG files from icons.json

//   jobs:
//     deploy:
//       name: Generate SVG files from icons.json
//       runs-on: ubuntu-latest

//       steps:
//         - uses: actions/checkout@v3
//         - uses: actions/setup-node@v3
//           with:
//             node-version: 18
//             # cache: yarn # or npm

//         - name: Install Dependencies
//           # run: yarn install --immutable
//           # run: npm install --immutable

//         - name: Generate SVGs
//           run: |
//             yarn icona generate
//             git config --global user.email "41898282+github-actions[bot]@users.noreply.github.com"
//             git config --global user.name "GitHub Action"
//             git add .
//             git commit -m "[Icona] Generate SVG files"
//             git push\n
// `);

export const releaseTemplate = `
# Release Note\n
`;
