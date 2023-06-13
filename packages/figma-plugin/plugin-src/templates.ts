import dedent from "ts-dedent";

export const generateSvgActionTemplate = dedent(`
  # generate svg github action
  on:
    push:
      branches:
        - 'icona-update-**'
  
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
          run: npm install icona-cli@latest -g
  
        - name: Generate SVGs
          run: |
            icona generate-svg
            git config --global user.email "41898282+github-actions[bot]@users.noreply.github.com"
            git config --global user.name "GitHub Action"
            git add .
            git commit -m "[Icona] Generate SVG files"
            git push

        # If you want to generate XMLs, uncomment this block
        # - name: Generate XMLs
        #   run: |
        #     icona generate-xml
        #     git config --global user.email "41898282+github-actions[bot]@users.noreply.github.com"
        #     git config --global user.name "GitHub Action"
        #     git add .
        #     git commit -m "[Icona] Generate XML files"
        #     git push

        # If you want to generate PDFs, uncomment this block
        # - name: Generate PDFs
        #   run: |
        #     icona generate-pdf
        #     git config --global user.email "41898282+github-actions[bot]@users.noreply.github.com"
        #     git config --global user.name "GitHub Action"
        #     git add .
        #     git commit -m "[Icona] Generate PDF files"
        #     git push

        # If you want to generate React Components, uncomment this block
        # - name: Generate React Components
        #   run: |
        #     icona generate-react-component
        #     git config --global user.email "41898282+github-actions[bot]@users.noreply.github.com"
        #     git config --global user.name "GitHub Action"
        #     git add .
        #     git commit -m "[Icona] Generate React Components"
        #     git push\n
`);

export const releaseTemplate = dedent(`
  # Release Note\n
`);
