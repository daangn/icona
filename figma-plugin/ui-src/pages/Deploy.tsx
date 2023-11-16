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

import { ACTION, DATA, STATUS } from "../../common/constants";
import { useAppDispatch, useAppState } from "../contexts/AppContext";
import * as styles from "./Deploy.css";

const Deploy = () => {
  const dispatch = useAppDispatch();
  const {
    deployIconStatus,
    githubData,
    iconPreview,
    githubApiKey,
    githubRepositoryUrl,
    isDeployWithPng,
  } = useAppState();
  const icons = Object.entries(iconPreview);
  const { track } = useJune();

  const buttonInfo = {
    [STATUS.IDLE]: {
      children: "Deploy",
      colorScheme: "gray",
    },
    [STATUS.LOADING]: {
      children: <Spinner size="sm" />,
      colorScheme: "gray",
    },
    [STATUS.SUCCESS]: {
      children: "Deploy Success!",
      colorScheme: "green",
    },
    [STATUS.ERROR]: {
      children: "Deploy Failed!",
      colorScheme: "red",
    },
  };

  const deploy = () => {
    dispatch({
      type: ACTION.DEPLOY_ICON,
      payload: {
        githubData,
      },
    });
    track({
      event: "icona:deploy_icon",
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
          `{DATA.ICON_FRAME_ID}`
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
          `{DATA.ICON_FRAME_ID}`
        </Text>{" "}
        frame
      </Text>
      <Button
        className={styles.exportButton}
        isDisabled={
          githubApiKey === "" ||
          githubRepositoryUrl === "" ||
          icons.length === 0 ||
          deployIconStatus === STATUS.LOADING ||
          deployIconStatus === STATUS.SUCCESS ||
          deployIconStatus === STATUS.ERROR
        }
        onClick={deploy}
        colorScheme={buttonInfo[deployIconStatus].colorScheme}
      >
        {buttonInfo[deployIconStatus].children}
      </Button>

      <Checkbox
        marginTop={2}
        isChecked={isDeployWithPng}
        onChange={() => {
          dispatch({
            type: ACTION.SET_DEPLOY_WITH_PNG,
            payload: !isDeployWithPng,
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
