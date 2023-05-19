export const getFigmaFileKeyFromUrl = (fileUrl: string) => {
  const match = fileUrl.match(/\/file\/([^/]+)\//);
  if (match) {
    return match[1];
  }
  return "";
};

export const getGithubDataFromUrl = (githubUrl: string) => {
  const match = githubUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (match) {
    return {
      owner: match[1],
      name: match[2],
      // NOTE: This is not used currently
      // repo: `${match[1]}/${match[2]}`,
    };
  }
  return null;
};
