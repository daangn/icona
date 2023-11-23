#!/usr/bin/env node

import { Command } from "commander";

import pkg from "../package.json" assert { type: "json" };
// import { generateCommand } from "./commands/generate";
import { initCommand } from "./commands/init.js";

const program = new Command();
const version = pkg.version;

program
  .version(version, "-v, --version")
  .description("Generate Stuffs from .icona/icons.json file")
  // .addCommand(generateCommand)
  .addCommand(initCommand)
  .parse(process.argv);
