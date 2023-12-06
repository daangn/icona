export interface GithubData {
  owner: string;
  name: string;
  apiKey: string;
}

export interface ExportOptions {
  png: {
    x1: boolean;
    x2: boolean;
    x3: boolean;
    x4: boolean;
  };
}
