import type { GenerateDrawableConfig, IconaIconData } from "@icona/types";
import { getProjectRootPath, makeFolderIfNotExistFromRoot } from "@icona/utils";
import { writeFileSync } from "fs";
import { resolve } from "path";
import svg2vectordrawable from "svg2vectordrawable";

/**
 * 
/#FF212124/g, "@color/gray900"
 */

const DRAWABLE_DEFAULT_COLOR = "#FF212124";

export const generateDrawable = (
  icons: IconaIconData[],
  config: GenerateDrawableConfig,
) => {
  const projectPath = getProjectRootPath();
  const path = config.path || "drawable";
  const drawableConfig = config.svg2vectordrawableConfig || {};
  const defaultColor = config.defaultColor || DRAWABLE_DEFAULT_COLOR;

  // TODO: Name transform option
  icons.forEach(async ({ name, svg }) => {
    makeFolderIfNotExistFromRoot(path);

    const drawablePath = resolve(projectPath, path, `${name}.xml`);
    let drawable = await svg2vectordrawable(svg, drawableConfig);

    // NOTE(@junghyeonsu): DRAWABLE_DEFAULT_COLOR = "#FF212124"
    if (defaultColor) {
      drawable.replace(/#FF212124/g, defaultColor);
    }

    writeFileSync(drawablePath, drawable);
  });
};
