/* eslint-disable @typescript-eslint/no-shadow */
import { Box, Link, Text } from "@chakra-ui/react";
import * as React from "react";

import { PasswordInput } from "../components/PasswordInput";
import { TextInput } from "../components/TextInput";
import { useAppDispatch, useAppState } from "../contexts/AppContext";
import * as styles from "./Setting.css";

const Setting = () => {
  const dispatch = useAppDispatch();
  const { githubRepositoryUrl, githubApiKey } = useAppState();

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
            name: "SET_GITHUB_URL",
            payload: {
              url: event.target.value,
            },
          });
        }}
      />

      <Text fontSize={12} margin={0}>
        <Text as="span" color="blue.600" textDecoration="underline">
          <a target="_blank" href={githubRepositoryUrl} rel="noreferrer">
            {githubRepositoryUrl}
          </a>
        </Text>
      </Text>

      <PasswordInput
        value={githubApiKey}
        label="Github API Key"
        helperText="Github API Key from your Github Account."
        placeholder="Github API Key"
        isInvalid={githubApiKey === ""}
        handleChange={(event) => {
          dispatch({
            name: "SET_GITHUB_API_KEY",
            payload: {
              apiKey: event.target.value,
            },
          });
        }}
      />
      <Text fontSize={12}>
        You can get api key in{" "}
        <Link
          color={"blue.500"}
          href="https://github.com/settings/tokens/new"
          target="_blank"
          rel="noreferrer"
        >
          github create token page.
        </Link>{" "}
        Need{" "}
        <Text fontWeight="bold" as="span" color="red.600">
          repo
        </Text>
        ,{" "}
        <Text fontWeight="bold" as="span" color="red.600">
          workflow
        </Text>{" "}
        permissions of the repo.
      </Text>
    </Box>
  );
};

export default Setting;
