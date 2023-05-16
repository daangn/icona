/* eslint-disable no-restricted-globals */
import "../ui.css";

import { Input } from "@chakra-ui/react";
import * as React from "react";

import { ACTION } from "../../constants";
import { postMessage } from "../api";
import { appContainer } from "./App.css";

const App = () => {
  const [githubRepositoryUrl, setGithubRepositoryUrl] = React.useState("");
  const [githubApiKey, setGithubApiKey] = React.useState("");

  React.useEffect(() => {
    window.onmessage = async (event) => {
      const msg = event.data.pluginMessage;
      switch (msg.type) {
        case ACTION.GET_GITHUB_API_KEY:
          if (msg.apiKey) setGithubApiKey(msg.apiKey);
          break;
        case ACTION.GET_GITHUB_REPO_URL:
          if (msg.repoUrl) setGithubRepositoryUrl(msg.repoUrl);
          break;
      }
    };
  }, []);

  const handleGithubRepositoryUrlChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setGithubRepositoryUrl(event.target.value);
    postMessage({
      type: ACTION.SET_GITHUB_REPO_URL,
      repoUrl: event.target.value,
    });
  };

  const handleGithubApiKeyChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setGithubApiKey(event.target.value);
    postMessage({
      type: ACTION.SET_GITHUB_API_KEY,
      apiKey: event.target.value,
    });
  };

  return (
    <div className={appContainer}>
      <Input
        placeholder="Github Repository URL"
        value={githubRepositoryUrl}
        onChange={handleGithubRepositoryUrlChange}
      />
      <Input
        placeholder="Github API Key"
        value={githubApiKey}
        onChange={handleGithubApiKeyChange}
      />
    </div>
  );
};

export default App;
