import dedent from "ts-dedent";

export const generateSvgActionTemplate = dedent(`
  # generate svg github action
  on:
    push:
      branches:
        - 'icona-update-**'
      paths:
        - '.icona/icons.json'
  
  name: Generate SVG files from icons.json
  
  jobs:
    deploy:
      name: Generate SVG files from icons.json
      runs-on: ubuntu-latest
  
      steps:
        - uses: actions/checkout@v3
        - uses: actions/setup-node@v3
          with:
            node-version: 18
  
        - name: Install Icona CLI
          run: npm install icona-cli -g
  
        - name: Generate SVG files
          run: |
            icona generate
            git config --global user.email "41898282+github-actions[bot]@users.noreply.github.com"
            git config --global user.name "GitHub Action"
            git add .
            git commit -m "Generate SVG files"
            git push\n
`);

export const releaseTemplate = dedent(`
  # Release Note\n
`);
