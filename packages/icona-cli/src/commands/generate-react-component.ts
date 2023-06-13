import type { IconaIconData } from "@icona/types";
import svgr from "@svgr/core";
import { Command } from "commander";
import fs from "fs";
import path from "path";

import { ICONS_PATH, PROJECT_PATH } from "../constants";

interface GenerateSvgCommandArgs {
  path?: string;
}

// TODO: svgr option 타입을 유저에게서 받을 수 있도록 수정
// TODO: typescript option
export const generateReactComponent = new Command("generate-react-component")
  .option(
    "-p, --path <path>",
    "icons.json file path that will be generated (default: react)",
    "react",
  )
  .alias("generate-react")
  .description("Generate SVG from .icona/icons.json file")
  .action((args: GenerateSvgCommandArgs) => {
    try {
      console.log("Generating React Components...");

      const pathArg = args.path || "react";

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

        const componentName = name
          .replace(/^[a-z]/, (ch) => ch.toUpperCase())
          .replace(/_[a-z]/g, (ch) => ch[1].toUpperCase());

        const component = await svgr.transform(
          svg,
          {
            plugins: [
              "@svgr/plugin-svgo",
              "@svgr/plugin-jsx",
              "@svgr/plugin-prettier",
            ],
            replaceAttrValues: {
              "#212124": "currentColor",
            },
            prettierConfig: {
              tabWidth: 2,
              useTabs: false,
              singleQuote: true,
              semi: true,
            },
            svgoConfig: {
              // plugins: [
              //   {
              //     name: "addAttributesToSVGElement",
              //     params: {
              //       attributes: [{ "data-karrot-ui-icon": true }],
              //     },
              //   },
              // ],
            },
            typescript: true,
            dimensions: false,
          },
          { componentName },
        );

        const svgPath = path.resolve(
          PROJECT_PATH,
          pathArg,
          `${componentName}.tsx`,
        );
        fs.writeFileSync(svgPath, component, "utf-8");
      });

      console.log(`React Components generated in ${pathArg}`);
    } catch (error) {
      console.error(error);
    }
  });
