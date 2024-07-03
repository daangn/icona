import type {
  DrawableConfig,
  IconaConfig,
  PDFConfig,
  PNGConfig,
  ReactConfig,
  SVGConfig,
  Vue2Config,
  Vue3Config,
} from "@icona/types";

import { generateDrawable } from "./core/drawable.js";
import { generatePDF } from "./core/pdf.js";
import { generatePNG } from "./core/png.js";
import { generateReact } from "./core/react.js";
import { generateSVG } from "./core/svg.js";
import { generateVue2 } from "./core/vue2.js";
import { generateVue3 } from "./core/vue3.js";
import { generate } from "./generator.js";

export {
  generate,
  generateDrawable,
  generatePDF,
  generatePNG,
  generateReact,
  generateSVG,
  generateVue2,
  generateVue3,
};

export type {
  DrawableConfig,
  IconaConfig,
  PDFConfig,
  PNGConfig,
  ReactConfig,
  SVGConfig,
  Vue2Config,
  Vue3Config,
};
