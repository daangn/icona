import type { IconaConfig, IconaIconData } from "@icona/types";

import { generateDrawable } from "./core/drawable";
import { generatePDF } from "./core/pdf";
import { generateReact } from "./core/react";
import { generateSVG } from "./core/svg";

export const generator = (icons: IconaIconData[], config: IconaConfig) => {
  const { pdf, drawable, react, svg } = config;

  const generate = () => {
    if (svg?.active) generateSVG(icons, svg);
    if (react?.active) generateReact(icons, react);
    if (pdf?.active) generatePDF(icons, pdf);
    if (drawable?.active) generateDrawable(icons, drawable);
  };

  return { generate };
};
