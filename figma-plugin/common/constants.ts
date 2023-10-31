export const ACTION = {
  GET_USER_INFO: "get-user-info",

  GET_GITHUB_REPO_URL: "get-github-repo-url",
  GET_GITHUB_API_KEY: "get-github-api-key",
  GET_ICON_PREVIEW: "get-icon-preview",

  SET_GITHUB_REPO_URL: "set-github-repo-url",
  SET_GITHUB_API_KEY: "set-github-api-key",

  DEPLOY_ICON: "deploy-icon",
  DEPLOY_ICON_STATUS: "deploy-icon-status",
} as const;

export const DATA = {
  GITHUB_API_KEY: "github-api-key",
  GITHUB_REPO_URL: "github-repo-url",

  ICON_FRAME_ID: "icona-frame",
} as const;

export const STATUS = {
  IDLE: "idle",
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
} as const;
