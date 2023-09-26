/* eslint-disable @typescript-eslint/no-shadow */
import { Box, Progress } from "@chakra-ui/react";
import * as React from "react";

import { ACTION } from "../../common/constants";
import { PasswordInput } from "../components/PasswordInput";
import { TextInput } from "../components/TextInput";
import { useAppDispatch, useAppState } from "../contexts/AppContext";
import * as styles from "./Setting.css";

const Setting = () => {
  const dispatch = useAppDispatch();
  const { githubApiUrl, githubRepositoryUrl, githubApiKey } = useAppState();
  const isInvalidGithubApiKey = githubApiKey === "";

  const getProgress = () => {
    if (isInvalidGithubApiKey) return 0;
    if (isInvalidGithubApiKey) return 50;
    return 100;
  };

  return (
    <Box className={styles.container}>
      <Progress value={getProgress()} hasStripe colorScheme="blue" />

      <TextInput
        label="Git API URL"
        placeholder="Git API URL"
        value={githubApiUrl}
        helperText="Git API URL that you want to deploy."
        errorMessage=""
        isError={false}
        handleChange={(event) => {
          dispatch({
            type: ACTION.SET_GITHUB_API_URL,
            payload: event.target.value,
          });
        }}
      />

      <TextInput
        label="Github Repository URL"
        placeholder="Github Repository URL"
        value={githubRepositoryUrl}
        helperText="Github Repository URL that you want to deploy."
        errorMessage=""
        isError={false}
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
        isInvalid={githubApiKey === ""}
        handleChange={(event) => {
          dispatch({
            type: ACTION.SET_GITHUB_API_KEY,
            payload: event.target.value,
          });
        }}
      />
    </Box>
  );
};

export default Setting;
