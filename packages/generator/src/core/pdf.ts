import type { GeneratePDFConfig, IconaIconData } from "@icona/types";
import {
  deleteAllFilesInDir,
  getIconaIconsFile,
  getProjectRootPath,
  makeFolderIfNotExistFromRoot,
} from "@icona/utils";
import { createWriteStream } from "fs";
import { resolve } from "path";
import PDFDocument from "pdfkit";
import SVGtoPDF from "svg-to-pdfkit";

interface GeneratePDFFunction {
  /**
   * @description Icona icons data
   * @default .icona/icons.json
   */
  icons?: Record<string, IconaIconData> | null;
  config: GeneratePDFConfig;
}

export const generatePDF = ({
  icons = getIconaIconsFile(),
  config,
}: GeneratePDFFunction) => {
  const projectPath = getProjectRootPath();
  const path = config.path || "pdf";
  const pdfkitConfig = config.pdfKitConfig || {};
  const { x, y, ...restSvgToPdfOptions } = config.svgToPdfOptions || {};

  if (!icons) {
    throw new Error("There is no icons data");
  }

  const iconData = Object.entries(icons);
  if (iconData.length !== 0) {
    makeFolderIfNotExistFromRoot(path);
  }

  if (config.genMode === "recreate") {
    deleteAllFilesInDir(resolve(projectPath, path));
  }

  // TODO: Name transform option
  iconData.forEach(async ([name, data]) => {
    const { svg } = data;
    const svgPath = resolve(projectPath, path, `${name}.pdf`);

    /**
     * @see https://github.com/foliojs/pdfkit/blob/4ec77ddc8c090c8d0d57fbd72cff433e9ce0d733/docs/getting_started.md?plain=1#L194
     * @description
     * If you use `info` option, pdf output will be different every time.
     * So it occur git diff. So we use default info option.
     *
     * If user want change info option, they can change it.
     * But not recommend.
     */
    const defaultPdfkitConfigInfo = {
      Author: "Icona",
      Creator: "Icona",
      Producer: "Icona",
      Title: name,
      Subject: name,
      Keywords: name,
      CreationDate: new Date(0),
      ModDate: new Date(0),
    };

    const pdfkitConfigInfo = pdfkitConfig.info || defaultPdfkitConfigInfo;
    const pdfDoc = new PDFDocument({
      ...pdfkitConfig,
      info: pdfkitConfigInfo,
    });

    SVGtoPDF(pdfDoc, svg, x, y, restSvgToPdfOptions);
    pdfDoc.pipe(createWriteStream(svgPath));
    pdfDoc.end();
  });
};
