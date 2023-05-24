import * as core from "@actions/core";
import { svgExtracter } from "figma-svg-extracter";

import { pushToGithub } from "./octokit";

try {
  const githubToken = core.getInput("github-token");
  const figmaToken = core.getInput("figma-token");
  const figmaFileKey = core.getInput("figma-file-key");
  const figmaIconFrameId = core.getInput("figma-icon-frame-id");

  // NOTE: https://docs.github.com/en/actions/learn-github-actions/variables#default-environment-variables
  const githubRepo = process.env.GITHUB_REPOSITORY;
  const currentBranch = process.env.GITHUB_HEAD_REF;
  const owner = githubRepo?.split("/")[0];
  const repo = githubRepo?.split("/")[1];

  if (!githubToken) {
    throw new Error("github-token is required");
  }

  if (!figmaToken) {
    throw new Error("figma-token is required");
  }

  if (!figmaFileKey) {
    throw new Error("figma-file-key is required");
  }

  if (!figmaIconFrameId) {
    throw new Error("figma-icon-frame-id is required");
  }

  core.info(`figmaFileKey: ${figmaFileKey}`);
  core.info(`figmaIconFrameId: ${figmaIconFrameId}`);
  core.info(`githubRepo: ${githubRepo}`);
  core.info(`currentBranch: ${currentBranch}`);
  core.info(`owner: ${owner}`);
  core.info(`repo: ${repo}`);

  // svg extracter로 svg 추출

  // 추출된 svg를 github에 push
  // 그러려면 github token이 필요하다.
  // 그리고 pr number를 받아야 한다.

  async function run() {
    core.info("Start svg extracter");

    const { extractSvg } = svgExtracter({
      figmaAccessToken: figmaToken,
      figmaFileKey,
      figmaIconFrameId,
    });

    const svgs = await extractSvg();

    core.debug(JSON.stringify(svgs));

    core.info("Start push to github");

    pushToGithub({
      githubToken,
      owner: owner!,
      repo: repo!,
      contents: svgs,
      message: "Update svg",
      path: "svg",
      targetBranch: currentBranch!,
    });

    core.info("End svg extracter");
  }

  run();
} catch (error) {
  core.setFailed(`Action failed with error ${error}`);
}
