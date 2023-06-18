import type { GenerateSVGConfig, IconaIconData } from "@icona/types";
import { getProjectRootPath, makeFolderIfNotExistFromRoot } from "@icona/utils";
import { writeFileSync } from "fs";
import { resolve } from "path";
import { optimize } from "svgo";

export const generateSVG = (
  icons: IconaIconData[],
  config: GenerateSVGConfig,
) => {
  const projectPath = getProjectRootPath();
  const path = config.path || "svg";
  const svgoConfig = config.svgoConfig || {};

  // TODO: Name transform option
  icons.forEach(({ name, svg }) => {
    makeFolderIfNotExistFromRoot(path);

    const { data: optimizedSvg } = optimize(svg, svgoConfig);
    const svgPath = resolve(projectPath, path, `${name}.svg`);
    writeFileSync(svgPath, optimizedSvg, "utf-8");
  });
};
