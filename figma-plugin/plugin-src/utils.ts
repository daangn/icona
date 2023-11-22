export async function getLocalData(key: string) {
  const data = await figma.clientStorage.getAsync(key);
  return data;
}

export async function setLocalData(key: string, data: any) {
  await figma.clientStorage.setAsync(key, data);
}
