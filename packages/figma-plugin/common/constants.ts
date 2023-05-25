export const ACTION = {
  GET_GITHUB_REPO_URL: "get-github-repo-url",
  GET_GITHUB_API_KEY: "get-github-api-key",
  GET_ICON_FRAME_ID: "get-icon-frame-id",
  GET_FIGMA_FILE_URL: "get-figma-file-url",
  GET_ICON_PREVIEW: "get-icon-preview",

  SET_GITHUB_REPO_URL: "set-github-repo-url",
  SET_GITHUB_API_KEY: "set-github-api-key",
  SET_ICON_FRAME_ID: "set-icon-frame-id",
  SET_FIGMA_FILE_URL: "set-figma-file-url",

  CREATE_ICON_FRAME: "create-icon-frame",

  SETTING_DONE: "setting-done",

  DEPLOY_ICON: "deploy-icon",
  DEPLOY_ICON_STATUS: "deploy-icon-status",
} as const;

export const DATA = {
  GITHUB_API_KEY: "github-api-key",
  GITHUB_REPO_URL: "github-repo-url",

  ICON_FRAME_ID: "icon-frame",
  FIGMA_FILE_URL: "figma-file-url",
} as const;

export const STATUS = {
  IDLE: "idle",
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
} as const;
