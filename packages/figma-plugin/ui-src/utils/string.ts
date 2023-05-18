export const getFileKey = (url: string) => {
  const match = url.match(/\/file\/([^/]+)\//);
  if (match) {
    return match[1];
  }
  return "";
};

export const parseGithubRepoUrl = (url: string) => {
  const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (match) {
    return {
      owner: match[1],
      name: match[2],
      repo: `${match[1]}/${match[2]}`,
    };
  }
  return null;
};
