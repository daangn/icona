import { generateDrawable } from "./core/drawable.js";
import { generateDart } from "./core/flutter.js";
import { generateFont } from "./core/font.js";
import { generatePDF } from "./core/pdf.js";
import { generatePNG } from "./core/png.js";
import { generateReact } from "./core/react.js";
import { generateSVG } from "./core/svg.js";
import { generate, generator } from "./generator.js";

export {
  generate,
  generateDart,
  generateDrawable,
  generateFont,
  generatePDF,
  generatePNG,
  generateReact,
  generateSVG,
};

export default generator;
