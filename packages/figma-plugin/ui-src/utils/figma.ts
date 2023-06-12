import type { Messages } from "../../common/types";

/* eslint-disable no-restricted-globals */
export const postMessage = (data: Messages) => {
  parent.postMessage({ pluginMessage: data }, "*");
};
