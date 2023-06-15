import generator from "@icona/generator";
import * as utils from "@icona/utils";
import { Command } from "commander";

// TODO: svg2vectordrawable option 타입을 유저에게서 받을 수 있도록 수정
export const generate = new Command("generate")
  .alias("gen")
  .alias("g")
  .description("Generate Xml from .icona/icons.json file")
  .action(() => {
    try {
      console.log("Generating...");

      const icons = utils.getIconaIconsFile();
      const config = utils.getIconaConfigFile();

      if (!icons) {
        console.log("No icons.json file found");
        return;
      }

      if (!config) {
        console.log("No config.json file found");
        return;
      }

      const { generate: generateStuffs } = generator(icons, config);
      generateStuffs();

      console.log(`Generated!!!`);
    } catch (error) {
      console.error(error);
    }
  });
