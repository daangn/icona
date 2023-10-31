import type { IconaIconData } from "@icona/types";
import type { Dispatch } from "react";
import React, { createContext, useContext, useReducer } from "react";

import { ACTION, STATUS } from "../../common/constants";
import type { GithubData, Messages, Status } from "../../common/types";
import { postMessage } from "../utils/figma";
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

  // Status
  deployIconStatus: Status;
  settingStatus: Status;
};

type AppDispatch = Dispatch<Messages>;

const AppStateContext = createContext<State | null>(null);
const AppDispatchContext = createContext<AppDispatch | null>(null);

function reducer(state: State, action: Messages): State {
  switch (action.type) {
    /* GETTER */
    case ACTION.GET_USER_INFO: {
      return {
        ...state,
        userId: action.payload.id,
        userName: action.payload.name,
      };
    }
    case ACTION.GET_GITHUB_API_KEY:
      return {
        ...state,
        githubApiKey: action.payload,
        githubData: {
          ...state.githubData,
          apiKey: action.payload,
        },
      };
    case ACTION.GET_GITHUB_REPO_URL:
      return {
        ...state,
        githubRepositoryUrl: action.payload,
        githubData: {
          ...state.githubData,
          ...getGithubDataFromUrl(action.payload),
        },
      };
    case ACTION.GET_ICON_PREVIEW:
      return {
        ...state,
        iconPreview: action.payload,
      };

    /* SETTER */
    case ACTION.SET_GITHUB_API_KEY:
      postMessage({
        type: action.type,
        payload: action.payload,
      });
      return {
        ...state,
        githubApiKey: action.payload,
        githubData: {
          ...state.githubData,
          apiKey: action.payload,
        },
      };

    case ACTION.SET_GITHUB_REPO_URL:
      postMessage({
        type: action.type,
        payload: action.payload,
      });
      return {
        ...state,
        githubRepositoryUrl: action.payload,
        githubData: {
          ...state.githubData,
          ...getGithubDataFromUrl(action.payload),
        },
      };

    case ACTION.DEPLOY_ICON: {
      postMessage({
        type: ACTION.DEPLOY_ICON,
        payload: {
          githubData: action.payload.githubData,
        },
      });
      return state;
    }

    case ACTION.DEPLOY_ICON_STATUS: {
      return {
        ...state,
        deployIconStatus: action.payload,
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

    // Status
    deployIconStatus: STATUS.IDLE,
    settingStatus: STATUS.IDLE,
  });

  // Init
  React.useEffect(() => {
    // NOTE: Event listener from figma
    window.onmessage = (event) => {
      const msg = event.data.pluginMessage as Messages;
      switch (msg.type) {
        case ACTION.GET_USER_INFO: {
          if (msg.payload) dispatch({ type: msg.type, payload: msg.payload });
          return;
        }
        case ACTION.GET_GITHUB_API_KEY:
          if (msg.payload) dispatch({ type: msg.type, payload: msg.payload });
          break;
        case ACTION.GET_GITHUB_REPO_URL:
          if (msg.payload) dispatch({ type: msg.type, payload: msg.payload });
          break;
        case ACTION.GET_ICON_PREVIEW:
          if (msg.payload) dispatch({ type: msg.type, payload: msg.payload });
          break;
        case ACTION.DEPLOY_ICON_STATUS: {
          dispatch({ type: msg.type, payload: msg.payload });
          return;
        }
      }
    };
  }, [dispatch]);

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
