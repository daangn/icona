import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import * as React from "react";

import * as styles from "./App.css";
import Deploy from "./Deploy";
import Setting from "./Setting";

const App = () => {
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
