import { emit as e, on as o } from "@create-figma-plugin/utilities";
import type { IconaIconData } from "@icona/types";

interface UserInfoPayload {
  name: string;
  id: string;
}

interface GetGithubRepoUrlPayload {
  repoUrl?: string;
}

interface GetGithubApiKeyPayload {
  apiKey?: string;
}

interface GetDeployWithPngPayload {
  deployWithPng?: boolean;
}

interface GetIconPreviewPayload {
  icons: Record<string, IconaIconData>;
}

export type Events = {
  GET_USER_INFO: {
    name: "GET_USER_INFO";
    payload: UserInfoPayload;
    handler: (props: UserInfoPayload) => void;
  };
  GET_GITHUB_REPO_URL: {
    name: "GET_GITHUB_REPO_URL";
    payload: GetGithubRepoUrlPayload;
    handler: (props: GetGithubRepoUrlPayload) => void;
  };
  GET_GITHUB_API_KEY: {
    name: "GET_GITHUB_API_KEY";
    payload: GetGithubApiKeyPayload;
    handler: (props: GetGithubApiKeyPayload) => void;
  };
  GET_DEPLOY_WITH_PNG: {
    name: "GET_DEPLOY_WITH_PNG";
    payload: GetDeployWithPngPayload;
    handler: (props: GetDeployWithPngPayload) => void;
  };
  GET_ICON_PREVIEW: {
    name: "GET_ICON_PREVIEW";
    payload: GetIconPreviewPayload;
    handler: (props: GetIconPreviewPayload) => void;
  };
  DEPLOY_DONE: {
    name: "DEPLOY_DONE";
    payload: null;
    handler: () => void;
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
  if (handler) return o(name, handler);
};
