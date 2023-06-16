#!/usr/bin/env node

import { Command } from "commander";

import pkg from "../package.json" assert { type: "json" };
import { generate } from "./commands/generate";
import { init } from "./commands/init";

const program = new Command();
const version = pkg.version;

program
  .version(version, "-v, --version")
  .description("Generate Stuffs from .icona/icons.json file")
  .addCommand(generate)
  .addCommand(init)
  .parse(process.argv);
