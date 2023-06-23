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
  icons?: IconaIconData[] | null;
  config: GeneratePDFConfig;
}

export const generatePDF = ({
  icons = getIconaIconsFile(),
  config,
}: GeneratePDFFunction) => {
  const projectPath = getProjectRootPath();
  const path = config.path || "pdf";
  const pdfkitConfig = config.pdfKitConfig || {};

  if (!icons) {
    throw new Error("There is no icons data");
  }

  // TODO: Name transform option
  icons.forEach(async ({ name, svg }) => {
    makeFolderIfNotExistFromRoot(path);

    const svgPath = resolve(projectPath, path, `${name}.pdf`);
    const pdfDoc = new PDFDocument(pdfkitConfig);
    SVGtoPDF(pdfDoc, svg, 0, 0);
    pdfDoc.pipe(createWriteStream(svgPath));
  });
};
