import { KEY } from "../common/constants.js";
import { emit } from "../common/fromPlugin.js";
import {
  listenDeployIcon,
  listenPngOption,
  listenSetGithubApiKey,
  listenSetGithubUrl,
} from "./listeners.js";
import { getAssetFramesInFrame, getSvgFromExtractedNodes } from "./service.js";
import { getIconaFrame, getLocalData } from "./utils.js";

function sendUserInfo() {
  if (!figma.currentUser) return;

  emit("GET_USER_INFO", {
    id: figma.currentUser.id || "",
    name: figma.currentUser.name,
  });
}

/**
 * @note Extracts the filename from the icona frame name
 *
 * @example
 * 1. icona-frame,filename=monochrome,something=1 -> monochrome
 * 2. icona-frame,something=1,filename=monochrome -> monochrome
 */
function sendFileName() {
  const FILENAME_PREFIX = "filename=";
  const iconaFrame = getIconaFrame();
  const fileNamePart = iconaFrame.name.split(",").find((part) => {
    return part.startsWith(FILENAME_PREFIX);
  });
  const fileName = fileNamePart
    ? fileNamePart.replace(FILENAME_PREFIX, "")
    : undefined;

  if (fileName) {
    emit("CHANGE_FILE_NAME", fileName);
  }
}

async function sendStorageData() {
  const repoUrl = await getLocalData(KEY.GITHUB_REPO_URL);
  const apiKey = await getLocalData(KEY.GITHUB_API_KEY);
  const pngOption = await getLocalData(KEY.PNG_OPTIONS);

  emit("GET_GITHUB_REPO_URL", { repoUrl });
  emit("GET_GITHUB_API_KEY", { apiKey });
  emit("GET_DEPLOY_WITH_PNG", {
    options: pngOption || {
      png: { "1x": false, "2x": false, "3x": false, "4x": false },
    },
  });
}

async function setPreviewIcons() {
  const iconaFrame = getIconaFrame();

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
  sendFileName();
  setPreviewIcons();

  listenDeployIcon();
  listenSetGithubApiKey();
  listenSetGithubUrl();
  listenPngOption();
})();

// Listen for changes in the current page
figma.on("currentpagechange", () => {
  sendFileName();
  setPreviewIcons();
});
