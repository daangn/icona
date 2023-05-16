import "../ui.css";

import { Input } from "@chakra-ui/react";
import * as React from "react";

import { appContainer } from "./App.css";

const App = ({}) => {
  return (
    <div className={appContainer}>
      hello world hi di
      <Input placeholder="Basic usage" />
    </div>
  );
};

export default App;
