/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-shadow */
import { ACTION, DATA } from "../common/constants";
import type { GithubData } from "../common/types";
import { createGithubClient } from "./github";
import { getSvgInIconFrame } from "./service";

figma.showUI(__html__, { width: 360, height: 436 });

// get github settings
function getLocalData(key: string) {
  return figma.clientStorage.getAsync(key);
}

// set github settings
function setLocalData(key: string, data: string) {
  figma.clientStorage.setAsync(key, data);
}

// send github data to UI
async function init() {
  const events = [
    {
      data: DATA.GITHUB_API_KEY,
      type: ACTION.GET_GITHUB_API_KEY,
    },
    {
      data: DATA.GITHUB_REPO_URL,
      type: ACTION.GET_GITHUB_REPO_URL,
    },
    {
      data: DATA.FIGMA_FILE_URL,
      type: ACTION.GET_FIGMA_FILE_URL,
    },
  ];

  events.forEach((event) => {
    getLocalData(event.data).then((payload) => {
      figma.ui.postMessage({ type: event.type, payload });
    });
  });

  const frameId = await getLocalData(DATA.ICON_FRAME_ID);
  const iconFrame = figma.getNodeById(frameId);

  // NOTE: iconFrame이 없으면 빈 문자열을 보내준다.
  if (iconFrame) {
    const svgDatas = await getSvgInIconFrame(frameId);
    figma.ui.postMessage({
      type: ACTION.GET_ICON_FRAME_ID,
      payload: frameId,
    });
    figma.ui.postMessage({
      type: ACTION.GET_ICON_PREVIEW,
      payload: svgDatas,
    });
  } else {
    setLocalData(DATA.ICON_FRAME_ID, "");
    figma.ui.postMessage({
      type: ACTION.GET_ICON_FRAME_ID,
      payload: "",
    });
  }
}

figma.ui.onmessage = async (msg) => {
  switch (msg.type) {
    case ACTION.SET_GITHUB_REPO_URL:
      setLocalData(DATA.GITHUB_REPO_URL, msg.payload);
      break;

    case ACTION.SET_GITHUB_API_KEY:
      setLocalData(DATA.GITHUB_API_KEY, msg.payload);
      break;

    case ACTION.SET_FIGMA_FILE_URL:
      setLocalData(DATA.FIGMA_FILE_URL, msg.payload);
      break;

    case ACTION.SET_ICON_FRAME_ID:
      setLocalData(DATA.ICON_FRAME_ID, msg.payload);
      break;

    case ACTION.SETTING_DONE: {
      const { githubData, figmaFileKey, iconFrameId } = msg.payload as {
        githubData: GithubData;
        iconFrameId: string;
        figmaFileKey: string;
      };
      const { owner, name, apiKey } = githubData;
      const { createSettingPR } = createGithubClient(owner, name, apiKey);
      createSettingPR({ figmaFileKey, iconFrameId });
      break;
    }

    case ACTION.DEPLOY_ICON: {
      const { githubData, iconFrameId } = msg.payload as {
        githubData: GithubData;
        iconFrameId: string;
      };
      const { owner, name, apiKey } = githubData;
      const { createDeployPR } = createGithubClient(owner, name, apiKey);
      const svgs = await getSvgInIconFrame(iconFrameId);
      createDeployPR(svgs);
      break;
    }

    case ACTION.CREATE_ICON_FRAME:
      const frameId = await getLocalData(DATA.ICON_FRAME_ID);
      const iconFrame = figma.getNodeById(frameId);
      if (iconFrame) {
        figma.notify("Icon frame already exists");
        return;
      }

      const frame = figma.createFrame();

      frame.resize(300, 300);
      frame.name = "icon-frame";

      setLocalData(DATA.ICON_FRAME_ID, frame.id);
      figma.ui.postMessage({
        type: ACTION.GET_ICON_FRAME_ID,
        payload: frame.id,
      });
      break;

    case "cancel":
      figma.closePlugin();
      break;
  }
};

init();
