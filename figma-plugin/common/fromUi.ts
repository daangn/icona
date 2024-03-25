import { emit as e, on as o } from "@create-figma-plugin/utilities";
import type { IconaIconData } from "@icona/types";

import type { ExportOptions } from "./types.js";

interface GithubData {
  owner: string;
  name: string;
  apiKey: string;
  branch: string;
}

interface IconaMetaData {
  githubData: GithubData;
  icons: Record<string, IconaIconData>;
  options: ExportOptions;
}

interface SetPngOptionPayload {
  options: ExportOptions;
}

interface SetGithubUrlPayload {
  url: string;
}

interface SetGithubBranchPayload {
  branch: string;
}
interface SetGithubApiKeyPayload {
  apiKey: string;
}

export type Events = {
  SET_GITHUB_URL: {
    name: "SET_GITHUB_URL";
    payload: SetGithubUrlPayload;
    handler: (props: SetGithubUrlPayload) => void;
  };
  SET_GITHUB_API_KEY: {
    name: "SET_GITHUB_API_KEY";
    payload: SetGithubApiKeyPayload;
    handler: (props: SetGithubApiKeyPayload) => void;
  };
  SET_PNG_OPTIONS: {
    name: "SET_PNG_OPTIONS";
    payload: SetPngOptionPayload;
    handler: (props: SetPngOptionPayload) => void;
  };
  DEPLOY_ICON: {
    name: "DEPLOY_ICON";
    payload: IconaMetaData;
    handler: (props: IconaMetaData) => void;
  };
  SET_GITHUB_BRANCH: {
    name: "SET_GITHUB_BRANCH";
    payload: SetGithubBranchPayload;
    handler: (props: SetGithubBranchPayload) => void;
  };
};

type EventName = keyof Events;

export const emit = <T extends EventName>(
  name: T,
  payload: Events[T]["payload"],
) => {
  return e(name, payload);
};

export const on = <T extends keyof Events>(
  name: T,
  handler: Events[T]["handler"],
) => {
  return o(name, handler);
};
