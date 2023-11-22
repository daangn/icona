export interface GithubData {
  owner: string;
  name: string;
  apiKey: string;
}

export interface IconaMetaData {
  githubData: GithubData;
  options?: {
    withPng?: boolean;
  };
}
