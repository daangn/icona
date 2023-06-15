// NOTE(@junghyeonsu): Function type이 typescript-json-schema 에서 지원되지 않아서 Function 타입으로 대체

import type { Options as Options$1 } from "@svgr/babel-preset";
import type { Options } from "prettier";

import type { TransformOptions } from "./babel.core";
import type { Config as Config$1 } from "./svgo";

interface State {
  filePath?: string;
  componentName: string;
  caller?: {
    name?: string;
    previousExport?: string | null;
    defaultPlugins?: ConfigPlugin[];
  };
}

interface Plugin {
  (code: string, config: Config, state: State): string;
}
type ConfigPlugin = string | Plugin;

export interface Config {
  ref?: boolean;
  titleProp?: boolean;
  descProp?: boolean;
  expandProps?: boolean | "start" | "end";
  dimensions?: boolean;
  icon?: boolean | string | number;
  native?: boolean;
  svgProps?: {
    [key: string]: string;
  };
  replaceAttrValues?: {
    [key: string]: string;
  };
  runtimeConfig?: boolean;
  typescript?: boolean;
  prettier?: boolean;
  prettierConfig?: Options;
  svgo?: boolean;
  svgoConfig?: Config$1;
  configFile?: string;
  template?: Options$1["template"];
  memo?: boolean;
  exportType?: "named" | "default";
  namedExport?: string;
  jsxRuntime?: "classic" | "classic-preact" | "automatic";
  jsxRuntimeImport?: {
    source: string;
    namespace?: string;
    specifiers?: string[];
    defaultSpecifier?: string;
  };
  index?: boolean;
  plugins?: ConfigPlugin[];
  jsx?: {
    babelConfig?: TransformOptions;
  };
}
