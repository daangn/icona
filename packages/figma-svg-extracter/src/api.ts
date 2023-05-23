import fetch from "cross-fetch";

import type { FigmaDataInterface, GetSvgUrlsInterface } from "./interface.js";

const FIGMA_API_URL = "https://api.figma.com/v1";

export const getComponentsFromNode = async ({
  figmaAccessToken,
  figmaFileKey,
  figmaIconFrameId: nodeId,
}: FigmaDataInterface) => {
  return fetch(`${FIGMA_API_URL}/files/${figmaFileKey}/nodes?ids=${nodeId}`, {
    method: "GET",
    headers: {
      "X-FIGMA-TOKEN": figmaAccessToken,
    },
  }).then((res) => res.json());
};

export const getSvgImages = async ({
  figmaAccessToken,
  figmaFileKey,
  ids,
}: GetSvgUrlsInterface) => {
  return fetch(
    `${FIGMA_API_URL}/images/${figmaFileKey}?ids=${ids}&format=svg`,
    {
      method: "GET",
      headers: {
        "X-FIGMA-TOKEN": figmaAccessToken,
      },
    },
  ).then((res) => res.json());
};
