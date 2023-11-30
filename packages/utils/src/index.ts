// TODO: Need test code for this file.
import type { IconaIconData } from "@icona/types";
import findup from "findup-sync";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  unlinkSync,
  writeFileSync,
} from "fs";
import path, { dirname, resolve } from "path";

export const ICONA_FOLDER = ".icona";
export const ICONA_ICONS_FILE = "icons.json";

export const ICONA_CONFIG_FILE_NAME = "icona.config";

export const getProjectRootPath = () => {
  const packageJsonPath = findup("package.json");
  if (!packageJsonPath) {
    throw new Error(
      "There is no package.json file in your project, Icona need package.json file in your project root path",
    );
  }
  return resolve(dirname(packageJsonPath));
};

export const getIconaFolderPath = () => {
  return resolve(getProjectRootPath(), ICONA_FOLDER);
};

export const getIconaIconsPath = () => {
  return resolve(getIconaFolderPath(), ICONA_ICONS_FILE);
};

export const getIconaConfigPath = () => {
  const ts = resolve(getProjectRootPath(), `${ICONA_CONFIG_FILE_NAME}.ts`);
  const js = resolve(getProjectRootPath(), `${ICONA_CONFIG_FILE_NAME}.js`);

  if (!existsSync(ts) && !existsSync(js)) {
    throw new Error(
      `There is no ${ICONA_CONFIG_FILE_NAME}.ts or ${ICONA_CONFIG_FILE_NAME}.js file in your project, Icona need ${ICONA_CONFIG_FILE_NAME}.ts or ${ICONA_CONFIG_FILE_NAME}.js file in your project root path`,
    );
  }

  if (existsSync(ts)) {
    return ts;
  }

  return js;
};

export const getIconaIconsFile = () => {
  if (!existsSync(getIconaIconsPath())) {
    return null;
  }

  return JSON.parse(readFileSync(getIconaIconsPath(), "utf-8")) as Record<
    string,
    IconaIconData
  >;
};

export const makeFolderIfNotExistFromRoot = (targetPath: string) => {
  const projectPath = getProjectRootPath();
  if (!existsSync(resolve(projectPath, targetPath))) {
    mkdirSync(resolve(projectPath, targetPath));
  }
};

export const generateConfigFile = (config: string) => {
  const configPath = getIconaConfigPath();
  const iconaFolderPath = getIconaFolderPath();

  makeFolderIfNotExistFromRoot(iconaFolderPath);

  writeFileSync(configPath, config);
};

export const deleteAllFilesInDir = (dirPath: string) => {
  try {
    readdirSync(dirPath).forEach((file) => {
      unlinkSync(path.join(dirPath, file));
    });
  } catch (error) {
    console.log(error);
  }
};
