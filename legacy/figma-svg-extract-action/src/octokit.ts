import * as core from "@actions/core";
import { Octokit } from "@octokit/core";

const octokitClient = (githubToken: string) => {
  const octokit = new Octokit({
    auth: githubToken,
  });

  return octokit;
};

const pushToGithub = async ({
  contents,
  githubToken,
  message,
  owner,
  path,
  repo,
  targetBranch,
}: {
  githubToken: string;
  owner: string;
  repo: string;
  path: string;
  contents: { name: string; svg: string }[];
  message: string;
  targetBranch: string;
}) => {
  const octokit = octokitClient(githubToken);

  const { data: targetBranchTree } = await octokit.request(
    "GET /repos/{owner}/{repo}/branches/{branch}",
    {
      owner,
      repo,
      branch: targetBranch,
    },
  );

  const { data: baseTree } = await octokit.request(
    "GET /repos/{owner}/{repo}/git/trees/{tree_sha}",
    {
      owner,
      repo,
      tree_sha: targetBranchTree.commit.sha,
    },
  );

  const blobs = await Promise.all(
    contents.map((content) =>
      octokit
        .request("POST /repos/{owner}/{repo}/git/blobs", {
          owner,
          repo,
          content: content.svg,
          encoding: "utf-8",
        })
        .then((blob) => ({
          name: content.name,
          data: blob.data,
        })),
    ),
  );

  type TreeBlob = {
    path?: string | undefined;
    mode?: "100644" | "100755" | "040000" | "160000" | "120000" | undefined;
    type?: "commit" | "blob" | "tree" | undefined;
    sha?: string | null | undefined;
    content?: string | undefined;
  };

  const treeBlobs = blobs.map((blob) => {
    return {
      path: path ? `${path}/${blob.name}.svg` : `${blob.name}.svg`,
      mode: "100644",
      type: "blob",
      sha: blob.data.sha,
    };
  }) as TreeBlob[];

  const tree = await octokit.request("POST /repos/{owner}/{repo}/git/trees", {
    owner,
    repo,
    base_tree: baseTree.sha,
    tree: treeBlobs,
  });

  const commit = await octokit.request(
    "POST /repos/{owner}/{repo}/git/commits",
    {
      owner,
      repo,
      message,
      tree: tree.data.sha,
      parents: [targetBranchTree.commit.sha],
    },
  );

  const currentRef = await octokit.request(
    "GET /repos/{owner}/{repo}/git/ref/{ref}",
    {
      owner,
      repo,
      ref: `heads/${targetBranch}`,
    },
  );

  core.info(`currentRef.data.ref: ${currentRef.data.ref}`);

  await octokit.request("PATCH /repos/{owner}/{repo}/git/refs/{ref}", {
    owner,
    repo,
    ref: `heads/${targetBranch}`,
    sha: commit.data.sha,
    force: true,
  });
};

export { pushToGithub };
