import type { GenerateSVGConfig, IconaIconData } from "@icona/types";
import {
  getIconaIconsFile,
  getProjectRootPath,
  makeFolderIfNotExistFromRoot,
} from "@icona/utils";
import { writeFileSync } from "fs";
import { resolve } from "path";
import { optimize } from "svgo";

interface GenerateSVGFunction {
  /**
   * @description Icona icons data
   * @default .icona/icons.json
   */
  icons?: Record<string, IconaIconData> | null;
  config: GenerateSVGConfig;
}

export const generateSVG = ({
  icons = getIconaIconsFile(),
  config,
}: GenerateSVGFunction) => {
  const projectPath = getProjectRootPath();
  const path = config.path || "svg";
  const svgoConfig = config.svgoConfig || {};

  if (!icons) {
    throw new Error("There is no icons data");
  }

  // TODO: Name transform option
  Object.entries(icons).forEach(([name, data]) => {
    const { svg } = data;
    makeFolderIfNotExistFromRoot(path);

    const { data: optimizedSvg } = optimize(svg, svgoConfig);
    const svgPath = resolve(projectPath, path, `${name}.svg`);
    writeFileSync(svgPath, optimizedSvg, "utf-8");
  });
};
