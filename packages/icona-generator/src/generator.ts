import type { IconaConfig, IconaIconData } from "@icona/types";
import { getIconaIconsFile } from "@icona/utils";

import { generateDrawable } from "./core/drawable";
import { generatePDF } from "./core/pdf";
import { generateReact } from "./core/react";
import { generateSVG } from "./core/svg";

export const generator = (
  icons: Record<string, IconaIconData>,
  config: IconaConfig,
) => {
  const { pdf, drawable, react, svg } = config;

  const generate = () => {
    if (svg?.active) generateSVG({ icons, config: svg });
    if (react?.active) generateReact({ icons, config: react });
    if (pdf?.active) generatePDF({ icons, config: pdf });
    if (drawable?.active) generateDrawable({ icons, config: drawable });
  };

  return { generate };
};

interface GenerateFunction {
  /**
   * @description Icona icons data
   * @default .icona/icons.json
   */
  icons?: Record<string, IconaIconData> | null;
  config: IconaConfig;
}
export const generate = ({
  icons = getIconaIconsFile(),
  config,
}: GenerateFunction) => {
  if (!icons) {
    throw new Error("There is no icons data");
  }

  const { generate: fn } = generator(icons, config);
  fn();
};
