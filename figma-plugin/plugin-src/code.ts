import { FRAME_NAME, KEY } from "../common/constants";
import { emit } from "../common/fromPlugin";
import {
  listenDeployIcon,
  listenPngOption,
  listenSetGithubApiKey,
  listenSetGithubUrl,
} from "./listeners";
import { getAssetInIconFrame } from "./service";
import { getLocalData } from "./utils";

function sendUserInfo() {
  if (!figma.currentUser) return;

  emit("GET_USER_INFO", {
    id: figma.currentUser.id || "",
    name: figma.currentUser.name,
  });
}

async function sendStorageData() {
  const repoUrl = await getLocalData(KEY.GITHUB_REPO_URL);
  const apiKey = await getLocalData(KEY.GITHUB_API_KEY);
  const deployWithPng = await getLocalData(KEY.DEPLOY_WITH_PNG);

  emit("GET_GITHUB_REPO_URL", { repoUrl });
  emit("GET_GITHUB_API_KEY", { apiKey });
  emit("GET_DEPLOY_WITH_PNG", { deployWithPng });
}

async function setPreviewIcons() {
  const iconaFrame = figma.currentPage.findOne((node) => {
    return node.name === FRAME_NAME;
  });

  if (!iconaFrame) {
    figma.notify("Icona frame not found");
    return;
  } else {
    const svgDatas = await getAssetInIconFrame(iconaFrame.id, {
      withPng: false,
    });

    console.log("svgDatas", svgDatas);

    emit("GET_ICON_PREVIEW", {
      icons: svgDatas,
    });
  }
}

(function main() {
  figma.showUI(__html__, { width: 360, height: 436 });

  sendUserInfo();
  sendStorageData();
  setPreviewIcons();

  listenDeployIcon();
  listenSetGithubApiKey();
  listenSetGithubUrl();
  listenPngOption();
})();
