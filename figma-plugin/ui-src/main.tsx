/* eslint-disable import/extensions */
import "./styles/global.css";

import { ChakraProvider } from "@chakra-ui/react";
import { JuneProvider } from "june-so-client-react";
import * as React from "react";
import { createRoot } from "react-dom/client";

import { AppProvider } from "./contexts/AppContext";
import App from "./pages/App";

const root = createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <JuneProvider
      writeKey={import.meta.env.VITE_JUNE_SO_WRITE_KEY}
      disabled={import.meta.env.MODE === "dev"}
    >
      <ChakraProvider>
        <AppProvider>
          <App />
        </AppProvider>
      </ChakraProvider>
    </JuneProvider>
  </React.StrictMode>,
);
