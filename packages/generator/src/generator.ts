import type { IconaConfig, IconaIconData } from "@icona/types";

import { generateDrawable } from "./core/drawable.js";
import { generatePDF } from "./core/pdf.js";
import { generatePNG } from "./core/png.js";
import { generateReact } from "./core/react.js";
import { generateSVG } from "./core/svg.js";
import { generateVue2 } from "./core/vue2.js";
import { generateVue3 } from "./core/vue3.js";
import { getIconaIconsFile } from "./utils/file";

interface Props {
  /**
   * @description Icona icons data
   * @default .icona/icons.json
   */
  icons?: Record<string, IconaIconData> | null;

  config: IconaConfig;
}
export const generate = async (props: Props) => {
  const { config, icons = getIconaIconsFile() } = props;
  if (!icons) {
    throw new Error(
      "[@Icona/generator] There is no `icons.json` file in .icona folder",
    );
  }

  const { pdf, drawable, react, svg, png, vue2, vue3 } = config;

  console.log("[@Icona/generator] Start generating...");
  await generateSVG({ icons, config: svg }); // SVG is required
  if (png?.active) await generatePNG({ icons, config: png });
  if (pdf?.active) generatePDF({ icons, config: pdf });
  if (drawable?.active) await generateDrawable({ icons, config: drawable });
  if (react?.active) await generateReact({ icons, config: react });
  if (vue2?.active) await generateVue2({ icons, config: vue2 });
  if (vue3?.active) await generateVue3({ icons, config: vue3 });
  console.log("\n[@Icona/generator] Finish generating!!!");
};
