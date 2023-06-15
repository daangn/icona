import type { GeneratePDFConfig, IconaIconData } from "@icona/types";
import { getProjectRootPath, makeFolderIfNotExistFromRoot } from "@icona/utils";
import { createWriteStream } from "fs";
import { resolve } from "path";
import PDFDocument from "pdfkit";
import SVGtoPDF from "svg-to-pdfkit";

/**
 * 
{
      size: [24, 24],
      margin: 0,
    }
 */

export const generatePDF = (
  icons: IconaIconData[],
  config: GeneratePDFConfig,
) => {
  const projectPath = getProjectRootPath();
  const path = config.path || "pdf";
  const pdfkitConfig = config.pdfKitConfig || {};

  // TODO: Name transform option
  icons.forEach(async ({ name, svg }) => {
    makeFolderIfNotExistFromRoot(path);

    const svgPath = resolve(projectPath, path, `${name}.pdf`);
    const pdfDoc = new PDFDocument(pdfkitConfig);
    SVGtoPDF(pdfDoc, svg, 0, 0);
    pdfDoc.pipe(createWriteStream(svgPath));
  });
};
