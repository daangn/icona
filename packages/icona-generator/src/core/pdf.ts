import type { GeneratePDFConfig, IconaIconData } from "@icona/types";
import {
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

  // TODO: Name transform option
  Object.entries(icons).forEach(async ([name, data]) => {
    const { svg } = data;
    makeFolderIfNotExistFromRoot(path);

    const svgPath = resolve(projectPath, path, `${name}.pdf`);
    const pdfDoc = new PDFDocument(pdfkitConfig);
    SVGtoPDF(pdfDoc, svg, x, y, restSvgToPdfOptions);
    pdfDoc.pipe(createWriteStream(svgPath));
    pdfDoc.end();
  });
};
