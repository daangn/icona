export const getFigmaFileKeyFromUrl = (fileUrl: string) => {
  const match = fileUrl.match(/\/file\/([^/]+)\//);
  if (match) {
    return match[1];
  }
  return "";
};

export const getGithubDataFromUrl = (githubUrl: string) => {
  // Match: github.com/{owner}/{repo} or github.com/{owner}/{repo}/tree/{branch}
  const match = githubUrl.match(
    /github\.com\/([^/]+)\/([^/]+)(?:\/tree\/(.+))?/,
  );
  if (match) {
    return {
      owner: match[1],
      name: match[2],
      branch: match[3] || "main", // default to "main" if no branch specified
    };
  }
  return null;
};
