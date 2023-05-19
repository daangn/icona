/* eslint-disable import/extensions */
import "./styles/global.css";

import { ChakraProvider } from "@chakra-ui/react";
import * as React from "react";
import { createRoot } from "react-dom/client";

import { AppProvider } from "./contexts/AppContext";
import App from "./pages/App";

const root = createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <ChakraProvider>
      <AppProvider>
        <App />
      </AppProvider>
    </ChakraProvider>
  </React.StrictMode>,
);
