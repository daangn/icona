import type { IconaIconData } from "@icona/types";
import { Command } from "commander";
import fs from "fs";
import path from "path";
import svgo from "svgo";

import { ICONS_PATH, PROJECT_PATH } from "../constants";

interface GenerateSvgCommandArgs {
  path?: string;
}

// TODO: svgo option 타입을 유저에게서 받을 수 있도록 수정
export const generateSvg = new Command("generate-svg")
  .option(
    "-p, --path <path>",
    "icons.json file path that will be generated (default: svg)",
    "svg",
  )
  .description("Generate SVG from .icona/icons.json file")
  .action((args: GenerateSvgCommandArgs) => {
    try {
      console.log("Generating SVGs...");

      const pathArg = args.path || "svg";

      if (!ICONS_PATH) {
        console.log("No icons.json file found");
        return;
      }

      const icons = JSON.parse(
        fs.readFileSync(ICONS_PATH, "utf-8"),
      ) as IconaIconData[];

      icons.forEach(({ name, svg }) => {
        if (!fs.existsSync(path.resolve(PROJECT_PATH, pathArg))) {
          fs.mkdirSync(path.resolve(PROJECT_PATH, pathArg));
        }

        const { data: optimizedSvg } = svgo.optimize(svg, {
          js2svg: {
            indent: 2,
            pretty: true,
          },
          plugins: [
            {
              name: "convertColors",
              params: {
                currentColor: true,
              },
            },
          ],
        });

        const svgPath = path.resolve(PROJECT_PATH, pathArg, `${name}.svg`);
        fs.writeFileSync(svgPath, optimizedSvg, "utf-8");
      });

      console.log(`SVGs generated in ${pathArg}`);
    } catch (error) {
      console.error(error);
    }
  });
