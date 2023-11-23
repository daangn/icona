declare const pushToGithub: ({ contents, githubToken, message, owner, path, repo, targetBranch, }: {
    githubToken: string;
    owner: string;
    repo: string;
    path: string;
    contents: {
        name: string;
        svg: string;
    }[];
    message: string;
    targetBranch: string;
}) => Promise<void>;
export { pushToGithub };
