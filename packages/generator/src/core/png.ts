import type { GeneratePNGConfig, IconaIconData } from "@icona/types";
import {
  deleteAllFilesInDir,
  getIconaIconsFile,
  getProjectRootPath,
  makeFolderIfNotExistFromRoot,
} from "@icona/utils";
import { writeFileSync } from "fs";
import { resolve } from "path";

interface GeneratePNGFunction {
  /**
   * @description Icona icons data
   * @default .icona/icons.json
   */
  icons?: Record<string, IconaIconData> | null;
  config: GeneratePNGConfig;
}

export const generatePNG = ({
  icons = getIconaIconsFile(),
  config,
}: GeneratePNGFunction) => {
  const projectPath = getProjectRootPath();
  const path = config.path || "png";

  if (!icons) {
    throw new Error("There is no icons data");
  }

  if (config.genMode === "recreate") {
    deleteAllFilesInDir(resolve(projectPath, path));
  }

  // TODO: Name transform option
  Object.entries(icons).forEach(([name, data]) => {
    const { png } = data;
    if (!png) return;

    makeFolderIfNotExistFromRoot(path);
    const buffer = Buffer.from(png, "base64");
    const pngPath = resolve(projectPath, path, `${name}.png`);
    writeFileSync(pngPath, buffer);
  });
};
