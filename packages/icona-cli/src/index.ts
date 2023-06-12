#!/usr/bin/env node
import { Command } from "commander";

import pkg from "../package.json" assert { type: "json" };
import { generatePdf } from "./commands/generate-pdf";
import { generateSvg } from "./commands/generate-svg";

const program = new Command();
const version = pkg.version;

program
  .version(version, "-v, --version")
  .description("Generate Stuffs from .icona/icons.json file")
  .addCommand(generateSvg)
  .addCommand(generatePdf)
  .parse(process.argv);
