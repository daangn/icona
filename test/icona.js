import { generate } from "@icona/generator";

generate({
  config: {
    svg: {
      active: false,
      path: "svg",
      svgoConfig: {
        js2svg: {
          indent: 2,
          pretty: true,
        },
        plugins: [
          {
            name: "addAttributesToSVGElement",
            params: {
              attributes: [{ "data-seed-icon": true }],
            },
          },
          {
            name: "convertColors",
            params: {
              currentColor: true,
            },
          },
          {
            name: "removeAttrs",
            params: {
              attrs: ["id"],
            },
          },
        ],
      },
    },
    drawable: {
      active: false,
      path: "drawable",
      svg2vectordrawableConfig: {},
      defaultColor: "@color/gray900",
    },
    pdf: {
      active: false,
      path: "pdf",
      pdfKitConfig: {
        size: [24, 24],
        margin: 0,
        layout: "landscape",
      },
      svgToPdfOptions: {
        assumePt: true,
        width: 24,
        height: 24,
      },
    },
    react: {
      active: false,
      path: "react",
      svgrConfig: {
        jsxRuntime: "classic",
        plugins: [
          "@svgr/plugin-svgo",
          "@svgr/plugin-jsx",
          "@svgr/plugin-prettier",
        ],
        prettierConfig: {
          tabWidth: 2,
          useTabs: false,
          singleQuote: true,
          semi: true,
        },
        svgoConfig: {
          plugins: [
            {
              name: "addAttributesToSVGElement",
              params: {
                attributes: [{ "data-seed-icon": true }],
              },
            },
            {
              name: "convertColors",
              params: {
                currentColor: true,
              },
            },
            {
              name: "removeAttrs",
              params: {
                attrs: ["id"],
              },
            },
          ],
        },
        typescript: true,
        dimensions: false,
      },
    },
    png: {
      active: false,
      genMode: "recreate",
      path: "png",
    },
    font: {
      genMode: "recreate",
      active: true,
      svgToFontOptions: {
        src: "svg",
        dist: "font",
        fontName: "seed-icon",
      },
    },
    flutter: {
      active: true,
      ttfPath: "font/seed-icon.ttf",
      fileName: "SeedIcons",
      fontFamily: "SeedIcon",
      genMode: "recreate",
      path: "flutter",
    },
  },
});
