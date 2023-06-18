import type { GenerateReactConfig, IconaIconData } from "@icona/types";
import { getProjectRootPath, makeFolderIfNotExistFromRoot } from "@icona/utils";
import type { Config } from "@svgr/core";
import { transform } from "@svgr/core";
import { writeFileSync } from "fs";
import { resolve } from "path";

export const generateReact = (
  icons: IconaIconData[],
  config: GenerateReactConfig,
) => {
  const projectPath = getProjectRootPath();
  const path = config.path || "react";
  const svgrConfig = config.svgrConfig || {};

  // TODO: Name transform option
  icons.forEach(async ({ name, svg }) => {
    makeFolderIfNotExistFromRoot(path);

    const componentName = name
      .replace(/^[a-z]/, (ch) => ch.toUpperCase())
      .replace(/_[a-z]/g, (ch) => ch[1].toUpperCase());

    const component = await transform(svg, svgrConfig as Config, {
      componentName,
    });

    const svgPath = resolve(projectPath, path, `${componentName}.tsx`);

    writeFileSync(svgPath, component, "utf-8");
  });
};
