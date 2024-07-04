import type { IconaIconData, Vue3Config } from "@icona/types";
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
import {
  generateIndexFileTemplate,
  ignores,
  vueIgnores,
} from "../utils/template";

const shimsTemplate = () => `${ignores}\ndeclare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}\n`;

// Vue 컴포넌트 템플릿
const componentTemplate = (
  name: string,
  svg: string,
) => `${vueIgnores}\n<template>
  ${svg}</template>

<script lang="ts">
import { defineComponent, ref, type PropType } from 'vue';

export default defineComponent({
  name: '${name}',
  props: {
    size: {
      type: [Number, String] as PropType<number | string>,
      default: 24,
    },
  },
  setup(props) {
    const svg = ref<SVGSVGElement | null>(null);

    return {
      svg,
      size: props.size,
    };
  },
});
</script>
`;

interface Props {
  /**
   * @description Icona icons data
   * @default .icona/icons.json
   */
  icons?: Record<string, IconaIconData> | null;
  config: Vue3Config;
}

const createShimFile = async (targetPath: string) => {
  await writeFile(
    resolve(targetPath, "shims-vue.d.ts"),
    shimsTemplate(),
    "utf8",
  );
};

export const generateVue3 = async (props: Props) => {
  const { config, icons = getIconaIconsFile() } = props;
  const targetPath = getTargetPath(config.path || "vue3");
  const { genShimFile, genIndexFile, attributes } = config;
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

  console.log(`\nVue3 Generate in \`${targetPath}\` folder...`);

  const bar = createBar({
    name: "Vue3",
    total: iconData.length,
  });

  bar.start();

  for (const [name, data] of iconData) {
    const { svg } = data;

    const componentName = toPascalCase(name);
    const svgPath = resolve(targetPath, `${componentName}.vue`);
    componentNames.push(componentName);

    const attributesString = Object.entries(attributes || {})
      .map(([key, value]) => `${key}="${value}"`)
      .join(" ");

    // SVG 파일 내용을 Vue 컴포넌트로 변환
    const convertedSvg = svg
      .replace(/<svg/, `<svg ${attributesString}`)
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
