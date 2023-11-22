import { emit as e, on as o } from "@create-figma-plugin/utilities";

interface GithubData {
  owner: string;
  name: string;
  apiKey: string;
}

interface IconaMetaData {
  githubData: GithubData;
  options?: {
    withPng?: boolean;
  };
}

interface SetPngOptionPayload {
  withPng: boolean;
}

interface SetGithubUrlPayload {
  url: string;
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
  SET_PNG_OPTION: {
    name: "SET_PNG_OPTION";
    payload: SetPngOptionPayload;
    handler: (props: SetPngOptionPayload) => void;
  };
  DEPLOY_ICON: {
    name: "DEPLOY_ICON";
    payload: IconaMetaData;
    handler: (props: IconaMetaData) => void;
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
