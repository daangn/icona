import { getComponentsFromNode, getSvgImages } from "./api.js";
import type { FigmaDataInterface, GetSvgUrlsInterface } from "./interface.js";

interface ComponentData {
  id: string;
  name: string;
}

const findComponentChild = (node: any, name?: string) => {
  if (node.type === "COMPONENT") {
    if (name) return { id: node.id, name: `${name}/${node.name}` };
    return { id: node.id, name: node.name };
  } else if (node.type === "COMPONENT_SET") {
    return node.children.flatMap((child: any) =>
      findComponentChild(child, node.name),
    );
  } else if (node.children) {
    return node.children.flatMap((child: any) => findComponentChild(child));
  } else {
    return null;
  }
};

export const extractComponentDataFromNode = async ({
  figmaAccessToken,
  figmaFileKey,
  figmaIconFrameId: nodeId,
}: FigmaDataInterface) => {
  const components = (await getComponentsFromNode({
    figmaAccessToken,
    figmaFileKey,
    figmaIconFrameId: nodeId,
  })) as any; //TODO: type

  const childs = components.nodes[nodeId].document.children;
  const childsData = childs.flatMap((child: any) => findComponentChild(child));
  const componentDatas = childsData.map((child: any) => ({
    id: child.id,
    name: child.name,
  })) as ComponentData[];
  return componentDatas;
};

interface ExtractSvgImagesResponse {
  images: {
    [id: string]: string;
  };
}
export const extractSvgImages = async (props: GetSvgUrlsInterface) => {
  const svgUrls = (await getSvgImages(props)) as ExtractSvgImagesResponse;
  return svgUrls.images;
};
