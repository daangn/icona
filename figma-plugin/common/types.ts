import type { IconaIconData } from "@icona/types";

import type { ACTION, STATUS } from "./constants";

export interface GithubData {
  owner: string;
  name: string;
  apiKey: string;
}

export interface IconaMetaData {
  githubData: GithubData;
  options?: {
    withPng?: boolean;
  };
}

export type Status = `${(typeof STATUS)[keyof typeof STATUS]}`;

export type Messages =
  | { type: `${typeof ACTION.GET_DEPLOY_WITH_PNG}`; payload: boolean }
  | { type: `${typeof ACTION.GET_GITHUB_API_KEY}`; payload: string }
  | { type: `${typeof ACTION.GET_GITHUB_REPO_URL}`; payload: string }
  | {
      type: `${typeof ACTION.GET_ICON_PREVIEW}`;
      payload: Record<string, IconaIconData>;
    }
  | { type: `${typeof ACTION.SET_DEPLOY_WITH_PNG}`; payload: boolean }
  | { type: `${typeof ACTION.SET_GITHUB_API_KEY}`; payload: string }
  | { type: `${typeof ACTION.SET_GITHUB_REPO_URL}`; payload: string }
  | { type: `${typeof ACTION.DEPLOY_ICON}`; payload: IconaMetaData }
  | { type: `${typeof ACTION.DEPLOY_ICON_STATUS}`; payload: Status }
  | {
      type: `${typeof ACTION.GET_USER_INFO}`;
      payload: {
        id: string;
        name: string;
      };
    }
  | {
      type: `${typeof ACTION.DEPLOY_ICON_ERROR_MESSAGE}`;
      payload: string;
    };
