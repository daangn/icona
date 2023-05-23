/* eslint-disable @typescript-eslint/no-shadow */
import fetch from "node-fetch";

import * as core from "./core.js";
import type { FigmaDataInterface } from "./interface.js";

const svgExtracter = (props: FigmaDataInterface) => {
  const extractSvg = async () => {
    const datas = await core.extractComponentDataFromNode(props);
    const ids = datas.map((component) => component.id).join(",");
    const svgImages = await core.extractSvgImages({
      figmaAccessToken: props.figmaAccessToken,
      figmaFileKey: props.figmaFileKey,
      ids,
    });

    const svgImagesWithNames = Object.entries(svgImages).map(
      ([id, svgImageUrl]) => {
        const data = datas.find((data) => data.id === id);
        return {
          name: data?.name,
          svgImageUrl,
        };
      },
    );

    const svgs = Promise.all(
      svgImagesWithNames.map(async (svgImageWithName) => {
        const svg = await fetch(svgImageWithName.svgImageUrl).then((res) =>
          res.text(),
        );
        return {
          name: svgImageWithName.name!,
          svg,
        };
      }),
    );

    return svgs;
  };

  return {
    extractSvg,
  };
};

export { svgExtracter };
