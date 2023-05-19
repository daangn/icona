/* eslint-disable no-restricted-globals */
export const postMessage = (data: Record<string, unknown>) => {
  parent.postMessage({ pluginMessage: data }, "*");
};
