export interface GithubData {
  owner: string;
  name: string;
  apiKey: string;
  branch: string;
}

export interface ExportOptions {
  png: {
    "1x": boolean;
    "2x": boolean;
    "3x": boolean;
    "4x": boolean;
  };
}
