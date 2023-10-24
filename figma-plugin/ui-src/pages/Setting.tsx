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
  const { githubRepositoryUrl, githubApiKey } = useAppState();

  const githubRepositoryUrlRegex = /https:\/\/github.com\/.*/;
  const isErrorGithubRepositoryUrl =
    githubRepositoryUrl.match(githubRepositoryUrlRegex) === null;
  const isInvalidGithubApiKey = githubApiKey === "";

  const getProgress = () => {
    if (isErrorGithubRepositoryUrl && isInvalidGithubApiKey) return 0;
    if (isErrorGithubRepositoryUrl || isInvalidGithubApiKey) return 50;
    return 100;
  };

  return (
    <Box className={styles.container}>
      <Progress value={getProgress()} hasStripe colorScheme="blue" />

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
