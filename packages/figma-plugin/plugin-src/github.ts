import { generateSvgActionTemplate } from "./templates";

const GITHUB_API_VERSION = "2022-11-28";

export function createGithubClient(
  repoOwner: string,
  repoName: string,
  accessToken: string,
) {
  const ACCESS_TOKEN = accessToken;
  const API_URL = `https://api.github.com/repos/${repoOwner}/${repoName}`;

  async function uploadBlob(
    content: string,
    encoding: "utf-8" | "base64" = "utf-8",
  ): Promise<{ sha: string; mode: string; type: string }> {
    return fetch(`${API_URL}/git/blobs`, {
      method: "POST",
      headers: {
        Authorization: `token ${ACCESS_TOKEN}`,
        "X-GitHub-Api-Version": GITHUB_API_VERSION,
      },
      body: JSON.stringify({
        content,
        encoding,
      }),
    }).then((res) => res.json());
  }

  async function getHead(branch: string): Promise<{ object: { sha: string } }> {
    return fetch(`${API_URL}/git/refs/heads/${branch}`, {
      headers: {},
    }).then((res) => res.json());
  }

  // async function getContent(
  //   path: string,
  // ): Promise<{ sha: string; content: string }> {
  //   return fetch(`${API_URL}/contents/${path}`, {
  //     method: "GET",
  //     headers: {
  //       Authorization: `token ${ACCESS_TOKEN}`,
  //       "X-GitHub-Api-Version": GITHUB_API_VERSION,
  //     },
  //   }).then((res) => res.json());
  // }

  // async function createContent(
  //   path: string,
  //   content: string,
  //   message: string,
  // ): Promise<{ commit: { sha: string } }> {
  //   return fetch(`${API_URL}/contents/${path}`, {
  //     method: "PUT",
  //     headers: {
  //       Authorization: `token ${ACCESS_TOKEN}`,
  //       "X-GitHub-Api-Version": GITHUB_API_VERSION,
  //     },
  //     body: JSON.stringify({
  //       message,
  //       content,
  //       committer: {
  //         name: "GitHub Action",
  //         email: "41898282+github-actions[bot]@users.noreply.github.com",
  //       },
  //     }),
  //   }).then((res) => res.json());
  // }

  async function createBranch(name: string, sha: string) {
    return fetch(`${API_URL}/git/refs`, {
      method: "POST",
      headers: {
        "X-GitHub-Api-Version": GITHUB_API_VERSION,
        Authorization: `token ${ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        ref: `refs/heads/${name}`,
        sha,
      }),
    }).then((res) => res.json());
  }

  async function createTree(
    body: { path: string; mode: string; type: string; sha: string }[],
    baseTree: string,
  ): Promise<{
    sha: string;
    tree: { path: string; mode: string; type: string; sha: string }[];
  }> {
    return fetch(`${API_URL}/git/trees`, {
      method: "POST",
      headers: {
        "X-GitHub-Api-Version": GITHUB_API_VERSION,
        Authorization: `token ${ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        tree: body,
        base_tree: baseTree,
      }),
    }).then((res) => res.json());
  }

  async function createCommit(
    tree: string,
    message: string,
    parents: string[],
  ): Promise<{ sha: string }> {
    return fetch(`${API_URL}/git/commits`, {
      method: "POST",
      headers: {
        "X-GitHub-Api-Version": GITHUB_API_VERSION,
        Authorization: `token ${ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        tree: tree,
        message: message,
        parents: parents,
      }),
    }).then((res) => res.json());
  }

  async function updateRef(branch: string, commit: string) {
    return fetch(`${API_URL}/git/refs/heads/${branch}`, {
      method: "PATCH",
      headers: {
        "X-GitHub-Api-Version": GITHUB_API_VERSION,
        Authorization: `token ${ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        sha: commit,
      }),
    }).then((res) => res.json());
  }

  async function createPullRequest(
    head: string,
    base: string,
    title: string,
    body: string,
  ) {
    return fetch(`${API_URL}/pulls`, {
      method: "POST",
      headers: {
        "X-GitHub-Api-Version": GITHUB_API_VERSION,
        Authorization: `token ${ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        head: head,
        base: base,
        title: title,
        body: body,
      }),
    }).then((res) => res.json());
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

  async function createDeployPR(svgs: { name: string; svg: string }[]) {
    const baseBranch = "main";
    const newBranch = `icona-update-${new Date().getTime()}`;
    const prTitle = "[Icona]: Update Icons";
    const commitTitle = "feat: update icons.json";

    const head = await getHead(baseBranch);

    const json = svgs.map((file) => ({
      name: file.name,
      svg: file.svg,
    }));

    const treeBody = await uploadBlob(JSON.stringify(json)).then((blob) => ({
      path: `.icona/icons.json`,
      mode: "100644",
      type: "blob",
      sha: blob.sha,
    }));

    const tree = await createTree([treeBody], head.object.sha);
    const commit = await createCommit(tree.sha, commitTitle, [head.object.sha]);

    await createBranch(newBranch, head.object.sha);
    await updateRef(newBranch, commit.sha);
    await createPullRequest(newBranch, baseBranch, prTitle, "");
  }

  return { createSettingPR, createDeployPR };
}
