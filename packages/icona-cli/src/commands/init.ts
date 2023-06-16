import { generateConfigFile } from "@icona/utils";
import { Command } from "commander";

import { iconaConfigTemplate } from "../templates";

export const init = new Command("init")
  .alias("i")
  .description("Generate config files")
  .action(() => {
    try {
      console.log("Generating...");

      generateConfigFile(iconaConfigTemplate);

      console.log(`Generated!!!`);
    } catch (error) {
      console.error(error);
    }
  });
