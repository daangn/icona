import type { IconaIconData } from "@icona/types";
import type { Dispatch } from "react";
import React, { createContext, useContext, useReducer } from "react";

import { type Events as PluginEvents } from "../../common/fromPlugin";
import { emit, type Events as UiEvents } from "../../common/fromUi";
import type { GithubData } from "../../common/types";
import { getGithubDataFromUrl } from "../utils/string";

type State = {
  // Info
  userId?: string;
  userName?: string;

  // Computed
  githubData: GithubData;

  // Input
  githubRepositoryUrl: string;
  githubApiKey: string;

  iconPreview: Record<string, IconaIconData>;

  // Options
  pngOption: {
    "1x": boolean;
    "2x": boolean;
    "3x": boolean;
    "4x": boolean;
  };

  // Status
  isDeploying: boolean;
};

type Actions =
  | Omit<PluginEvents["GET_GITHUB_API_KEY"], "handler">
  | Omit<PluginEvents["GET_GITHUB_REPO_URL"], "handler">
  | Omit<PluginEvents["GET_DEPLOY_WITH_PNG"], "handler">
  | Omit<PluginEvents["GET_USER_INFO"], "handler">
  | Omit<PluginEvents["GET_ICON_PREVIEW"], "handler">
  | Omit<PluginEvents["DEPLOY_DONE"], "handler">
  | Omit<UiEvents["DEPLOY_ICON"], "handler">
  | Omit<UiEvents["SET_PNG_OPTIONS"], "handler">
  | Omit<UiEvents["SET_GITHUB_API_KEY"], "handler">
  | Omit<UiEvents["SET_GITHUB_URL"], "handler">;

type AppDispatch = Dispatch<Actions>;

const AppStateContext = createContext<State | null>(null);
const AppDispatchContext = createContext<AppDispatch | null>(null);

function reducer(state: State, action: Actions): State {
  switch (action.name) {
    /* from Plugin */
    case "GET_DEPLOY_WITH_PNG": {
      const { options } = action.payload;
      const png = options.png || {
        "1x": false,
        "2x": false,
        "3x": false,
        "4x": false,
      };

      return {
        ...state,
        pngOption: {
          ...png,
        },
      };
    }
    case "GET_GITHUB_API_KEY": {
      const { apiKey = "" } = action.payload;
      return {
        ...state,
        githubApiKey: apiKey,
        githubData: {
          ...state.githubData,
          apiKey,
        },
      };
    }
    case "GET_GITHUB_REPO_URL": {
      const { repoUrl = "" } = action.payload;
      return {
        ...state,
        githubRepositoryUrl: repoUrl,
        githubData: {
          ...state.githubData,
          ...getGithubDataFromUrl(repoUrl),
        },
      };
    }

    case "GET_USER_INFO": {
      return {
        ...state,
        userId: action.payload.id,
        userName: action.payload.name,
      };
    }

    case "DEPLOY_DONE": {
      return {
        ...state,
        isDeploying: false,
      };
    }

    /* from UI */
    case "DEPLOY_ICON": {
      emit("DEPLOY_ICON", action.payload);

      return {
        ...state,
        isDeploying: true,
      };
    }

    case "SET_GITHUB_API_KEY": {
      emit("SET_GITHUB_API_KEY", action.payload);

      return {
        ...state,
        githubApiKey: action.payload.apiKey,
      };
    }

    case "SET_GITHUB_URL": {
      emit("SET_GITHUB_URL", action.payload);

      return {
        ...state,
        githubRepositoryUrl: action.payload.url,
        githubData: {
          ...state.githubData,
          ...getGithubDataFromUrl(action.payload.url),
        },
      };
    }

    case "SET_PNG_OPTIONS": {
      emit("SET_PNG_OPTIONS", action.payload);

      return {
        ...state,
        pngOption: {
          ...action.payload.options.png,
        },
      };
    }

    case "GET_ICON_PREVIEW": {
      const { icons } = action.payload;

      return {
        ...state,
        iconPreview: icons,
      };
    }

    default:
      throw new Error("Unhandled action");
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    // Info
    userName: "",
    userId: "",

    // Computed
    githubData: {
      owner: "",
      name: "",
      apiKey: "",
    },
    iconPreview: {},

    // Input
    githubApiKey: "",
    githubRepositoryUrl: "",

    // Options
    pngOption: {
      "1x": false,
      "2x": false,
      "3x": false,
      "4x": false,
    },

    // Status
    isDeploying: false,
  });

  window.onmessage = (event) => {
    if (typeof event.data.pluginMessage === "undefined") {
      console.warn("not plugin message");
      return;
    }

    const args = event.data.pluginMessage;
    if (!Array.isArray(args)) {
      return;
    }

    const [name, payload] = event.data.pluginMessage;
    if (typeof name !== "string") {
      return;
    }

    dispatch({ name: name as Actions["name"], payload });
  };

  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const state = useContext(AppStateContext);
  if (!state) throw new Error("Cannot find AppProvider");
  return state;
}

export function useAppDispatch() {
  const dispatch = useContext(AppDispatchContext);
  if (!dispatch) throw new Error("Cannot find SettingProvider");
  return dispatch;
}
