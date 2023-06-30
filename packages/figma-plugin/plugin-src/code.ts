/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-shadow */
import { ACTION, DATA, STATUS } from "../common/constants";
import type { Messages } from "../common/types";
import { createGithubClient } from "./github";
import { getSvgInIconFrame } from "./service";

figma.showUI(__html__, { width: 360, height: 436 });

// get github settings
async function getLocalData(key: string) {
  const data = await figma.clientStorage.getAsync(key);
  return data;
}

// set github settings
async function setLocalData(key: string, data: any) {
  await figma.clientStorage.setAsync(key, data);
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

  const iconaFrame = figma.currentPage.findOne((node) => {
    return node.name === DATA.ICON_FRAME_ID;
  });

  if (!iconaFrame) {
    figma.notify("Icona frame not found");
    return;
  } else {
    const svgDatas = await getSvgInIconFrame(iconaFrame.id);

    figma.ui.postMessage({
      type: ACTION.GET_ICON_PREVIEW,
      payload: svgDatas,
    });
  }
}

figma.ui.onmessage = async (msg: Messages) => {
  switch (msg.type) {
    case ACTION.SET_GITHUB_REPO_URL:
      if (!msg.payload) return;
      setLocalData(DATA.GITHUB_REPO_URL, msg.payload);
      break;

    case ACTION.SET_GITHUB_API_KEY:
      if (!msg.payload) return;
      setLocalData(DATA.GITHUB_API_KEY, msg.payload);
      break;

    case ACTION.SET_FIGMA_FILE_URL:
      if (!msg.payload) return;
      setLocalData(DATA.FIGMA_FILE_URL, msg.payload);
      break;

    case ACTION.SETTING_DONE: {
      figma.ui.postMessage({
        type: ACTION.SETTING_DONE_STATUS,
        payload: STATUS.LOADING,
      });
      const { owner, name, apiKey } = msg.payload;
      const { createSettingPR } = createGithubClient(owner, name, apiKey);

      try {
        await createSettingPR();
        figma.ui.postMessage({
          type: ACTION.SETTING_DONE_STATUS,
          payload: STATUS.SUCCESS,
        });
        setTimeout(() => {
          figma.ui.postMessage({
            type: ACTION.SETTING_DONE_STATUS,
            payload: STATUS.IDLE,
          });
        }, 3000);
      } catch (error) {
        figma.ui.postMessage({
          type: ACTION.SETTING_DONE_STATUS,
          payload: STATUS.ERROR,
        });
        setTimeout(() => {
          figma.ui.postMessage({
            type: ACTION.SETTING_DONE_STATUS,
            payload: STATUS.IDLE,
          });
        }, 3000);
      }
      break;
    }

    case ACTION.DEPLOY_ICON: {
      figma.ui.postMessage({
        type: ACTION.DEPLOY_ICON_STATUS,
        payload: STATUS.LOADING,
      });
      const { githubData } = msg.payload;

      try {
        const { owner, name, apiKey } = githubData;
        const { createDeployPR } = createGithubClient(owner, name, apiKey);
        const iconaFrame = figma.currentPage.findOne((node) => {
          return node.name === DATA.ICON_FRAME_ID;
        });

        if (!iconaFrame) throw new Error("Icona frame not found");
        const svgs = await getSvgInIconFrame(iconaFrame.id);

        await createDeployPR(svgs);
        figma.ui.postMessage({
          type: ACTION.DEPLOY_ICON_STATUS,
          payload: STATUS.SUCCESS,
        });
        setTimeout(() => {
          figma.ui.postMessage({
            type: ACTION.DEPLOY_ICON_STATUS,
            payload: STATUS.IDLE,
          });
        }, 3000);
      } catch (error) {
        figma.ui.postMessage({
          type: ACTION.DEPLOY_ICON_STATUS,
          payload: STATUS.ERROR,
        });
        setTimeout(() => {
          figma.ui.postMessage({
            type: ACTION.DEPLOY_ICON_STATUS,
            payload: STATUS.IDLE,
          });
        }, 3000);
      }
      break;
    }

    // case "cancel":
    // figma.closePlugin();
    // break;
  }
};

init();
