import { Box, Button, Spinner, Text, Tooltip } from "@chakra-ui/react";
import * as React from "react";

import { ACTION, STATUS } from "../../common/constants";
import { useAppDispatch, useAppState } from "../contexts/AppContext";
import * as styles from "./Deploy.css";

const Deploy = () => {
  const dispatch = useAppDispatch();
  const { deployIconStatus, githubData, iconPreview } = useAppState();

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

  return (
    <Box className={styles.container}>
      <Text>{iconPreview.length} icons found</Text>
      <Button
        isDisabled={
          deployIconStatus === STATUS.LOADING ||
          deployIconStatus === STATUS.SUCCESS ||
          deployIconStatus === STATUS.ERROR
        }
        onClick={() =>
          dispatch({
            type: ACTION.DEPLOY_ICON,
            payload: {
              githubData,
            },
          })
        }
        colorScheme={buttonInfo[deployIconStatus].colorScheme}
      >
        {buttonInfo[deployIconStatus].children}
      </Button>
      <Box className={styles.preview}>
        {iconPreview.map(({ name, svg }) => {
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
