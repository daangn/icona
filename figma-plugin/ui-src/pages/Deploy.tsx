import {
  Box,
  Button,
  Checkbox,
  Flex,
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
    pngOption,
  } = useAppState();
  const icons = Object.entries(iconPreview);
  const { track } = useJune();

  const deploy = () => {
    dispatch({
      name: "DEPLOY_ICON",
      payload: {
        icons: iconPreview,
        githubData,
        options: {
          png: pngOption,
        },
      },
    });
    track({
      event: "Icona: Deploy Icon",
      properties: {
        githubRepositoryUrl,
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

      <Box marginTop={4} fontSize={14}>
        <Text fontWeight="bold">Export Options</Text>
      </Box>

      <Box className={styles.optionContainer}>
        <Text fontSize={12} fontWeight="bold">
          PNG
        </Text>
        <Text fontSize={10}>will deploy with png data as base64.</Text>
        <Text fontSize={10}>
          you can convert png file with `@icona/generator`
        </Text>
        <Flex gap={6}>
          <Checkbox
            marginTop={2}
            isChecked={pngOption.x1}
            onChange={() => {
              dispatch({
                name: "SET_PNG_OPTION",
                payload: {
                  options: {
                    png: {
                      ...pngOption,
                      x1: !pngOption.x1,
                    },
                  },
                },
              });
            }}
          >
            <Text fontWeight="bold" fontSize={14}>
              x1
            </Text>
          </Checkbox>

          <Checkbox
            marginTop={2}
            isChecked={pngOption.x2}
            onChange={() => {
              dispatch({
                name: "SET_PNG_OPTION",
                payload: {
                  options: {
                    png: {
                      ...pngOption,
                      x2: !pngOption.x2,
                    },
                  },
                },
              });
            }}
          >
            <Text fontWeight="bold" fontSize={14}>
              x2
            </Text>
          </Checkbox>

          <Checkbox
            marginTop={2}
            isChecked={pngOption.x3}
            onChange={() => {
              dispatch({
                name: "SET_PNG_OPTION",
                payload: {
                  options: {
                    png: {
                      ...pngOption,
                      x3: !pngOption.x3,
                    },
                  },
                },
              });
            }}
          >
            <Text fontWeight="bold" fontSize={14}>
              x3
            </Text>
          </Checkbox>

          <Checkbox
            marginTop={2}
            isChecked={pngOption.x4}
            onChange={() => {
              dispatch({
                name: "SET_PNG_OPTION",
                payload: {
                  options: {
                    png: {
                      ...pngOption,
                      x4: !pngOption.x4,
                    },
                  },
                },
              });
            }}
          >
            <Text fontWeight="bold" fontSize={14}>
              x4
            </Text>
          </Checkbox>
        </Flex>
      </Box>

      <Box marginTop={4} fontSize={14}>
        <Text fontWeight="bold">Previews</Text>
      </Box>

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
