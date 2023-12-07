import type { GeneratePNGConfig, IconaIconData } from "@icona/types";
import {
  deleteAllFilesInDir,
  getIconaIconsFile,
  getProjectRootPath,
  makeFolderIfNotExistFromRoot,
} from "@icona/utils";
import { MultiBar, Presets } from "cli-progress";
import { writeFile } from "fs/promises";
import { join, resolve } from "path";

interface GeneratePNGFunction {
  /**
   * @description Icona icons data
   * @default .icona/icons.json
   */
  icons?: Record<string, IconaIconData> | null;
  config: GeneratePNGConfig;
}

export const generatePNG = async ({
  icons = getIconaIconsFile(),
  config,
}: GeneratePNGFunction) => {
  const projectPath = getProjectRootPath();
  const path = config.path || "png";
  const scales = ["1x", "2x", "3x", "4x"] as const;

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

  console.log(`\nPNG Generate in \`${path}\` folder...`);

  const bar = new MultiBar(
    {
      format: "PNG Generate {scale} | {bar} | {percentage}% | {value}/{total}",
      hideCursor: true,
    },
    Presets.shades_grey,
  );

  const scale1bar = bar.create(iconData.length, 0);
  const scale2bar = bar.create(iconData.length, 0);
  const scale3bar = bar.create(iconData.length, 0);
  const scale4bar = bar.create(iconData.length, 0);

  // TODO: Name transform option
  for (const [name, data] of iconData) {
    for (const scale of scales) {
      const base64 = data.png[scale];
      if (!base64) return;

      const buffer = Buffer.from(base64, "base64");
      const filePath = resolve(projectPath, join(path, scale, `${name}.png`));

      await writeFile(filePath, buffer);

      switch (scale) {
        case "1x":
          scale1bar.increment({ scale });
          break;
        case "2x":
          scale2bar.increment({ scale });
          break;
        case "3x":
          scale3bar.increment({ scale });
          break;
        case "4x":
          scale4bar.increment({ scale });
          break;
      }
    }
  }

  bar.stop();
};
