import { Command } from "commander";
import findup from "findup-sync";
import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";
import SVGtoPDF from "svg-to-pdfkit";

const ICONS_FILE = ".icona/icons.json";
const ICONS_PATH = findup(ICONS_FILE);
const PROJECT_PATH = path.resolve(path.dirname(findup("package.json")!));

type Svg = string;
type SvgName = string;
type Icons = {
  name: SvgName;
  svg: Svg;
}[];
type Args = {
  path?: string;
};

export const generatePdf = new Command("generate-pdf")
  .option(
    "-p, --path <path>",
    "icons.json file path that will be generated (default: pdf)",
    "pdf",
  )
  .description("Generate PDF from .icona/icons.json file")
  .action((args: Args) => {
    try {
      console.log("Generating PDFs...");

      const pathArg = args.path || "pdf";

      if (!ICONS_PATH) {
        console.log("No icons.json file found");
        return;
      }

      const icons = JSON.parse(fs.readFileSync(ICONS_PATH, "utf-8")) as Icons;

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
