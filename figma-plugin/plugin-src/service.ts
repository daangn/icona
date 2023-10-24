import type { IconaIconData } from "@icona/types";

type TargetNode = ComponentNode | InstanceNode | VectorNode | ComponentSetNode;
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

    default:
      return [];
  }
};

export async function getSvgInIconFrame(
  iconFrameId: string,
): Promise<Record<string, IconaIconData>> {
  const frame = figma.getNodeById(iconFrameId) as FrameNode;

  const targetNodes = frame.children.flatMap((child) => {
    if (
      child.type === "COMPONENT" ||
      child.type === "INSTANCE" ||
      child.type === "VECTOR" ||
      child.type === "COMPONENT_SET"
    ) {
      return findComponentInNode(child);
    }
    return [];
  });

  const targetComponents = targetNodes.filter((component) => component);

  const svgs = await Promise.all(
    targetComponents.map(async (component) => {
      const node = figma.getNodeById(component.id) as ComponentNode;
      const svg = await node.exportAsync({
        format: "SVG_STRING",
        svgIdAttribute: true,
      });
      return { name: component.name, svg };
    }),
  );

  const svgsMap = svgs.reduce((acc, cur) => {
    acc[cur.name] = cur;

    return acc;
  }, {} as Record<string, IconaIconData>);

  return svgsMap;
}
