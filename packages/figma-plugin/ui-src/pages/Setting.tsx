import { Box, Button, Spinner } from "@chakra-ui/react";
import * as React from "react";

import { ACTION, STATUS } from "../../common/constants";
import { PasswordInput } from "../components/PasswordInput";
import { TextInput } from "../components/TextInput";
import { useAppDispatch, useAppState } from "../contexts/AppContext";
import * as styles from "./Setting.css";

const Setting = () => {
  const dispatch = useAppDispatch();
  const {
    githubRepositoryUrl,
    githubApiKey,
    figmaFileUrl,
    githubData,
    settingStatus,
  } = useAppState();

  const settingButtonInfo = {
    [STATUS.IDLE]: {
      children: "Setting",
      colorScheme: "gray",
    },
    [STATUS.LOADING]: {
      children: <Spinner size="sm" />,
      colorScheme: "gray",
    },
    [STATUS.SUCCESS]: {
      children: "Setting Success!",
      colorScheme: "green",
    },
    [STATUS.ERROR]: {
      children: "Setting Failed!",
      colorScheme: "red",
    },
  };

  return (
    <Box className={styles.container}>
      <TextInput
        label="Github Repository URL"
        placeholder="Github Repository URL"
        value={githubRepositoryUrl}
        helperText="Github Repository URL that you want to deploy."
        errorMessage="It's not a valid Github Repository URL."
        isError={githubRepositoryUrl.match(/https:\/\/github.com\/.*/) === null}
        handleChange={(event) => {
          dispatch({
            type: ACTION.SET_GITHUB_REPO_URL,
            payload: event.target.value,
          });
        }}
      />

      <PasswordInput
        value={githubApiKey}
        label="Github API Key"
        helperText="Github API Key from your Github Account."
        placeholder="Github API Key"
        handleChange={(event) => {
          dispatch({
            type: ACTION.SET_GITHUB_API_KEY,
            payload: event.target.value,
          });
        }}
      />

      <TextInput
        label="Figma Page URL"
        placeholder="Figma Page URL"
        value={figmaFileUrl}
        helperText="Figma Page URL that your icons are in."
        errorMessage="It's not a figma file URL."
        isError={
          figmaFileUrl.match(/https:\/\/www.figma.com\/file\/.*/) === null
        }
        handleChange={(event) => {
          dispatch({
            type: ACTION.SET_FIGMA_FILE_URL,
            payload: event.target.value,
          });
        }}
      />

      <Button
        isDisabled={
          settingStatus === STATUS.LOADING ||
          settingStatus === STATUS.SUCCESS ||
          settingStatus === STATUS.ERROR
        }
        colorScheme={settingButtonInfo[settingStatus].colorScheme}
        onClick={() =>
          dispatch({ type: ACTION.SETTING_DONE, payload: githubData })
        }
      >
        {settingButtonInfo[settingStatus].children}
      </Button>
    </Box>
  );
};

export default Setting;
