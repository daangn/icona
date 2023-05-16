import { ACTION, DATA } from "../constants";

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
function init() {
  getLocalData(DATA.GITHUB_API_KEY).then((apiKey) => {
    figma.ui.postMessage({ type: ACTION.GET_GITHUB_API_KEY, apiKey });
  });
  getLocalData(DATA.GITHUB_REPO_URL).then((repoUrl) => {
    figma.ui.postMessage({ type: ACTION.GET_GITHUB_REPO_URL, repoUrl });
  });
  // getLocalData("webhookData").then((webhookData) => {
  //   figma.ui.postMessage({ type: "webhookDataGot", webhookData });
  // });
}

figma.ui.onmessage = (msg) => {
  switch (msg.type) {
    case ACTION.SET_GITHUB_REPO_URL:
      setLocalData(DATA.GITHUB_REPO_URL, msg.repoUrl);
      break;

    case ACTION.SET_GITHUB_API_KEY:
      setLocalData(DATA.GITHUB_API_KEY, msg.apiKey);
      break;

    // case "setWebhookData":
    //   setLocalData("webhookData", msg.webhookData);
    //   break;

    case "cancel":
      figma.closePlugin();
      break;
  }
};

init();
