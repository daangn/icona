import { getIconaConfigPath } from "@icona/utils";
import { Command } from "commander";
import { existsSync } from "fs";
import { parse, resolve } from "path";

// import { iconaConfigTemplate } from "../templates";

export const initCommand = new Command("init")
  .alias("i")
  .description("Generate config files")
  .action(async () => {
    try {
      console.log("Generating...");

      const configPath = getIconaConfigPath();
      console.log("configPath", configPath);

      const parsed = parse(configPath);
      console.log("parsed", parsed);
      const configFileWithExt = resolve(parsed.dir, parsed.base);

      let content;
      if (parsed.ext === ".ts") {
        content = await import(configFileWithExt.replace(".ts", ".mjs"));
      }

      if (parsed.ext === ".js") {
        content = await import(configFileWithExt);
      }

      console.log("content", content.config);

      if (!existsSync(configFileWithExt)) {
        console.log("No config.json file found");
        return;
      }

      console.log(`Generated!!!`);
    } catch (error) {
      console.error(error);
    }
  });
