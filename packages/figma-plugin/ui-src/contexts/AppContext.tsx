import type { Dispatch } from "react";
import React, { createContext, useContext, useReducer } from "react";

import { STATUS } from "../../common/constants";
import { ACTION } from "../../common/constants";
import type {
  GithubData,
  IconData,
  Messages,
  Status,
} from "../../common/types";
import { postMessage } from "../utils/figma";
import { getFigmaFileKeyFromUrl, getGithubDataFromUrl } from "../utils/string";

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
  settingStatus: Status;
};

type AppDispatch = Dispatch<Messages>;

const AppStateContext = createContext<State | null>(null);
const AppDispatchContext = createContext<AppDispatch | null>(null);

function reducer(state: State, action: Messages): State {
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
    case ACTION.SET_FIGMA_FILE_URL:
      postMessage({
        type: action.type,
        payload: action.payload,
      });
      return {
        ...state,
        figmaFileUrl: action.payload,
        figmaFileKey: getFigmaFileKeyFromUrl(action.payload),
      };
    case ACTION.SET_ICON_FRAME_ID:
      postMessage({
        type: action.type,
        payload: action.payload,
      });
      return {
        ...state,
        iconFrameId: action.payload,
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

    case ACTION.CREATE_ICON_FRAME:
      postMessage({
        type: ACTION.CREATE_ICON_FRAME,
      });
      return state;

    // FIXME: 아마도 필요 없을지도? 세팅 어떻게 할건지 다시 생각하기
    case ACTION.SETTING_DONE:
      postMessage({
        type: ACTION.SETTING_DONE,
        payload: action.payload,
      });
      return state;

    case ACTION.SETTING_DONE_STATUS:
      return {
        ...state,
        settingStatus: action.payload,
      };

    case ACTION.DEPLOY_ICON: {
      postMessage({
        type: ACTION.DEPLOY_ICON,
        payload: {
          githubData: action.payload.githubData,
          iconFrameId: action.payload.iconFrameId,
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
    settingStatus: STATUS.IDLE,
  });

  // Init
  React.useEffect(() => {
    // NOTE: Event listener from figma
    window.onmessage = (event) => {
      const msg = event.data.pluginMessage as Messages;
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
        case ACTION.SETTING_DONE_STATUS: {
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
