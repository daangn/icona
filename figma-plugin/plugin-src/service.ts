/* eslint-disable @typescript-eslint/no-shadow */
import type { IconaIconData } from "@icona/types";
import { Base64 } from "js-base64";

type TargetNode =
  | ComponentNode
  | InstanceNode
  | VectorNode
  | ComponentSetNode
  | FrameNode
  | GroupNode;
type Extracted = {
  id: string;
  name: string;
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
): Extracted | Extracted[] => {
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

      return { id: node.id, name: svgName };
    }

    case "COMPONENT_SET": {
      return node.children.flatMap((child: any) =>
        findComponentInNode(child, node.name),
      );
    }

    default: {
      return [];
    }
  }
};

export async function getAssetInIconFrame(
  iconFrameId: string,
  options?: {
    withPng?: boolean;
  },
): Promise<Record<string, IconaIconData>> {
  const frame = figma.getNodeById(iconFrameId) as FrameNode;

  const withPng = options?.withPng ?? true;

  const targetNodes = frame.children.flatMap((child) => {
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

  const targetComponents = targetNodes.filter((component) => component);

  const datas = await Promise.allSettled(
    targetComponents.map(async (component) => {
      const data = {} as IconaIconData;
      const node = figma.getNodeById(component.id) as ComponentNode;

      // base
      data.style = {
        width: node.width,
        height: node.height,
      };
      data.name = component.name;

      // svg
      const svg = await node.exportAsync({
        format: "SVG_STRING",
        svgIdAttribute: true,
      });
      data.svg = svg;

      // png
      if (withPng) {
        const png = await node.exportAsync({ format: "PNG" });
        const base64String = Base64.fromUint8Array(png);
        data.png = base64String;
      }

      return data;
    }),
  );

  const dataMap = datas.reduce((acc, cur) => {
    if (cur.status === "rejected") {
      console.error(cur.reason);
    }

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
