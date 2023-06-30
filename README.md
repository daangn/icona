# Icona

> You can export Figma SVG files to GitHub with only one click.

This is a Figma plugin to export SVG files to GitHub with only one click.
Shorten the process between designers (Figma) and developers (GitHub).

- **Designer**: Build icon set in Figma and click deploy button, that's it.
- **Developer**: Check the PR and use the icon svg set in your project. (Make react component, Make Pdf, Make XML, ...etc)

## Preview

![preview](./images/preview.png)

## Setting

We need github repository url, github api token

![setting](./images/setting.png)

1. **Repository URL**: GitHub repository full url.
2. **Github API Key**: GitHub API Key

API Key need `repo` scope.

![repo-scope](./images/repo-scope.png)

If you use `Fine-grained personal access tokens`, you need `contents`, `pull requests`, `metadata` scope.

![fine-grained](./images/fine-grained.png)

## How to use

> Assuming you're done setting.

### Designers

1. Install [Icona figma-plugin](https://www.figma.com/community/plugin/1246320822364150095) in Figma.
2. Create a new file in Figma and draw icons in frame named `icona-frame` (convention).
3. Fill icons in `icona-frame` frame and Deploy it.
4. Check the PR and merge it.

### Developers

Icona plugin exports only one file that `icons.json` file in `.icona` folder.
I thought it would be inefficient for the figma plugin to make too many API requests to github,
so I created a library that only sends one file to github and allows developers to create various assets(react component, pdf, xml, ...etc) with that file using `@icona/generator` library.

5. Install `@icona/generator` library in your project.

```bash
yarn add -D @icona/generator
```

6. Create build file with `@icona/generator` library.

   - You can see example in [here (seed-icon)](https://github.com/daangn/seed-icon/blob/main/icona.js)
   - You can see `@icona/generator` library api in [here](https://github.com/daangn/icona/tree/main/packages/icona-generator)

7. Run build script. (ex: `node icona.js`)
8. That's it. You can deploy it or use it in your project.

## Auto Generate (Github Action)

If you want to automate the process of generating assets when PR uploaded, you can use github action.

- [Example](https://github.com/daangn/seed-icon/blob/main/.github/workflows/icona-generate-svg-files.yml)

Then you can use the generated assets that are automatically generated in the PR.

## Products

- [figma-plugin (Figma Plugin)](https://github.com/daangn/icona/tree/main/packages/figma-plugin)
- [@icona/generator (Asset Generator)](https://github.com/daangn/icona/tree/main/packages/icona-generator)

## Where use this?

If you use this library, please send PR to add your project in this list.

- [daangn/seed-icon](https://github.com/daangn/seed-icon)
