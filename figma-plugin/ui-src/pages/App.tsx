import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import * as React from "react";

import { useAppState } from "../contexts/AppContext";
import { useJune } from "../hooks/useJune";
import * as styles from "./App.css";
import Deploy from "./Deploy";
import Setting from "./Setting";

const App = () => {
  const { userName } = useAppState();
  const { track, identify } = useJune({
    writeKey: import.meta.env.VITE_JUNE_SO_WRITE_KEY,
  });

  identify({ userName });
  track("icona:plugin_open");

  return (
    <Box className={styles.container}>
      <Tabs>
        <TabList>
          <Tab>Setting</Tab>
          <Tab>Deploy</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Setting />
          </TabPanel>
          <TabPanel>
            <Deploy />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default App;
