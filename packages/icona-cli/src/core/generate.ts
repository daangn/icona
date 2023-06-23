import generator from "@icona/generator";
import type { IconaConfig } from "@icona/types";
import { getIconaIconsFile } from "@icona/utils";

export const generate = (config: IconaConfig) => {
  console.log("Generating...");

  const icons = getIconaIconsFile();

  if (!icons) {
    console.log("No icons.json file found");
    return;
  }

  const { generate: fn } = generator(icons, config);
  fn();

  console.log(`Generated!!!`);
};
