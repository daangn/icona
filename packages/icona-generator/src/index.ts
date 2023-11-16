import { generateDrawable } from "./core/drawable";
import { generatePDF } from "./core/pdf";
import { generatePNG } from "./core/png";
import { generateReact } from "./core/react";
import { generateSVG } from "./core/svg";
import { generate, generator } from "./generator";

export {
  generate,
  generateDrawable,
  generatePDF,
  generatePNG,
  generateReact,
  generateSVG,
};

export default generator;
