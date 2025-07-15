import type { IconaIconData } from "@icona/types";

import { generateSvgActionTemplate } from "./templates";

const GITHUB_API_VERSION = "2022-11-28";

export function createGithubClient(
  repoOwner: string,
  repoName: string,
  accessToken: string,
  githubBaseUrl?: string, // 추가된 매개변수
) {
  const ACCESS_TOKEN = accessToken;

  // GitHub Enterprise 지원을 위한 동적 API URL 설정
  const baseUrl = githubBaseUrl || "https://api.github.com";
  const API_URL = `${baseUrl}/repos/${repoOwner}/${repoName}`;

  async function uploadBlob(
    content: string,
    encoding: "utf-8" | "base64" = "utf-8",
  ): Promise<{ sha: string; mode: string; type: string }> {
    const response = await fetch(`${API_URL}/git/blobs`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`, // token -> Bearer로 통일
        "X-GitHub-Api-Version": GITHUB_API_VERSION,
        Accept: "application/vnd.github+json",
      },
      body: JSON.stringify({
        content,
        encoding,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to upload blob: ${response.status} ${response.statusText}`,
      );
    }

    return response.json();
  }

  async function getHead(branch: string): Promise<{ object: { sha: string } }> {
    const response = await fetch(`${API_URL}/git/ref/heads/${branch}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": GITHUB_API_VERSION,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to get head: ${response.status} ${response.statusText}`,
      );
    }

    return response.json();
  }

  async function createBranch(name: string, sha: string) {
    const response = await fetch(`${API_URL}/git/refs`, {
      method: "POST",
      headers: {
        "X-GitHub-Api-Version": GITHUB_API_VERSION,
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        Accept: "application/vnd.github+json",
      },
      body: JSON.stringify({
        ref: `refs/heads/${name}`,
        sha,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to create branch: ${response.status} ${response.statusText}`,
      );
    }

    return response.json();
  }

  async function createTree(
    body: { path: string; mode: string; type: string; sha: string }[],
    baseTree: string,
  ): Promise<{
    sha: string;
    tree: { path: string; mode: string; type: string; sha: string }[];
  }> {
    const response = await fetch(`${API_URL}/git/trees`, {
      method: "POST",
      headers: {
        "X-GitHub-Api-Version": GITHUB_API_VERSION,
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        Accept: "application/vnd.github+json",
      },
      body: JSON.stringify({
        tree: body,
        base_tree: baseTree,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to create tree: ${response.status} ${response.statusText}`,
      );
    }

    return response.json();
  }

  async function createCommit(
    tree: string,
    message: string,
    parents: string[],
  ): Promise<{ sha: string }> {
    const response = await fetch(`${API_URL}/git/commits`, {
      method: "POST",
      headers: {
        "X-GitHub-Api-Version": GITHUB_API_VERSION,
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        Accept: "application/vnd.github+json",
      },
      body: JSON.stringify({
        tree: tree,
        message: message,
        parents: parents,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to create commit: ${response.status} ${response.statusText}`,
      );
    }

    return response.json();
  }

  async function updateRef(branch: string, commit: string) {
    const response = await fetch(`${API_URL}/git/refs/heads/${branch}`, {
      method: "PATCH",
      headers: {
        "X-GitHub-Api-Version": GITHUB_API_VERSION,
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        Accept: "application/vnd.github+json",
      },
      body: JSON.stringify({
        sha: commit,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to update ref: ${response.status} ${response.statusText}`,
      );
    }

    return response.json();
  }

  async function createPullRequest(
    head: string,
    base: string,
    title: string,
    body: string,
  ) {
    const response = await fetch(`${API_URL}/pulls`, {
      method: "POST",
      headers: {
        "X-GitHub-Api-Version": GITHUB_API_VERSION,
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        Accept: "application/vnd.github+json",
      },
      body: JSON.stringify({
        head: head,
        base: base,
        title: title,
        body: body,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to create pull request: ${response.status} ${response.statusText}`,
      );
    }

    return response.json();
  }

  async function createSettingPR() {
    const baseBranch = "main";
    const newBranch = `icona-setting-${new Date().getTime()}`;
    const commitTitle = "chore: add icona.yml";

    const prTitle = "[Icona]: Setting";
    const prBody = "This PR is created by Icona.";

    const head = await getHead(baseBranch);

    const svgActionBlob = await uploadBlob(generateSvgActionTemplate);
    const svgActionTree = await createTree(
      [
        {
          path: "workflows/icona-generate-svg-files.yml",
          mode: "100644",
          type: "blob",
          sha: svgActionBlob.sha,
        },
      ],
      head.object.sha,
    );

    const workflowsTree = svgActionTree.tree.find(
      (tree) => tree.path === "workflows",
    )!;

    const newTree = await createTree(
      [
        {
          path: ".github/workflows",
          mode: "040000",
          type: "tree",
          sha: workflowsTree.sha,
        },
      ],
      head.object.sha,
    );

    const commit = await createCommit(newTree.sha, commitTitle, [
      head.object.sha,
    ]);

    await createBranch(newBranch, head.object.sha);
    await updateRef(newBranch, commit.sha);
    await createPullRequest(newBranch, baseBranch, prTitle, prBody);
  }

  async function createDeployPR(
    svgs: Record<string, IconaIconData>,
    iconaFileName?: string,
  ) {
    const baseBranch = "main";
    const newBranch = `icona-update-${new Date().getTime()}`;

    const fileName = iconaFileName || "icons";
    const prTitle = `[Icona]: Update \`./icona/${fileName}.json\``;
    const commitTitle = `feat: update ./icona/${fileName}.json`;

    const head = await getHead(baseBranch);

    const treeBody = await uploadBlob(JSON.stringify(svgs, null, 2)).then(
      (blob) => ({
        path: `.icona/${fileName}.json`,
        mode: "100644",
        type: "blob",
        sha: blob.sha,
      }),
    );

    const tree = await createTree([treeBody], head.object.sha);
    const commit = await createCommit(tree.sha, commitTitle, [head.object.sha]);

    await createBranch(newBranch, head.object.sha);
    await updateRef(newBranch, commit.sha);
    await createPullRequest(newBranch, baseBranch, prTitle, "");
  }

  return { createSettingPR, createDeployPR };
}
