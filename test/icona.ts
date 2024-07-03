import type {
  DrawableConfig,
  PDFConfig,
  PNGConfig,
  ReactConfig,
  SVGConfig,
  Vue2Config,
  Vue3Config,
} from "@icona/generator";
import { generate } from "@icona/generator";

const svgConfig: SVGConfig = {
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
          attributes: [{ "data-seed-icon": "true" }],
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
};

const pdfConfig: PDFConfig = {
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
};

const drawableConfig: DrawableConfig = {
  active: false,
  path: "drawable",
  svg2vectordrawableConfig: {},
  defaultColor: "@color/gray900",
};

const reactConfig: ReactConfig = {
  active: true,
  path: "react",
  genIndexFile: true,
  svgrConfig: {
    jsxRuntime: "classic",
    plugins: ["@svgr/plugin-svgo", "@svgr/plugin-jsx", "@svgr/plugin-prettier"],
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
            attributes: [{ "data-seed-icon": "true" }],
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
};

const pngConfig: PNGConfig = {
  active: false,
  genMode: "recreate",
  path: "png",
};

const vue2Config: Vue2Config = {
  path: "packages/vue2",
  active: false,
  genIndexFile: true,
  genShimFile: true,
};

const vue3Config: Vue3Config = {
  path: "packages/vue3",
  active: false,
  genIndexFile: true,
  genShimFile: true,
};

generate({
  config: {
    svg: svgConfig,
    drawable: drawableConfig,
    pdf: pdfConfig,
    react: reactConfig,
    png: pngConfig,
    vue2: vue2Config,
    vue3: vue3Config,
  },
});
