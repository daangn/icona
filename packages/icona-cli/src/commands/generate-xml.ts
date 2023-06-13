import type { IconaIconData } from "@icona/types";
import { Command } from "commander";
import fs from "fs";
import path from "path";
import svg2vectordrawable from "svg2vectordrawable";

import { ICONS_PATH, PROJECT_PATH } from "../constants";

interface GenerateXmlCommandArgs {
  path?: string;
}

// TODO: svg2vectordrawable option 타입을 유저에게서 받을 수 있도록 수정
export const generateXml = new Command("generate-xml")
  .option(
    "-p, --path <path>",
    "icons.json file path that will be generated (default: xml)",
    "xml",
  )
  .description("Generate Xml from .icona/icons.json file")
  .action((args: GenerateXmlCommandArgs) => {
    try {
      console.log("Generating xmls...");

      const pathArg = args.path || "xml";

      if (!ICONS_PATH) {
        console.log("No icons.json file found");
        return;
      }

      const icons = JSON.parse(
        fs.readFileSync(ICONS_PATH, "utf-8"),
      ) as IconaIconData[];

      icons.forEach(async ({ name, svg }) => {
        if (!fs.existsSync(path.resolve(PROJECT_PATH, pathArg))) {
          fs.mkdirSync(path.resolve(PROJECT_PATH, pathArg));
        }

        const xmlPath = path.resolve(PROJECT_PATH, pathArg, `${name}.xml`);
        const xml = await svg2vectordrawable(svg);
        const convertedXml = xml.replace(/#FF212124/g, "@color/gray900");
        fs.writeFileSync(xmlPath, convertedXml);
      });

      console.log(`xmls generated in ${pathArg}`);
    } catch (error) {
      console.error(error);
    }
  });
