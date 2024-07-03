import type { IconaIconData, Vue2Config } from "@icona/types";
import { writeFile } from "fs/promises";
import { resolve } from "path";

import { createBar } from "../utils/bar";
import { toPascalCase } from "../utils/case";
import {
  deleteAllFilesInDir,
  getIconaIconsFile,
  getTargetPath,
  makeFolderIfNotExistFromRoot,
} from "../utils/file";
import { generateIndexFileTemplate, ignores } from "../utils/template";

const shimsTemplate = () => `${ignores}\ndeclare module "*.vue" {
  import Vue from 'vue'
  export default Vue
}\n`;

const componentTemplate = (name: string, svg: string) => `${ignores}\n<template>
  ${svg}</template>

<script lang="ts">
export default {
  name: '${name}',
  props: {
    size: {
      type: [Number, String],
      default: 24,
    },
  },
  data() {
    return {
      svg: null as Element | null,
    };
  },
  mounted() {
    this.svg = this.$refs.svg as Element;
  },
};
</script>
`;

interface Props {
  /**
   * @description Icona icons data
   * @default .icona/icons.json
   */
  icons?: Record<string, IconaIconData> | null;
  config: Vue2Config;
}

const createShimFile = async (targetPath: string) => {
  await writeFile(
    resolve(targetPath, "shims-vue.d.ts"),
    shimsTemplate(),
    "utf8",
  );
};

export const generateVue2 = async (props: Props) => {
  const { config, icons = getIconaIconsFile() } = props;
  const targetPath = getTargetPath(config.path || "vue2");
  const { genShimFile, genIndexFile } = config;
  const componentNames = [];

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

  console.log(`\nVue2 Generate in \`${targetPath}\` folder...`);

  const bar = createBar({
    name: "Vue2",
    total: iconData.length,
  });

  bar.start();

  for (const [name, data] of iconData) {
    const { svg } = data;

    const componentName = toPascalCase(name);
    const svgPath = resolve(targetPath, `${componentName}.vue`);
    componentNames.push(componentName);

    // SVG 파일 내용을 Vue 컴포넌트로 변환
    const convertedSvg = svg
      .replace(/width="([^"]+)"/, ':width="size"')
      .replace(/height="([^"]+)"/, ':height="size"');

    const component = componentTemplate(componentName, convertedSvg);

    await writeFile(svgPath, component, "utf-8");

    bar.increment();
  }

  if (genShimFile) {
    await createShimFile(targetPath);
  }

  if (genIndexFile) {
    const content = generateIndexFileTemplate({
      componentNames,
      ext: "vue",
    });
    await writeFile(resolve(targetPath, "index.ts"), content, "utf-8");
  }

  bar.stop();
};
