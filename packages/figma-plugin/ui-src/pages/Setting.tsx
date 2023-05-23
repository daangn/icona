import { Box, Button, Divider, Input, Text } from "@chakra-ui/react";
import * as React from "react";

import { ACTION } from "../../common/constants";
import { useAppDispatch, useAppState } from "../contexts/AppContext";
import { getFigmaFileKeyFromUrl } from "../utils/string";
import * as styles from "./Setting.css";

const Setting = () => {
  const dispatch = useAppDispatch();
  const { githubRepositoryUrl, githubApiKey, figmaFileUrl, iconFrameId } =
    useAppState();

  return (
    <Box className={styles.container}>
      <Text>Github Repository URL</Text>
      <Input
        placeholder="Github Repository URL"
        value={githubRepositoryUrl}
        onChange={(event) => {
          dispatch({
            type: ACTION.SET_GITHUB_REPO_URL,
            payload: event.target.value,
          });
        }}
      />

      <Text>Github API Key</Text>
      <Input
        placeholder="Github API Key"
        value={githubApiKey}
        onChange={(event) => {
          dispatch({
            type: ACTION.SET_GITHUB_API_KEY,
            payload: event.target.value,
          });
        }}
      />

      <Text>Figma Page URL</Text>
      <Input
        placeholder="Figma File URL"
        value={figmaFileUrl}
        onChange={(event) => {
          dispatch({
            type: ACTION.SET_FIGMA_FILE_URL,
            payload: event.target.value,
          });
        }}
      />

      <Text>Icon Frame ID</Text>
      <Input placeholder="Icon Frame ID" value={iconFrameId} readOnly />
      {!iconFrameId && (
        <Text color="red.600" fontSize={14}>
          아이콘 프레임을 찾을 수 없습니다.
        </Text>
      )}
      <Button onClick={() => dispatch({ type: ACTION.CREATE_ICON_FRAME })}>
        Icon Frame 만들기
      </Button>

      <Divider />
      <Box>
        <Text>{`{
          ${iconFrameId ? `"FIGMA_ICON_FRAME_ID": "${iconFrameId}"` : ""},
          ${
            figmaFileUrl
              ? `"FIGMA_FILE_KEY": "${getFigmaFileKeyFromUrl(figmaFileUrl)}"`
              : ""
          },
        }`}</Text>
      </Box>

      <Divider />
      <Button onClick={() => dispatch({ type: ACTION.SETTING_DONE })}>
        GITHUB PUSH
      </Button>
    </Box>
  );
};

export default Setting;
