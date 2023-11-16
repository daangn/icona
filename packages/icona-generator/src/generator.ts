import type { IconaConfig, IconaIconData } from "@icona/types";
import { getIconaIconsFile } from "@icona/utils";

import { generateDrawable } from "./core/drawable";
import { generatePDF } from "./core/pdf";
import { generatePNG } from "./core/png";
import { generateReact } from "./core/react";
import { generateSVG } from "./core/svg";

export const generator = (
  icons: Record<string, IconaIconData>,
  config: IconaConfig,
) => {
  const { pdf, drawable, react, svg, png } = config;

  const generate = () => {
    if (svg?.active) generateSVG({ icons, config: svg });
    if (react?.active) generateReact({ icons, config: react });
    if (pdf?.active) generatePDF({ icons, config: pdf });
    if (drawable?.active) generateDrawable({ icons, config: drawable });
    if (png?.active) generatePNG({ icons, config: png });
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
    throw new Error(
      "[@Icona/generator] There is no `icons.json` file in .icona folder",
    );
  }

  const { generate: fn } = generator(icons, config);
  fn();
};
