/* eslint-disable no-restricted-globals */
export const postMessage = (data: Record<string, string>) => {
  parent.postMessage(
    {
      pluginMessage: data,
    },
    "*",
  );
};
