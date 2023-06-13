import type { IconaIconData } from "@icona/types";
import { Command } from "commander";
import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";
import SVGtoPDF from "svg-to-pdfkit";

import { ICONS_PATH, PROJECT_PATH } from "../constants";

interface GeneratePdfCommandArgs {
  path?: string;
}

export const generatePdf = new Command("generate-pdf")
  .option(
    "-p, --path <path>",
    "icons.json file path that will be generated (default: pdf)",
    "pdf",
  )
  .description("Generate PDF from .icona/icons.json file")
  .action((args: GeneratePdfCommandArgs) => {
    try {
      console.log("Generating PDFs...");

      const pathArg = args.path || "pdf";

      if (!ICONS_PATH) {
        console.log("No icons.json file found");
        return;
      }

      const icons = JSON.parse(
        fs.readFileSync(ICONS_PATH, "utf-8"),
      ) as IconaIconData[];

      icons.forEach(({ name, svg }) => {
        if (!fs.existsSync(path.resolve(PROJECT_PATH, pathArg))) {
          fs.mkdirSync(path.resolve(PROJECT_PATH, pathArg));
        }

        const svgPath = path.resolve(PROJECT_PATH, pathArg, `${name}.pdf`);
        const pdfDoc = new PDFDocument({
          size: [24, 24],
          margin: 0,
        });
        SVGtoPDF(pdfDoc, svg, 0, 0);
        pdfDoc.pipe(fs.createWriteStream(svgPath));
      });

      console.log(`PDFs generated in ${pathArg}`);
    } catch (error) {
      console.error(error);
    }
  });
