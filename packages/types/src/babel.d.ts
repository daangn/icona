import type { types as t } from "@babel/core";
import type { TemplateBuilder } from "@babel/template";

export interface TemplateVariables {
  componentName: string;
  interfaces: t.TSInterfaceDeclaration[];
  props: (t.ObjectPattern | t.Identifier)[];
  imports: t.ImportDeclaration[];
  exports: (t.VariableDeclaration | t.ExportDeclaration | t.Statement)[];
  jsx: t.JSXElement;
}

export interface TemplateContext {
  options: TemplateContextOptions;
  tpl: TemplateBuilder<TemplateReturn>["ast"];
}

export type TemplateReturn = t.Statement | t.Statement[];

export interface Template {
  (variables: TemplateVariables, context: TemplateContext): TemplateReturn;
}

interface State {
  componentName: string;
  caller?: { previousExport?: string | null };
}

interface JSXRuntimeImport {
  source: string;
  namespace?: string;
  defaultSpecifier?: string;
  specifiers?: string[];
}

export interface TemplateContextOptions {
  typescript?: boolean;
  titleProp?: boolean;
  descProp?: boolean;
  expandProps?: boolean | "start" | "end";
  ref?: boolean;
  template?: Template;
  state: State;
  native?: boolean;
  memo?: boolean;
  exportType?: "named" | "default";
  namedExport?: string;
  jsxRuntime?: "automatic" | "classic";
  jsxRuntimeImport?: JSXRuntimeImport;
  importSource?: string;
}
