import type { IconaIconData } from "@icona/types";

import type { ACTION, STATUS } from "./constants";

export interface GithubData {
  owner: string;
  name: string;
  apiKey: string;
}

export interface IconaMetaData {
  githubData: GithubData;
}

export type Status = `${(typeof STATUS)[keyof typeof STATUS]}`;

export type Messages =
  | { type: `${typeof ACTION.GET_GITHUB_API_KEY}`; payload: string }
  | { type: `${typeof ACTION.GET_FIGMA_FILE_URL}`; payload: string }
  | { type: `${typeof ACTION.GET_GITHUB_REPO_URL}`; payload: string }
  | { type: `${typeof ACTION.GET_ICON_PREVIEW}`; payload: IconaIconData[] }
  | { type: `${typeof ACTION.SET_GITHUB_API_KEY}`; payload: string }
  | { type: `${typeof ACTION.SET_FIGMA_FILE_URL}`; payload: string }
  | { type: `${typeof ACTION.SET_GITHUB_REPO_URL}`; payload: string }
  | { type: `${typeof ACTION.CREATE_ICON_FRAME}` }
  | { type: `${typeof ACTION.SETTING_DONE_STATUS}`; payload: Status }
  | { type: `${typeof ACTION.SETTING_DONE}`; payload: GithubData }
  | { type: `${typeof ACTION.DEPLOY_ICON}`; payload: IconaMetaData }
  | { type: `${typeof ACTION.DEPLOY_ICON_STATUS}`; payload: Status };
