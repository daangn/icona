import { Box, Button } from "@chakra-ui/react";
import * as React from "react";

import { ACTION } from "../../common/constants";
import { useAppDispatch } from "../contexts/AppContext";
import * as styles from "./Deploy.css";

const Deploy = () => {
  const dispatch = useAppDispatch();

  return (
    <Box className={styles.container}>
      <Button onClick={() => dispatch({ type: ACTION.DEPLOY_ICON })}>
        Deploy
      </Button>
    </Box>
  );
};

export default Deploy;
