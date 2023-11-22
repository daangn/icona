import {
  Box,
  Button,
  Checkbox,
  Spinner,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { useJune } from "june-so-sandbox-react";
import * as React from "react";

import { FRAME_NAME } from "../../common/constants";
import { useAppDispatch, useAppState } from "../contexts/AppContext";
import * as styles from "./Deploy.css";

const Deploy = () => {
  const dispatch = useAppDispatch();
  const {
    isDeploying,
    githubData,
    iconPreview,
    githubApiKey,
    githubRepositoryUrl,
    isDeployWithPng,
  } = useAppState();
  const icons = Object.entries(iconPreview);
  const { track } = useJune();

  const deploy = () => {
    dispatch({
      name: "DEPLOY_ICON",
      payload: {
        githubData,
      },
    });
    track({
      event: "Icona: Deploy Icon",
      properties: {
        githubRepositoryName: githubData.name,
        githubRepositoryOwner: githubData.owner,
      },
      timestamp: new Date(),
    });
  };

  return (
    <Box className={styles.container}>
      <Text>
        {icons.length} icons found in{" "}
        <Text as="span" color="red.600">
          {FRAME_NAME}
        </Text>{" "}
        frame
      </Text>
      <Text fontSize={12} margin={0}>
        • will be deployed to{" "}
        <Text as="span" color="blue.600" textDecoration="underline">
          <a
            target="_blank"
            href={`https://github.com/${githubData.owner}/${githubData.name}`}
            rel="noreferrer"
          >
            {githubData.name}
          </a>
        </Text>{" "}
        repository
      </Text>
      <Text fontSize={12} margin={0}>
        • you must have at least 1 icon in{" "}
        <Text as="span" color="red.600">
          {FRAME_NAME}
        </Text>{" "}
        frame
      </Text>
      <Button
        className={styles.exportButton}
        isDisabled={
          githubApiKey === "" ||
          githubRepositoryUrl === "" ||
          icons.length === 0 ||
          isDeploying
        }
        onClick={deploy}
        colorScheme={isDeploying ? "gray" : "blue"}
      >
        {isDeploying ? (
          <Spinner size="sm" />
        ) : (
          <Text fontWeight="bold" fontSize={14}>
            Deploy
          </Text>
        )}
      </Button>

      <Checkbox
        marginTop={2}
        isChecked={isDeployWithPng}
        onChange={() => {
          dispatch({
            name: "SET_PNG_OPTION",
            payload: {
              withPng: !isDeployWithPng,
            },
          });
        }}
      >
        <Text fontWeight="bold" fontSize={14}>
          with png
        </Text>
      </Checkbox>
      <Text fontSize={10}>will deploy with png data as base64.</Text>
      <Text fontSize={10}>
        you can convert png file with `@icona/generator`
      </Text>

      <Box className={styles.preview}>
        {icons.map(([name, data]) => {
          const { svg } = data;
          return (
            <Tooltip hasArrow label={name} key={name}>
              <Box dangerouslySetInnerHTML={{ __html: svg }} />
            </Tooltip>
          );
        })}
      </Box>
    </Box>
  );
};

export default Deploy;
