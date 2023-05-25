import type { Dispatch } from "react";
import React, { createContext, useContext, useReducer } from "react";

import { STATUS } from "../../common/constants";
import { ACTION } from "../../common/constants";
import type { GithubData, IconData } from "../../common/types";
import { postMessage } from "../utils/figma";
import { getFigmaFileKeyFromUrl, getGithubDataFromUrl } from "../utils/string";

type Status = `${(typeof STATUS)[keyof typeof STATUS]}`;
type State = {
  // Computed
  githubData: GithubData;
  figmaFileKey: string;

  // Input
  githubRepositoryUrl: string;
  githubApiKey: string;
  iconFrameId: string;
  figmaFileUrl: string;
  iconPreview: IconData[];

  // Status
  deployIconStatus: Status;
};

type Actions =
  // GETTER
  | { type: `${typeof ACTION.GET_GITHUB_API_KEY}`; payload: string }
  | { type: `${typeof ACTION.GET_FIGMA_FILE_URL}`; payload: string }
  | { type: `${typeof ACTION.GET_GITHUB_REPO_URL}`; payload: string }
  | { type: `${typeof ACTION.GET_ICON_FRAME_ID}`; payload: string }
  | { type: `${typeof ACTION.GET_ICON_PREVIEW}`; payload: IconData[] }
  // SETTER
  | { type: `${typeof ACTION.SET_GITHUB_API_KEY}`; payload: string }
  | { type: `${typeof ACTION.SET_FIGMA_FILE_URL}`; payload: string }
  | { type: `${typeof ACTION.SET_GITHUB_REPO_URL}`; payload: string }
  | { type: `${typeof ACTION.SET_ICON_FRAME_ID}`; payload: string }
  | { type: `${typeof ACTION.DEPLOY_ICON_STATUS}`; payload: Status }
  // NO SIDE EFFECT
  | { type: `${typeof ACTION.CREATE_ICON_FRAME}` }
  | { type: `${typeof ACTION.SETTING_DONE}` }
  | { type: `${typeof ACTION.DEPLOY_ICON}` };

type AppDispatch = Dispatch<Actions>;

const AppStateContext = createContext<State | null>(null);
const AppDispatchContext = createContext<AppDispatch | null>(null);

function reducer(state: State, action: Actions): State {
  switch (action.type) {
    /* GETTER */
    case ACTION.GET_GITHUB_API_KEY:
      return {
        ...state,
        githubApiKey: action.payload,
        githubData: {
          ...state.githubData,
          apiKey: action.payload,
        },
      };
    case ACTION.GET_FIGMA_FILE_URL:
      return {
        ...state,
        figmaFileUrl: action.payload,
        figmaFileKey: getFigmaFileKeyFromUrl(action.payload),
      };
    case ACTION.GET_ICON_FRAME_ID:
      return {
        ...state,
        iconFrameId: action.payload,
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
        type: action,
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
    case ACTION.SET_FIGMA_FILE_URL:
      postMessage({
        type: action,
        payload: action.payload,
      });
      return {
        ...state,
        figmaFileUrl: action.payload,
        figmaFileKey: getFigmaFileKeyFromUrl(action.payload),
      };
    case ACTION.SET_ICON_FRAME_ID:
      postMessage({
        type: action,
        payload: action.payload,
      });
      return {
        ...state,
        iconFrameId: action.payload,
      };
    case ACTION.SET_GITHUB_REPO_URL:
      postMessage({
        type: action,
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

    case ACTION.CREATE_ICON_FRAME:
      postMessage({
        type: ACTION.CREATE_ICON_FRAME,
      });
      return state;

    case ACTION.SETTING_DONE:
      postMessage({
        type: ACTION.SETTING_DONE,
        payload: {
          githubData: state.githubData,
          iconFrameId: state.iconFrameId,
          figmaFileKey: state.figmaFileKey,
        },
      });
      return state;

    case ACTION.DEPLOY_ICON: {
      postMessage({
        type: ACTION.DEPLOY_ICON,
        payload: {
          githubData: state.githubData,
          iconFrameId: state.iconFrameId,
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
    // Computed
    githubData: {
      owner: "",
      name: "",
      apiKey: "",
    },
    figmaFileKey: "",
    iconPreview: [],

    // Input
    githubApiKey: "",
    githubRepositoryUrl: "",
    iconFrameId: "",
    figmaFileUrl: "",

    // Status
    deployIconStatus: STATUS.IDLE,
  });

  // Init
  React.useEffect(() => {
    // NOTE: Event listener from figma
    window.onmessage = (event) => {
      const msg = event.data.pluginMessage;
      switch (msg.type) {
        case ACTION.GET_GITHUB_API_KEY:
          if (msg.payload) dispatch({ type: msg.type, payload: msg.payload });
          break;
        case ACTION.GET_GITHUB_REPO_URL:
          if (msg.payload) dispatch({ type: msg.type, payload: msg.payload });
          break;
        case ACTION.GET_ICON_FRAME_ID:
          if (msg.payload) dispatch({ type: msg.type, payload: msg.payload });
          break;
        case ACTION.GET_FIGMA_FILE_URL:
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
