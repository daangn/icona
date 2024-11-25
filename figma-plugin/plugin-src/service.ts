/* eslint-disable @typescript-eslint/no-shadow */
import type { IconaIconData } from "@icona/types";
import { Base64 } from "js-base64";

import type { PngOptionPayload } from "../common/types";
import { Meta, Tag } from "./constants";
import { stripBeforeIcon } from "./utils";

type TargetNode =
  | ComponentNode
  | InstanceNode
  | VectorNode
  | ComponentSetNode
  | FrameNode
  | GroupNode;
type ExtractedNode = {
  id: string;
  name: string;
  description?: string;
};

const makeComponentName = ({
  componentSetName,
  componentName,
  stringCase,
  separator = "_",
}: {
  componentSetName?: string;
  componentName: string;
  stringCase?: "lower" | "upper";
  separator?: string;
}) => {
  let name = componentName;

  if (componentSetName) {
    // NOTE: componentName = weight=thin, size=big
    const variantValues = componentName.split(",").map((v) => v.split("=")[1]);
    name = `${componentSetName}${separator}${variantValues.join(separator)}`;
  }

  if (stringCase === "lower") return name.toLowerCase();
  if (stringCase === "upper") return name.toUpperCase();
  return name;
};

const findComponentInNode = (
  node: TargetNode,
  setName?: string,
  description?: string,
): ExtractedNode | ExtractedNode[] => {
  switch (node.type) {
    case "FRAME": {
      return node.children.flatMap((child: any) => {
        return findComponentInNode(child, setName, description);
      });
    }

    case "COMPONENT": {
      const svgName = makeComponentName({
        componentSetName: setName,
        componentName: node.name,
        stringCase: "lower",
        separator: "_",
      });

      return {
        id: node.id,
        name: svgName,
        description: description || node.description,
      };
    }

    case "COMPONENT_SET": {
      return node.children.flatMap((child: any) => {
        return findComponentInNode(
          child,
          node.name,
          description || node.description,
        );
      });
    }

    default: {
      return [];
    }
  }
};

export function getAssetFramesInFrame(targetFrame: FrameNode): ExtractedNode[] {
  const targetNodes = targetFrame.children.flatMap((child) => {
    if (
      child.type === "COMPONENT" ||
      child.type === "FRAME" ||
      child.type === "COMPONENT_SET"
    ) {
      return findComponentInNode(child);
    }
    return [];
  });

  return targetNodes.filter((component) => component);
}

function createRegexWithDelimiters(
  startDelimiter: string,
  endDelimiter: string,
): RegExp {
  // 특수 문자 이스케이프 처리
  const escapeRegExp = (string: string) =>
    string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const start = escapeRegExp(startDelimiter);
  const end = escapeRegExp(endDelimiter);

  return new RegExp(`${start}(.*?)${end}`);
}

function extractMetadataFromDescription(description: string) {
  const regex = createRegexWithDelimiters("[", "]");
  const metadatasRegexResult = regex.exec(description);

  if (metadatasRegexResult && metadatasRegexResult.length === 2) {
    return metadatasRegexResult[1].split(",");
  }

  return [];
}

function getMetadatasFromName(name: string) {
  const metadatas = [];

  // 피그마에서 node name 앞에 `.`이 붙어있는 경우에는 `tag:figma-not-published`로 처리
  if (name.startsWith(Meta.figmaNotPublished)) {
    metadatas.push(Tag.figmaNotPublished);
  }

  // 피그마에서 node name에 `[서비스아이콘]`이 포함되어 있는 경우에는 `tag:service`로 처리
  if (name.includes(Meta.service)) {
    metadatas.push(Tag.service);
  }

  // 피그마에서 node name에 `_fat`이 포함되어 있는 경우에는 `tag:fat`로 처리
  if (name.includes(Meta.fat)) {
    metadatas.push(Tag.fat);
  }

  return metadatas;
}

export async function getSvgFromExtractedNodes(nodes: ExtractedNode[]) {
  const datas = await Promise.allSettled(
    nodes.map(async (component) => {
      const name = component.name;
      const node = figma.getNodeById(component.id) as ComponentNode;
      const description = component.description;

      const metadatas = [
        ...extractMetadataFromDescription(description || ""),
        ...getMetadatasFromName(name),
      ];

      return {
        name: stripBeforeIcon(name),
        svg: await node.exportAsync({
          format: "SVG_STRING",
          svgIdAttribute: true,
        }),
        metadatas,
      };
    }),
  );

  const dataMap = datas.reduce((acc, cur) => {
    if (cur.status === "rejected") console.error(cur.reason);
    if (cur.status === "fulfilled") {
      const { name, ...rest } = cur.value as IconaIconData;
      const removedName = stripBeforeIcon(name);
      acc[removedName] = {
        ...rest,
        name,
      };
    }

    return acc;
  }, {} as Record<string, IconaIconData>);

  return dataMap;
}

export async function exportFromIconaIconData(
  nodes: ExtractedNode[],
  iconaData: Record<string, IconaIconData>,
  png: PngOptionPayload,
) {
  const result = iconaData;

  nodes.forEach(async (component) => {
    const node = figma.getNodeById(component.id) as ComponentNode;

    const exportDatas = await Promise.allSettled(
      Object.entries(png).map(async ([key, value]) => {
        const scale = Number(key.replace("x", ""));

        if (!value) {
          return {
            scale: key,
            data: "",
          };
        }

        const exportData = await node.exportAsync({
          format: "PNG",
          constraint: {
            type: "SCALE",
            value: scale,
          },
        });

        const base64String = Base64.fromUint8Array(exportData);

        return {
          scale: key,
          data: base64String,
        };
      }),
    );

    const pngDatas = exportDatas.reduce((acc, cur) => {
      if (cur.status === "rejected") console.error(cur.reason);
      if (cur.status === "fulfilled") {
        const { scale, data } = cur.value as {
          scale: keyof IconaIconData["png"];
          data: string;
        };
        acc[scale] = data;
      }

      return acc;
    }, {} as Record<keyof IconaIconData["png"], string>);

    // name = "icon_name"
    const name = stripBeforeIcon(component.name);
    result[name] = {
      ...result[name],
      png: {
        ...pngDatas,
      },
    };
  });

  return result;
}
