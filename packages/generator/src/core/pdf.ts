import type { IconaIconData, PDFConfig } from "@icona/types";
import { createWriteStream } from "fs";
import { resolve } from "path";
import PDFDocument from "pdfkit";
import SVGtoPDF from "svg-to-pdfkit";

import { createBar } from "../utils/bar";
import {
  deleteAllFilesInDir,
  getIconaIconsFile,
  getTargetPath,
  makeFolderIfNotExistFromRoot,
} from "../utils/file";

interface Props {
  /**
   * @description Icona icons data
   * @default .icona/icons.json
   */
  icons?: Record<string, IconaIconData> | null;

  config: PDFConfig;
}

export const generatePDF = (props: Props) => {
  const { config, icons = getIconaIconsFile() } = props;
  const targetPath = getTargetPath(config.path || "pdf");
  const pdfkitConfig = config.pdfKitConfig || {};
  const { x, y, ...restSvgToPdfOptions } = config.svgToPdfOptions || {};

  if (!icons) {
    throw new Error("There is no icons data");
  }

  const iconData = Object.entries(icons);
  if (iconData.length !== 0) {
    makeFolderIfNotExistFromRoot(targetPath);
  }

  if (config.genMode === "recreate") {
    deleteAllFilesInDir(targetPath);
  }

  console.log(`\nPDF Generate in \`${targetPath}\` folder...`);

  const bar = createBar({
    name: "PDF",
    total: iconData.length,
  });

  bar.start();

  // TODO: Name transform option
  for (const [name, data] of iconData) {
    const { svg } = data;
    const svgPath = resolve(targetPath, `${name}.pdf`);

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
    bar.increment();
  }

  bar.stop();
};
