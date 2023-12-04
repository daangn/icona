import { KEY } from "../common/constants.js";
import { emit } from "../common/fromPlugin.js";
import { on } from "../common/fromUi.js";
import { createGithubClient } from "./github.js";
import { setLocalData } from "./utils.js";

export function listenDeployIcon() {
  on("DEPLOY_ICON", async ({ githubData, icons }) => {
    try {
      const { owner, name, apiKey } = githubData;

      const { createDeployPR } = createGithubClient(owner, name, apiKey);

      await createDeployPR(icons);
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
