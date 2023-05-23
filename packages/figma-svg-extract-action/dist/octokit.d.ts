declare const pushToGithub: ({ contents, githubToken, message, owner, repo, targetBranch, }: {
    githubToken: string;
    owner: string;
    repo: string;
    contents: {
        name: string;
        svg: string;
    }[];
    message: string;
    targetBranch: string;
}) => Promise<void>;
export { pushToGithub };
