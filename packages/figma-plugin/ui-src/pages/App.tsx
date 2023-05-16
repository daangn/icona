import * as React from "react";
import "../ui.css";
import { appContainer } from "./App.css";
import { Input } from '@chakra-ui/react';

const App = ({}) => {
  return (
    <div className={appContainer}>
      hello world
      hi
      di
      <Input placeholder='Basic usage' />
    </div>
  );
};

export default App;
