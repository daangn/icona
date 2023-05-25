import { Box, Button } from "@chakra-ui/react";
import * as React from "react";

import { ACTION } from "../../common/constants";
import { PasswordInput } from "../components/PasswordInput";
import { TextInput } from "../components/TextInput";
import { useAppDispatch, useAppState } from "../contexts/AppContext";
import * as styles from "./Setting.css";

const Setting = () => {
  const dispatch = useAppDispatch();
  const { githubRepositoryUrl, githubApiKey, figmaFileUrl, iconFrameId } =
    useAppState();

  const isExistIconFrameId = Boolean(iconFrameId);

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
        isDisabled={isExistIconFrameId}
        onClick={() => dispatch({ type: ACTION.CREATE_ICON_FRAME })}
      >
        {isExistIconFrameId
          ? "Icon Frame already created"
          : "Create Icon Frame"}
      </Button>

      <Button
        isDisabled
        onClick={() => dispatch({ type: ACTION.SETTING_DONE })}
      >
        WIP(Setting Done)
      </Button>
    </Box>
  );
};

export default Setting;
