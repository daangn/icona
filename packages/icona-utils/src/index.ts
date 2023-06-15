// TODO: Need test code for this file.
import type { IconaConfig, IconaIconData } from "@icona/types";
import findup from "findup-sync";
import { existsSync, mkdirSync, readFileSync } from "fs";
import { dirname, resolve } from "path";

export const ICONA_FOLDER = ".icona";
export const ICONA_ICONS_FILE = "icons.json";
export const ICONA_CONFIG_FILE = "config.json";

export const getProjectRootPath = () => {
  return resolve(dirname(findup("package.json")!));
};

export const getIconaFolderPath = () => {
  return resolve(getProjectRootPath(), ICONA_FOLDER);
};

export const getIconaIconsPath = () => {
  return resolve(getIconaFolderPath(), ICONA_ICONS_FILE);
};

export const getIconaConfigPath = () => {
  return resolve(getIconaFolderPath(), ICONA_CONFIG_FILE);
};

export const getIconaIconsFile = () => {
  if (!existsSync(getIconaIconsPath())) {
    return null;
  }

  return JSON.parse(
    readFileSync(getIconaIconsPath(), "utf-8"),
  ) as IconaIconData[];
};

export const getIconaConfigFile = () => {
  if (!existsSync(getIconaConfigPath())) {
    return null;
  }

  return JSON.parse(readFileSync(getIconaConfigPath(), "utf-8")) as IconaConfig;
};

export const makeFolderIfNotExistFromRoot = (targetPath: string) => {
  const projectPath = getProjectRootPath();
  if (!existsSync(resolve(projectPath, targetPath))) {
    mkdirSync(resolve(projectPath, targetPath));
  }
};
