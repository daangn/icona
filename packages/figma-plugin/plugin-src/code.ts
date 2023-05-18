import { ACTION, DATA } from "../constants";
import { getClient } from "./github";

figma.showUI(__html__, { width: 320, height: 436 });

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
  if (iconFrame) {
    figma.ui.postMessage({
      type: ACTION.GET_ICON_FRAME_ID,
      payload: frameId,
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

    case ACTION.PUSH_GITHUB_REPO:
      const owner = msg.payload.owner;
      const name = msg.payload.name;
      const apiKey = msg.payload.apiKey;
      const content = msg.payload.content;

      const { sync } = getClient(owner, name, apiKey);
      sync("main", content);
      break;

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
