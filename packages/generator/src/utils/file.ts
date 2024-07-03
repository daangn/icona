import type { IconaIconData } from "@icona/types";
import findup from "findup-sync";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  unlinkSync,
} from "fs";
import { dirname, join, resolve } from "path";

import { ICONA_FOLDER, ICONA_ICONS_FILE } from "../constants";

const getProjectRootPath = (): string => {
  const packageJsonPath = findup("package.json");
  if (!packageJsonPath) {
    throw new Error(
      "No package.json file found in the project. Icona requires a package.json file in the root path.",
    );
  }
  return resolve(dirname(packageJsonPath));
};

const getIconaFolderPath = (): string =>
  resolve(getProjectRootPath(), ICONA_FOLDER);

const getIconaIconsPath = (): string =>
  resolve(getIconaFolderPath(), ICONA_ICONS_FILE);

const getIconaIconsFile = (): Record<string, IconaIconData> | null => {
  const iconsPath = getIconaIconsPath();
  if (!existsSync(iconsPath)) return null;

  try {
    return JSON.parse(readFileSync(iconsPath, "utf-8"));
  } catch (error) {
    throw new Error("Failed to read or parse icons.json file.");
  }
};

const makeFolderIfNotExistFromRoot = (targetPath: string): void => {
  const projectPath = getProjectRootPath();
  const fullPath = resolve(projectPath, targetPath);
  if (!existsSync(fullPath)) {
    mkdirSync(fullPath, { recursive: true });
  }
};

const deleteAllFilesInDir = (dirPath: string): void => {
  if (!existsSync(dirPath)) {
    console.log(`Directory ${dirPath} does not exist.`);
    return;
  }

  try {
    readdirSync(dirPath).forEach((file) => {
      unlinkSync(join(dirPath, file));
    });
  } catch (error) {
    console.error(`Error while deleting files in directory ${dirPath}:`, error);
  }
};

const getTargetPath = (path: string): string => {
  const projectPath = getProjectRootPath();
  return resolve(projectPath, path);
};

export {
  deleteAllFilesInDir,
  getIconaFolderPath,
  getIconaIconsFile,
  getIconaIconsPath,
  getProjectRootPath,
  getTargetPath,
  makeFolderIfNotExistFromRoot,
};
