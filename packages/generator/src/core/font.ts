import type { GenerateFontConfig } from "@icona/types";
import { deleteAllFilesInDir, getProjectRootPath } from "@icona/utils";
import { resolve } from "path";
import svgtofont from "svgtofont";

interface GenerateFontFunction {
  /**
   * @description Icona icons data
   * @default .icona/icons.json
   */
  config: GenerateFontConfig;
}

/**
 * @description SVG 폴더를 기준으로 폰트 파일들을 생성합니다.
 */
export const generateFont = ({ config }: GenerateFontFunction) => {
  const { genMode, svgToFontOptions } = config;

  const projectPath = getProjectRootPath();

  const src = resolve(projectPath, svgToFontOptions?.src || "svg");
  const dist = resolve(projectPath, svgToFontOptions?.dist || "font");
  // NOTE: css 옵션을 넣어주지 않으면 error가 throw됨
  const css = svgToFontOptions?.css || false;

  if (genMode === "recreate") {
    deleteAllFilesInDir(resolve(projectPath, dist));
  }

  console.log(`\nTTF Generate in \`${dist}\` folder...`);

  const options = {
    ...svgToFontOptions,
    src,
    dist,
    css,
  };

  svgtofont(options);
};
