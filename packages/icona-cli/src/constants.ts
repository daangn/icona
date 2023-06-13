import findup from "findup-sync";
import path from "path";

export const ICONS_FILE = ".icona/icons.json";
export const ICONS_PATH = findup(ICONS_FILE);
export const PROJECT_PATH = path.resolve(path.dirname(findup("package.json")!));
