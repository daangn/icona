import { Box, Text } from "@chakra-ui/react";
import * as React from "react";

import { useAppState } from "../contexts/AppContext";
import * as styles from "./Preview.css";

const Preview = () => {
  const { iconPreview } = useAppState();

  return (
    <Box className={styles.container}>
      <Text>총 {iconPreview.length}개의 아이콘이 발견됐어요.</Text>
      {iconPreview.map(({ name, svg }) => {
        return (
          <Box key={name}>
            <Box dangerouslySetInnerHTML={{ __html: svg }} />
            <Box>{name}</Box>
          </Box>
        );
      })}
    </Box>
  );
};

export default Preview;
