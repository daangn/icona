import { FRAME_NAME, KEY } from "../common/constants.js";
import { emit } from "../common/fromPlugin.js";
import { on } from "../common/fromUi.js";
import { createGithubClient } from "./github.js";
import { exportFromIconaIconData, getAssetFramesInFrame } from "./service.js";
import { setLocalData } from "./utils.js";

export function listenDeployIcon() {
  on("DEPLOY_ICON", async ({ githubData, icons, options }) => {
    try {
      const { owner, name, apiKey } = githubData;
      const pngOption = options.png;

      const { createDeployPR } = createGithubClient(owner, name, apiKey);

      const iconaFrame = figma.currentPage.findOne((node) => {
        return node.name === FRAME_NAME;
      });

      if (!iconaFrame) {
        figma.notify("Icona frame not found");
        return;
      }

      const targetFrame = figma.getNodeById(iconaFrame.id) as FrameNode;
      const assetFrames = getAssetFramesInFrame(targetFrame);

      const iconaData = await exportFromIconaIconData(assetFrames, icons, {
        png: pngOption,
      });

      await createDeployPR(iconaData);

      emit("DEPLOY_DONE", null);
      figma.notify("Icons deployed", { timeout: 5000 });
    } catch (error) {
      figma.notify("Error while deploying icons", {
        timeout: 5000,
        error: true,
      });
      emit("DEPLOY_DONE", null);
    }
  });
}

export function listenSetGithubApiKey() {
  on("SET_GITHUB_API_KEY", ({ apiKey }) => {
    setLocalData(KEY.GITHUB_API_KEY, apiKey);
  });
}

export function listenSetGithubUrl() {
  on("SET_GITHUB_URL", ({ url }) => {
    setLocalData(KEY.GITHUB_REPO_URL, url);
  });
}

export function listenPngOption() {
  on("SET_PNG_OPTIONS", ({ options }) => {
    setLocalData(KEY.PNG_OPTIONS, options);
  });
}
