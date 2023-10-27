# @icona/generator

> Icona asset generator

## Install

```bash
yarn add -D @icona/generator
```

## Usage

```js
import { generate } from "@icona/generator";

generate({
  config: {
    svg: {
      active: true, // you can disable svg generator if you set false
      path: "svg", // will generate svg files in svg folder
      svgoConfig: {},
    },
    drawable: {
      active: true, // you can disable drawable generator if you set false
      path: "drawable", // will generate xml files in drawable folder
      svg2vectordrawableConfig: {},
      defaultColor: "#000000", // default color for android vector drawable
    },
    pdf: {
      active: true, // you can disable pdf generator if you set false
      path: "pdf", // will generate pdf files in pdf folder
      pdfKitConfig: {},
      svgToPdfOptions: {},
    },
    react: {
      active: true, // you can disable react generator if you set false
      path: "react", // will generate react component files in react folder
      svgrConfig: {},
    },
  },
});
```

`@icona/generator` use several libraries to generate assets.

- [svgo (SVG)](https://github.com/svg/svgo)
- [svg2vectordrawable (XML)](https://github.com/Ashung/svg2vectordrawable)
- [pdfkit (PDF)](https://pdfkit.org/docs/getting_started.html#document-structure)
- [svg-to-pdfkit (PDF)](https://github.com/alafr/SVG-to-PDFKit)
- [svgr (React Components)](https://react-svgr.com/)

you configure each library options in `config` object.
If you want to see real example, you can see [here (seed-icon)](https://github.com/daangn/seed-icon/blob/main/icona.js)
