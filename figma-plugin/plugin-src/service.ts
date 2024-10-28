/* eslint-disable @typescript-eslint/no-shadow */
import type { IconaIconData } from "@icona/types";
import { Base64 } from "js-base64";

import type { PngOptionPayload } from "../common/types";

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
    case "FRAME":
    case "GROUP":
    case "COMPONENT":
    case "INSTANCE":
    case "VECTOR": {
      const svgName = makeComponentName({
        componentSetName: setName,
        componentName: node.name,
        stringCase: "lower",
        separator: "_",
      });

      return { id: node.id, name: svgName, description };
    }

    case "COMPONENT_SET": {
      return node.children.flatMap((child: any) => {
        return findComponentInNode(child, node.name, node.description);
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
      child.type === "INSTANCE" ||
      child.type === "VECTOR" ||
      child.type === "FRAME" ||
      child.type === "GROUP" ||
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

export async function getSvgFromExtractedNodes(nodes: ExtractedNode[]) {
  const datas = await Promise.allSettled(
    nodes.map(async (component) => {
      const node = figma.getNodeById(component.id) as ComponentNode;
      const description = component.description;
      const regex = createRegexWithDelimiters("[", "]");
      const metadatasRegexResult = regex.exec(description || "");

      if (metadatasRegexResult && metadatasRegexResult.length === 2) {
        return {
          name: component.name,
          svg: await node.exportAsync({
            format: "SVG_STRING",
            svgIdAttribute: true,
          }),
          metadatas: metadatasRegexResult[1].split(","),
        };
      }

      return {
        name: component.name,
        svg: await node.exportAsync({
          format: "SVG_STRING",
          svgIdAttribute: true,
        }),
        metadatas: [],
      };
    }),
  );

  const dataMap = datas.reduce((acc, cur) => {
    if (cur.status === "rejected") console.error(cur.reason);
    if (cur.status === "fulfilled") {
      const { name, ...rest } = cur.value as IconaIconData;
      acc[name] = {
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
    result[component.name] = {
      ...result[component.name],
      png: {
        ...pngDatas,
      },
    };
  });

  return result;
}
