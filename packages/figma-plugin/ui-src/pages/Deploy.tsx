import { Box, Button, Spinner } from "@chakra-ui/react";
import * as React from "react";

import { ACTION, STATUS } from "../../common/constants";
import { useAppDispatch, useAppState } from "../contexts/AppContext";
import * as styles from "./Deploy.css";

const Deploy = () => {
  const dispatch = useAppDispatch();
  const { deployIconStatus } = useAppState();

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
      <Button
        isDisabled={
          deployIconStatus === STATUS.LOADING ||
          deployIconStatus === STATUS.SUCCESS ||
          deployIconStatus === STATUS.ERROR
        }
        onClick={() => dispatch({ type: ACTION.DEPLOY_ICON })}
        colorScheme={buttonInfo[deployIconStatus].colorScheme}
      >
        {buttonInfo[deployIconStatus].children}
      </Button>
    </Box>
  );
};

export default Deploy;
