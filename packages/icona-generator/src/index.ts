import { generateDrawable } from "./core/drawable";
import { generatePDF } from "./core/pdf";
import { generateReact } from "./core/react";
import { generateSVG } from "./core/svg";
import { generate, generator } from "./generator";

export default generator;

export { generate, generateDrawable, generatePDF, generateReact, generateSVG };
