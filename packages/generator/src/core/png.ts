import type { GeneratePNGConfig, IconaIconData } from "@icona/types";
import {
  deleteAllFilesInDir,
  getIconaIconsFile,
  getProjectRootPath,
  makeFolderIfNotExistFromRoot,
} from "@icona/utils";
import { writeFileSync } from "fs";
import { join, resolve } from "path";

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
  const scales = ["x1", "x2", "x3", "x4"] as const;

  if (!icons) {
    throw new Error("There is no icons data");
  }

  const iconData = Object.entries(icons);
  if (iconData.length !== 0) {
    makeFolderIfNotExistFromRoot(path);
    scales.forEach((scale) => {
      makeFolderIfNotExistFromRoot(join(path, scale));
    });
  }

  if (config.genMode === "recreate") {
    scales.forEach((scale) => {
      deleteAllFilesInDir(resolve(projectPath, join(path, scale)));
    });
  }

  // TODO: Name transform option
  iconData.forEach(([name, data]) => {
    scales.forEach((scale) => {
      const base64 = data.png[scale];
      if (!base64) return;

      const buffer = Buffer.from(base64, "base64");
      const filePath = resolve(projectPath, join(path, scale, `${name}.png`));

      writeFileSync(filePath, buffer);
    });
  });
};
