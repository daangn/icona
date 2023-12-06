import { FRAME_NAME, KEY } from "../common/constants";
import { emit } from "../common/fromPlugin";
import {
  listenDeployIcon,
  listenPngOption,
  listenSetGithubApiKey,
  listenSetGithubUrl,
} from "./listeners";
import { getAssetFramesInFrame, getSvgFromExtractedNodes } from "./service";
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
  const pngOption = await getLocalData(KEY.PNG_OPTION);

  emit("GET_GITHUB_REPO_URL", { repoUrl });
  emit("GET_GITHUB_API_KEY", { apiKey });
  emit("GET_DEPLOY_WITH_PNG", {
    options: pngOption || {
      png: { x1: false, x2: false, x3: false, x4: false },
    },
  });
}

async function setPreviewIcons() {
  const iconaFrame = figma.currentPage.findOne((node) => {
    return node.name === FRAME_NAME;
  });

  if (!iconaFrame) {
    figma.notify("Icona frame not found");
    return;
  } else {
    const targetFrame = figma.getNodeById(iconaFrame.id) as FrameNode;
    const assetFrames = getAssetFramesInFrame(targetFrame);
    const datas = await getSvgFromExtractedNodes(assetFrames);

    emit("GET_ICON_PREVIEW", { icons: datas });
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
