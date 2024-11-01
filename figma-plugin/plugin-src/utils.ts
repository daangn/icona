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
 * @param name .icon_name or ❌icon_name
 * @returns icon_name
 * @description `icon` 앞에 있는 내용들은 전부 제거 후 반환
 */
export function stripBeforeIcon(name: string) {
  if (name.includes("icon")) {
    return name.replace(/.*icon/, "icon");
  }

  return name;
}
