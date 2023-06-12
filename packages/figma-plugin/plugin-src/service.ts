import type { IconData } from "../common/types";

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

// FIXME:(june): 인스턴스 타입 들어왔을 때 처리
const findComponentInNode = (
  node: ComponentSetNode | ComponentNode | FrameNode,
  setName?: string,
): any => {
  if (node.type === "COMPONENT") {
    const svgName = makeComponentName({
      componentSetName: setName,
      componentName: node.name,
      stringCase: "lower",
      separator: "_",
    });

    return { id: node.id, name: svgName };
  } else if (node.type === "COMPONENT_SET") {
    return node.children.flatMap((child: any) =>
      findComponentInNode(child, node.name),
    );
  } else if (node.children) {
    return node.children.flatMap((child: any) => findComponentInNode(child));
  } else {
    return null;
  }
};

export async function getSvgInIconFrame(
  iconFrameId: string,
): Promise<IconData[]> {
  const frame = figma.getNodeById(iconFrameId) as FrameNode;

  const components = findComponentInNode(frame) as {
    id: string;
    name: string;
  }[];

  const filteredComponents = components.filter((component) => component);

  const svgs = await Promise.all(
    filteredComponents.map(async (component) => {
      const node = figma.getNodeById(component.id) as ComponentNode;
      const svg = await node.exportAsync({
        format: "SVG_STRING",
        svgIdAttribute: true,
      });
      return { name: component.name, svg };
    }),
  );

  return svgs;
}
