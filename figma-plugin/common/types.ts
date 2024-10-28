export interface GithubData {
  owner: string;
  name: string;
  apiKey: string;
}

export interface ExportOptions {
  png: PngOptionPayload;
  fileName: string;
}

export interface PngOptionPayload {
  "1x": boolean;
  "2x": boolean;
  "3x": boolean;
  "4x": boolean;
}
