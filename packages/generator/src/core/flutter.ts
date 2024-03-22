import type { GenerateDartConfig } from "@icona/types";
import {
  deleteAllFilesInDir,
  getProjectRootPath,
  makeFolderIfNotExistFromRoot,
} from "@icona/utils";
import { readFileSync, writeFileSync } from "fs";
import type { GlyphSet } from "opentype.js";
import opentype from "opentype.js";
import { resolve } from "path";

interface GenerateDartFunction {
  config: GenerateDartConfig;
}

const dartTemplate = ({
  glyphs,
  fileName,
  fontFamily,
}: {
  glyphs: GlyphSet;
  fileName: GenerateDartConfig["fileName"];
  fontFamily: GenerateDartConfig["fontFamily"];
}) => `/// To use this font, place it in your fonts/ directory and include the
/// following in your pubspec.yaml
///
/// flutter:
///   fonts:
///    - family: ${fontFamily}
///      fonts:
///       - asset: fonts/seed-icon.ttf
///
/// 
///

import 'package:flutter/widgets.dart';
  
class ${fileName} {
  ${fileName}._();

  static const _fontFam = '${fontFamily}';
  static const String? _fontPkg = null;
  ${new Array(glyphs.length)
    .fill(0)
    .map((_, i) => {
      const glyph = glyphs.get(i);
      if (i === 0) return null; // NOTE: There is no glyph at index 0
      if (!glyph) return null;
      const code = glyph?.unicode?.toString(16);
      const name = glyph?.name;
      return `  static const IconData ${name} =
       IconData(0x${code}, fontFamily: _fontFam, fontPackage: _fontPkg);`;
    })
    .join("\n")}
}
`;

/**
 * @description SVG 폴더를 기준으로 폰트 파일들을 생성합니다.
 */
export const generateDart = async ({ config }: GenerateDartFunction) => {
  const {
    genMode,
    path = "flutter",
    ttfPath,
    fileName = "SeedIcons",
    fontFamily = "SeedIcon",
  } = config;

  const projectPath = getProjectRootPath();

  const resolvedTtfPath = resolve(projectPath, ttfPath);
  const resolvedDistPath = resolve(projectPath, path);

  if (!resolvedTtfPath) {
    console.error(
      `\n[@Icona/generator] Dart File need ttf file. Please check ttf file path or You can generate font file with font option`,
    );
    return;
  }

  if (genMode === "recreate") {
    deleteAllFilesInDir(resolve(projectPath, path));
  }

  console.log(`\n[@Icona/generator] Dart Generate in \`${path}\` folder...`);

  const { buffer } = readFileSync(ttfPath);
  const ttf = opentype.parse(buffer);

  const template = dartTemplate({
    glyphs: ttf.glyphs,
    fileName,
    fontFamily,
  });

  // make dart file
  makeFolderIfNotExistFromRoot(path);
  writeFileSync(resolve(resolvedDistPath, `${fileName}.dart`), template);

  console.log(`\n[@Icona/generator] Dart Generate Success!!`);
};
