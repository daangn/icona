import type { IconaConfig, IconaIconData } from "@icona/types";
import fs from "fs";

import { generateDrawable } from "./core/drawable.js";
import { generatePDF } from "./core/pdf.js";
import { generatePNG } from "./core/png.js";
import { generateReact } from "./core/react.js";
import { generateSVG } from "./core/svg.js";
import { generateVue2 } from "./core/vue2.js";
import { generateVue3 } from "./core/vue3.js";
import { iconaIconJsonFile } from "./schema.js";
import { getIconaIconsFile } from "./utils/file";

interface Props {
  /**
   * @description Icona icons data
   * @default .icona/icons.json
   */
  icons?: Record<string, IconaIconData> | string;

  config: IconaConfig;
}

export const generate = async (props: Props) => {
  const { config, icons = getIconaIconsFile() } = props;
  let iconData = icons;

  if (!iconData) {
    throw new Error(
      "[@Icona/generator] There is no `icons.json` file in .icona folder",
    );
  }

  if (typeof iconData === "string") {
    const data = fs.readFileSync(iconData, "utf-8");
    iconData = JSON.parse(data);
  }

  const paredIconFile = iconaIconJsonFile.parse(iconData);

  const { pdf, drawable, react, svg, png, vue2, vue3 } = config;

  console.log("[@Icona/generator] Start generating...");
  await generateSVG({ icons: paredIconFile, config: svg }); // SVG is required
  if (png?.active) await generatePNG({ icons: paredIconFile, config: png });
  if (pdf?.active) generatePDF({ icons: paredIconFile, config: pdf });
  if (drawable?.active)
    await generateDrawable({ icons: paredIconFile, config: drawable });
  if (react?.active)
    await generateReact({ icons: paredIconFile, config: react });
  if (vue2?.active) await generateVue2({ icons: paredIconFile, config: vue2 });
  if (vue3?.active) await generateVue3({ icons: paredIconFile, config: vue3 });
  console.log("\n[@Icona/generator] Finish generating!!!");
};
