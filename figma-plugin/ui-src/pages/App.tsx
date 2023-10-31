import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { useJune } from "june-so-sandbox-react";
import * as React from "react";

import { useAppState } from "../contexts/AppContext";
import * as styles from "./App.css";
import Deploy from "./Deploy";
import Setting from "./Setting";

const App = () => {
  const { userName } = useAppState();
  const { track } = useJune();

  if (userName) {
    track({
      event: "icona:plugin_open",
      properties: { userName },
      timestamp: new Date(),
    });
  }

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
