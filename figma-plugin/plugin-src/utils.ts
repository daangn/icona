import { FRAME_NAME } from "../common/constants";

export async function getLocalData(key: string) {
  const data = await figma.clientStorage.getAsync(key);
  return data;
}

export async function setLocalData(key: string, data: any) {
  await figma.clientStorage.setAsync(key, data);
}

export function getIconaFrame(): FrameNode {
  const iconaFrame = figma.currentPage.findOne((node) => {
    return node.name.startsWith(FRAME_NAME);
  });

  if (!iconaFrame) {
    figma.notify(`${FRAME_NAME} not found`);
    throw new Error(`${FRAME_NAME} not found`);
  }

  return iconaFrame as FrameNode;
}

/**
 * @description 컴포넌트 이름 맨 앞에 `.`이 붙어있는 경우에는 `.`을 없애요.
 *
 */
export function removeDotPrefix(name: string) {
  return name.startsWith(".") ? name.replace(".", "") : name;
}
