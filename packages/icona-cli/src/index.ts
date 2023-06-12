#!/usr/bin/env node
import { Command } from "commander";

import pkg from "../package.json" assert { type: "json" };
import { generate } from "./commands/generate-svg";

const program = new Command();
const version = pkg.version;

program
  .version(version, "-v, --version")
  .description("Generate SVG")
  .addCommand(generate)
  .parse(process.argv);
