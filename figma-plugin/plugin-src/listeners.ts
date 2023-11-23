import { FRAME_NAME, KEY } from "../common/constants.js";
import { emit } from "../common/fromPlugin.js";
import { on } from "../common/fromUi.js";
import { createGithubClient } from "./github.js";
import { getAssetInIconFrame } from "./service.js";
import { setLocalData } from "./utils.js";

export function listenDeployIcon() {
  on("DEPLOY_ICON", async ({ githubData, options }) => {
    const { withPng } = options ?? { withPng: true };

    try {
      const { owner, name, apiKey } = githubData;

      const { createDeployPR } = createGithubClient(owner, name, apiKey);
      const iconaFrame = figma.currentPage.findOne((node) => {
        return node.name === FRAME_NAME;
      });

      if (!iconaFrame) throw new Error("Icona frame not found");
      const svgs = await getAssetInIconFrame(iconaFrame.id, {
        withPng,
      });

      await createDeployPR(svgs);
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
  on("SET_PNG_OPTION", ({ withPng }) => {
    setLocalData(KEY.DEPLOY_WITH_PNG, withPng);
  });
}
