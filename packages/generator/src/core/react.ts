import type { IconaIconData, ReactConfig } from "@icona/types";
import type { Config } from "@svgr/core";
import { transform } from "@svgr/core";
import { writeFile } from "fs/promises";
import { resolve } from "path";

import { createBar } from "../utils/bar";
import {
  deleteAllFilesInDir,
  getIconaIconsFile,
  getTargetPath,
  makeFolderIfNotExistFromRoot,
} from "../utils/file";
import { generateIndexFileTemplate, ignores } from "../utils/template";

interface Props {
  /**
   * @description Icona icons data
   * @default .icona/icons.json
   */
  icons?: Record<string, IconaIconData> | null;

  config: ReactConfig;
}

export const generateReact = async (props: Props) => {
  const { config, icons = getIconaIconsFile() } = props;
  const { genIndexFile } = config;
  const componentNames = [];
  const targetPath = getTargetPath(config.path || "react");
  const svgrConfig = config.svgrConfig || {};

  if (!icons) {
    throw new Error("There is no icons data");
  }

  const iconData = Object.entries(icons);
  if (iconData.length !== 0) {
    makeFolderIfNotExistFromRoot(targetPath);
  }

  if (config.genMode === "recreate") {
    deleteAllFilesInDir(targetPath);
  }

  console.log(`\nReact Generate in \`${targetPath}\` folder...`);

  const bar = createBar({
    name: "React",
    total: iconData.length,
  });

  bar.start();

  // TODO: Name transform option
  for (const [name, data] of iconData) {
    const { svg } = data;

    const componentName = name
      .replace(/^[a-z]/, (ch) => ch.toUpperCase())
      .replace(/_[a-z]/g, (ch) => ch[1].toUpperCase())
      .replace(/-[a-z]/g, (ch) => ch[1].toUpperCase());

    componentNames.push(componentName);

    const component = await transform(svg, svgrConfig as Config, {
      componentName,
    });

    const svgPath = resolve(targetPath, `${componentName}.tsx`);
    const content = `${ignores}\n${component}`;

    await writeFile(svgPath, content, "utf-8");
    bar.increment();
  }

  if (genIndexFile) {
    const index = generateIndexFileTemplate({
      componentNames,
      ext: null,
    });
    const content = `${ignores}\n${index}`;
    await writeFile(resolve(targetPath, "index.ts"), content, "utf-8");
  }

  bar.stop();
};
