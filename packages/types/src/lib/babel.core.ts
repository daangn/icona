// NOTE(@junghyeonsu): Function type이 typescript-json-schema 에서 지원되지 않아서 Function 타입으로 대체

/**
 * Source map standard format as to revision 3
 * @see {@link https://sourcemaps.info/spec.html}
 * @see {@link https://github.com/mozilla/source-map/blob/HEAD/source-map.d.ts}
 */
interface InputSourceMap {
  version: number;
  sources: string[];
  names: string[];
  sourceRoot?: string | undefined;
  sourcesContent?: string[] | undefined;
  mappings: string;
  file: string;
}

interface TransformCaller {
  // the only required property
  name: string;
  // e.g. set to true by `babel-loader` and false by `babel-jest`
  supportsStaticESM?: boolean | undefined;
  supportsDynamicImport?: boolean | undefined;
  supportsExportNamespaceFrom?: boolean | undefined;
  supportsTopLevelAwait?: boolean | undefined;
  // augment this with a "declare module '@babel/core' { ... }" if you need more keys
}

interface MatchPatternContext {
  envName: string;
  dirname: string;
  caller: TransformCaller | undefined;
}

// A babel plugin is a simple function which must return an object matching
// the following interface. Babel will throw if it finds unknown properties.
// The list of allowed plugin keys is here:
// https://github.com/babel/babel/blob/4e50b2d9d9c376cee7a2cbf56553fe5b982ea53c/packages/babel-core/src/config/option-manager.js#L71
interface PluginObj<S = PluginPass> {
  name?: string | undefined;
  manipulateOptions?(opts: any, parserOpts: any): Function;
  pre?(this: S, file: BabelFile): Function;
  // visitor: Visitor<S>;
  post?(this: S, file: BabelFile): Function;
  inherits?: any;
}

interface BabelFile {
  // ast: t.File;
  opts: TransformOptions;
  // hub: Hub;
  metadata: object;
  // path: NodePath<t.Program>;
  // scope: Scope;
  inputMap: object | null;
  code: string;
}

interface PluginPass {
  file: BabelFile;
  key: string;
  opts: object;
  cwd: string;
  filename: string | undefined;
  get(key: unknown): any;
  set(key: unknown, value: unknown): Function;
  [key: string]: unknown;
}

interface ConfigItem {
  /**
   * The name that the user gave the plugin instance, e.g. `plugins: [ ['env', {}, 'my-env'] ]`
   */
  name?: string | undefined;

  /**
   * The resolved value of the plugin.
   */
  value: object | ((...args: any[]) => any);

  /**
   * The options object passed to the plugin.
   */
  options?: object | false | undefined;

  /**
   * The path that the options are relative to.
   */
  dirname: string;

  /**
   * Information about the plugin's file, if Babel knows it.
   *  *
   */
  file?:
    | {
        /**
         * The file that the user requested, e.g. `"@babel/env"`
         */
        request: string;

        /**
         * The full path of the resolved file, e.g. `"/tmp/node_modules/@babel/preset-env/lib/index.js"`
         */
        resolved: string;
      }
    | null
    | undefined;
}

// A babel plugin is a simple function which must return an object matching
// the following interface. Babel will throw if it finds unknown properties.
// The list of allowed plugin keys is here:
// https://github.com/babel/babel/blob/4e50b2d9d9c376cee7a2cbf56553fe5b982ea53c/packages/babel-core/src/config/option-manager.js#L71
interface PluginObj<S = PluginPass> {
  name?: string | undefined;
  manipulateOptions?(opts: any, parserOpts: any): Function;
  pre?(this: S, file: BabelFile): Function;
  // visitor: Visitor<S>;
  post?(this: S, file: BabelFile): Function;
  inherits?: any;
}

interface ConfigItem {
  /**
   * The name that the user gave the plugin instance, e.g. `plugins: [ ['env', {}, 'my-env'] ]`
   */
  name?: string | undefined;

  /**
   * The resolved value of the plugin.
   */
  value: object | ((...args: any[]) => any);

  /**
   * The options object passed to the plugin.
   */
  options?: object | false | undefined;

  /**
   * The path that the options are relative to.
   */
  dirname: string;

  /**
   * Information about the plugin's file, if Babel knows it.
   *  *
   */
  file?:
    | {
        /**
         * The file that the user requested, e.g. `"@babel/env"`
         */
        request: string;

        /**
         * The full path of the resolved file, e.g. `"/tmp/node_modules/@babel/preset-env/lib/index.js"`
         */
        resolved: string;
      }
    | null
    | undefined;
}

type PluginOptions = object | undefined | false;

type PluginTarget = string | object | ((...args: any[]) => any);

type PluginItem =
  | ConfigItem
  | PluginObj<any>
  | PluginTarget
  | [PluginTarget, PluginOptions]
  | [PluginTarget, PluginOptions, string | undefined];

interface ParserOptions {
  /**
   * By default, import and declarations can only appear at a program's top level.
   * Setting this option to true allows them anywhere where a statement is allowed.
   */
  allowImportExportEverywhere?: boolean;

  /**
   * By default, await use is not allowed outside of an async function.
   * Set this to true to accept such code.
   */
  allowAwaitOutsideFunction?: boolean;

  /**
   * By default, a return statement at the top level raises an error.
   * Set this to true to accept such code.
   */
  allowReturnOutsideFunction?: boolean;

  /**
   * By default, new.target use is not allowed outside of a function or class.
   * Set this to true to accept such code.
   */
  allowNewTargetOutsideFunction?: boolean;

  allowSuperOutsideMethod?: boolean;

  /**
   * By default, exported identifiers must refer to a declared variable.
   * Set this to true to allow statements to reference undeclared variables.
   */
  allowUndeclaredExports?: boolean;

  /**
   * By default, Babel parser JavaScript code according to Annex B syntax.
   * Set this to `false` to disable such behavior.
   */
  annexB?: boolean;

  /**
   * By default, Babel attaches comments to adjacent AST nodes.
   * When this option is set to false, comments are not attached.
   * It can provide up to 30% performance improvement when the input code has many comments.
   * @babel/eslint-parser will set it for you.
   * It is not recommended to use attachComment: false with Babel transform,
   * as doing so removes all the comments in output code, and renders annotations such as
   * /* istanbul ignore next *\/ nonfunctional.
   */
  attachComment?: boolean;

  /**
   * By default, Babel always throws an error when it finds some invalid code.
   * When this option is set to true, it will store the parsing error and
   * try to continue parsing the invalid input file.
   */
  errorRecovery?: boolean;

  /**
   * Indicate the mode the code should be parsed in.
   * Can be one of "script", "module", or "unambiguous". Defaults to "script".
   * "unambiguous" will make @babel/parser attempt to guess, based on the presence
   * of ES6 import or statements.
   * Files with ES6 imports and exports are considered "module" and are otherwise "script".
   */
  sourceType?: "script" | "module" | "unambiguous";

  /**
   * Correlate output AST nodes with their source filename.
   * Useful when generating code and source maps from the ASTs of multiple input files.
   */
  sourceFilename?: string;

  /**
   * By default, the first line of code parsed is treated as line 1.
   * You can provide a line number to alternatively start with.
   * Useful for integration with other source tools.
   */
  startLine?: number;

  /**
   * By default, the parsed code is treated as if it starts from line 1, column 0.
   * You can provide a column number to alternatively start with.
   * Useful for integration with other source tools.
   */
  startColumn?: number;

  /**
   * Array containing the plugins that you want to enable.
   */
  plugins?: any[];

  /**
   * Should the parser work in strict mode.
   * Defaults to true if sourceType === 'module'. Otherwise, false.
   */
  strictMode?: boolean;

  /**
   * Adds a ranges property to each node: [node.start, node.end]
   */
  ranges?: boolean;

  /**
   * Adds all parsed tokens to a tokens property on the File node.
   */
  tokens?: boolean;

  /**
   * By default, the parser adds information about parentheses by setting
   * `extra.parenthesized` to `true` as needed.
   * When this option is `true` the parser creates `ParenthesizedExpression`
   * AST nodes instead of using the `extra` property.
   */
  createParenthesizedExpressions?: boolean;
}

interface MatchPatternContext {
  envName: string;
  dirname: string;
  caller: TransformCaller | undefined;
}

interface GeneratorOptions {
  /**
   * Optional string to add as a block comment at the start of the output file.
   */
  auxiliaryCommentBefore?: string | undefined;

  /**
   * Optional string to add as a block comment at the end of the output file.
   */
  auxiliaryCommentAfter?: string | undefined;

  /**
   * Function that takes a comment (as a string) and returns true if the comment should be included in the output.
   * By default, comments are included if `opts.comments` is `true` or if `opts.minifed` is `false` and the comment
   * contains `@preserve` or `@license`.
   */
  shouldPrintComment?(comment: string): boolean;

  /**
   * Attempt to use the same line numbers in the output code as in the source code (helps preserve stack traces).
   * Defaults to `false`.
   */
  retainLines?: boolean | undefined;

  /**
   * Retain parens around function expressions (could be used to change engine parsing behavior)
   * Defaults to `false`.
   */
  retainFunctionParens?: boolean | undefined;

  /**
   * Should comments be included in output? Defaults to `true`.
   */
  comments?: boolean | undefined;

  /**
   * Set to true to aFunction adding whitespace for formatting. Defaults to the value of `opts.minified`.
   */
  compact?: boolean | "auto" | undefined;

  /**
   * Should the output be minified. Defaults to `false`.
   */
  minified?: boolean | undefined;

  /**
   * Set to true to reduce whitespace (but not as much as opts.compact). Defaults to `false`.
   */
  concise?: boolean | undefined;

  /**
   * Used in warning messages
   */
  filename?: string | undefined;

  /**
   * Enable generating source maps. Defaults to `false`.
   */
  sourceMaps?: boolean | undefined;

  /**
   * A root for all relative URLs in the source map.
   */
  sourceRoot?: string | undefined;

  /**
   * The filename for the source code (i.e. the code in the `code` argument).
   * This will only be used if `code` is a string.
   */
  sourceFileName?: string | undefined;

  /**
   * Set to true to run jsesc with "json": true to print "\u00A9" vs. "©";
   */
  jsonCompatibleStrings?: boolean | undefined;

  /**
   * Set to true to enable support for experimental decorators syntax before module exports.
   * Defaults to `false`.
   */
  decoratorsBeforeExport?: boolean | undefined;

  /**
   * Options for outputting jsesc representation.
   */
  jsescOption?:
    | {
        /**
         * The default value for the quotes option is 'single'. This means that any occurrences of ' in the input
         * string are escaped as \', so that the output can be used in a string literal wrapped in single quotes.
         */
        quotes?: "single" | "double" | "backtick" | undefined;

        /**
         * The default value for the numbers option is 'decimal'. This means that any numeric values are represented
         * using decimal integer literals. Other valid options are binary, octal, and hexadecimal, which result in
         * binary integer literals, octal integer literals, and hexadecimal integer literals, respectively.
         */
        numbers?: "binary" | "octal" | "decimal" | "hexadecimal" | undefined;

        /**
         * The wrap option takes a boolean value (true or false), and defaults to false (disabled). When enabled, the
         * output is a valid JavaScript string literal wrapped in quotes. The type of quotes can be specified through
         * the quotes setting.
         */
        wrap?: boolean | undefined;

        /**
         * The es6 option takes a boolean value (true or false), and defaults to false (disabled). When enabled, any
         * astral Unicode symbols in the input are escaped using ECMAScript 6 Unicode code point escape sequences
         * instead of using separate escape sequences for each surrogate half. If backwards compatibility with ES5
         * environments is a concern, don’t enable this setting. If the json setting is enabled, the value for the es6
         * setting is ignored (as if it was false).
         */
        es6?: boolean | undefined;

        /**
         * The escapeEverything option takes a boolean value (true or false), and defaults to false (disabled). When
         * enabled, all the symbols in the output are escaped — even printable ASCII symbols.
         */
        escapeEverything?: boolean | undefined;

        /**
         * The minimal option takes a boolean value (true or false), and defaults to false (disabled). When enabled,
         * only a limited set of symbols in the output are escaped: \0, \b, \t, \n, \f, \r, \\, \u2028, \u2029.
         */
        minimal?: boolean | undefined;

        /**
         * The isScriptContext option takes a boolean value (true or false), and defaults to false (disabled). When
         * enabled, occurrences of </script and </style in the output are escaped as <\/script and <\/style, and <!--
         * is escaped as \x3C!-- (or \u003C!-- when the json option is enabled). This setting is useful when jsesc’s
         * output ends up as part of a <script> or <style> element in an HTML document.
         */
        isScriptContext?: boolean | undefined;

        /**
         * The compact option takes a boolean value (true or false), and defaults to true (enabled). When enabled,
         * the output for arrays and objects is as compact as possible; it’s not formatted nicely.
         */
        compact?: boolean | undefined;

        /**
         * The indent option takes a string value, and defaults to '\t'. When the compact setting is enabled (true),
         * the value of the indent option is used to format the output for arrays and objects.
         */
        indent?: string | undefined;

        /**
         * The indentLevel option takes a numeric value, and defaults to 0. It represents the current indentation level,
         * i.e. the number of times the value of the indent option is repeated.
         */
        indentLevel?: number | undefined;

        /**
         * The json option takes a boolean value (true or false), and defaults to false (disabled). When enabled, the
         * output is valid JSON. Hexadecimal character escape sequences and the \v or \0 escape sequences are not used.
         * Setting json: true implies quotes: 'double', wrap: true, es6: false, although these values can still be
         * overridden if needed — but in such cases, the output won’t be valid JSON anymore.
         */
        json?: boolean | undefined;

        /**
         * The lowercaseHex option takes a boolean value (true or false), and defaults to false (disabled). When enabled,
         * any alphabetical hexadecimal digits in escape sequences as well as any hexadecimal integer literals (see the
         * numbers option) in the output are in lowercase.
         */
        lowercaseHex?: boolean | undefined;
      }
    | undefined;
}

/**
 * Source map standard format as to revision 3
 * @see {@link https://sourcemaps.info/spec.html}
 * @see {@link https://github.com/mozilla/source-map/blob/HEAD/source-map.d.ts}
 */
interface InputSourceMap {
  version: number;
  sources: string[];
  names: string[];
  sourceRoot?: string | undefined;
  sourcesContent?: string[] | undefined;
  mappings: string;
  file: string;
}

type MatchPattern =
  | string
  | RegExp
  | ((filename: string | undefined, context: MatchPatternContext) => boolean);

export interface TransformOptions {
  /**
   * Specify which assumptions it can make about your code, to better optimize the compilation result. **NOTE**: This replaces the various `loose` options in plugins in favor of
   * top-level options that can apply to multiple plugins
   *
   * @see https://babeljs.io/docs/en/assumptions
   */
  assumptions?: { [name: string]: boolean } | null | undefined;

  /**
   * Include the AST in the returned object
   *
   * Default: `false`
   */
  ast?: boolean | null | undefined;

  /**
   * Attach a comment after all non-user injected code
   *
   * Default: `null`
   */
  auxiliaryCommentAfter?: string | null | undefined;

  /**
   * Attach a comment before all non-user injected code
   *
   * Default: `null`
   */
  auxiliaryCommentBefore?: string | null | undefined;

  /**
   * Specify the "root" folder that defines the location to search for "babel.config.js", and the default folder to allow `.babelrc` files inside of.
   *
   * Default: `"."`
   */
  root?: string | null | undefined;

  /**
   * This option, combined with the "root" value, defines how Babel chooses its project root.
   * The different modes define different ways that Babel can process the "root" value to get
   * the final project root.
   *
   * @see https://babeljs.io/docs/en/next/options#rootmode
   */
  rootMode?: "root" | "upward" | "upward-optional" | undefined;

  /**
   * The config file to load Babel's config from. Defaults to searching for "babel.config.js" inside the "root" folder. `false` will disable searching for config files.
   *
   * Default: `undefined`
   */
  configFile?: string | boolean | null | undefined;

  /**
   * Specify whether or not to use .babelrc and
   * .babelignore files.
   *
   * Default: `true`
   */
  babelrc?: boolean | null | undefined;

  /**
   * Specify which packages should be search for .babelrc files when they are being compiled. `true` to always search, or a path string or an array of paths to packages to search
   * inside of. Defaults to only searching the "root" package.
   *
   * Default: `(root)`
   */
  babelrcRoots?: boolean | MatchPattern | MatchPattern[] | null | undefined;

  /**
   * Toggles whether or not browserslist config sources are used, which includes searching for any browserslist files or referencing the browserslist key inside package.json.
   * This is useful for projects that use a browserslist config for files that won't be compiled with Babel.
   *
   * If a string is specified, it must represent the path of a browserslist configuration file. Relative paths are resolved relative to the configuration file which specifies
   * this option, or to `cwd` when it's passed as part of the programmatic options.
   *
   * Default: `true`
   */
  browserslistConfigFile?: boolean | null | undefined;

  /**
   * The Browserslist environment to use.
   *
   * Default: `undefined`
   */
  browserslistEnv?: string | null | undefined;

  /**
   * By default `babel.transformFromAst` will clone the input AST to aFunction mutations.
   * Specifying `cloneInputAst: false` can improve parsing performance if the input AST is not used elsewhere.
   *
   * Default: `true`
   */
  cloneInputAst?: boolean | null | undefined;

  /**
   * Defaults to environment variable `BABEL_ENV` if set, or else `NODE_ENV` if set, or else it defaults to `"development"`
   *
   * Default: env vars
   */
  envName?: string | undefined;

  /**
   * If any of patterns match, the current configuration object is considered inactive and is ignored during config processing.
   */
  exclude?: MatchPattern | MatchPattern[] | undefined;

  /**
   * Enable code generation
   *
   * Default: `true`
   */
  code?: boolean | null | undefined;

  /**
   * Output comments in generated output
   *
   * Default: `true`
   */
  comments?: boolean | null | undefined;

  /**
   * Do not include superfluous whitespace characters and line terminators. When set to `"auto"` compact is set to `true` on input sizes of >500KB
   *
   * Default: `"auto"`
   */
  compact?: boolean | "auto" | null | undefined;

  /**
   * The working directory that Babel's programmatic options are loaded relative to.
   *
   * Default: `"."`
   */
  cwd?: string | null | undefined;

  /**
   * Utilities may pass a caller object to identify themselves to Babel and
   * pass capability-related flags for use by configs, presets and plugins.
   *
   * @see https://babeljs.io/docs/en/next/options#caller
   */
  caller?: TransformCaller | undefined;

  /**
   * This is an object of keys that represent different environments. For example, you may have: `{ env: { production: { \/* specific options *\/ } } }`
   * which will use those options when the `envName` is `production`
   *
   * Default: `{}`
   */
  env?:
    | { [index: string]: TransformOptions | null | undefined }
    | null
    | undefined;

  /**
   * A path to a `.babelrc` file to extend
   *
   * Default: `null`
   */
  extends?: string | null | undefined;

  /**
   * Filename for use in errors etc
   *
   * Default: `"unknown"`
   */
  filename?: string | null | undefined;

  /**
   * Filename relative to `sourceRoot`
   *
   * Default: `(filename)`
   */
  filenameRelative?: string | null | undefined;

  /**
   * An object containing the options to be passed down to the babel code generator, @babel/generator
   *
   * Default: `{}`
   */
  generatorOpts?: GeneratorOptions | null | undefined;

  /**
   * Specify a custom callback to generate a module id with. Called as `getModuleId(moduleName)`. If falsy value is returned then the generated module id is used
   *
   * Default: `null`
   */
  getModuleId?:
    | ((moduleName: string) => string | null | undefined)
    | null
    | undefined;

  /**
   * ANSI highlight syntax error code frames
   *
   * Default: `true`
   */
  highlightCode?: boolean | null | undefined;

  /**
   * Opposite to the `only` option. `ignore` is disregarded if `only` is specified
   *
   * Default: `null`
   */
  ignore?: MatchPattern[] | null | undefined;

  /**
   * This option is a synonym for "test"
   */
  include?: MatchPattern | MatchPattern[] | undefined;

  /**
   * A source map object that the output source map will be based on
   *
   * Default: `null`
   */
  inputSourceMap?: InputSourceMap | null | undefined;

  /**
   * Should the output be minified (not printing last semicolons in blocks, printing literal string values instead of escaped ones, stripping `()` from `new` when safe)
   *
   * Default: `false`
   */
  minified?: boolean | null | undefined;

  /**
   * Specify a custom name for module ids
   *
   * Default: `null`
   */
  moduleId?: string | null | undefined;

  /**
   * If truthy, insert an explicit id for modules. By default, all modules are anonymous. (Not available for `common` modules)
   *
   * Default: `false`
   */
  moduleIds?: boolean | null | undefined;

  /**
   * Optional prefix for the AMD module formatter that will be prepend to the filename on module definitions
   *
   * Default: `(sourceRoot)`
   */
  moduleRoot?: string | null | undefined;

  /**
   * A glob, regex, or mixed array of both, matching paths to **only** compile. Can also be an array of arrays containing paths to explicitly match. When attempting to compile
   * a non-matching file it's returned verbatim
   *
   * Default: `null`
   */
  only?: MatchPattern[] | null | undefined;

  /**
   * Allows users to provide an array of options that will be merged into the current configuration one at a time.
   * This feature is best used alongside the "test"/"include"/"exclude" options to provide conditions for which an override should apply
   */
  overrides?: TransformOptions[] | undefined;

  /**
   * An object containing the options to be passed down to the babel parser, @babel/parser
   *
   * Default: `{}`
   */
  parserOpts?: ParserOptions | null | undefined;

  /**
   * List of plugins to load and use
   *
   * Default: `[]`
   */
  plugins?: PluginItem[] | null | undefined;

  /**
   * List of presets (a set of plugins) to load and use
   *
   * Default: `[]`
   */
  presets?: PluginItem[] | null | undefined;

  /**
   * Retain line numbers. This will lead to wacky code but is handy for scenarios where you can't use source maps. (**NOTE**: This will not retain the columns)
   *
   * Default: `false`
   */
  retainLines?: boolean | null | undefined;

  /**
   * An optional callback that controls whether a comment should be output or not. Called as `shouldPrintComment(commentContents)`. **NOTE**: This overrides the `comment` option when used
   *
   * Default: `null`
   */
  shouldPrintComment?:
    | ((commentContents: string) => boolean)
    | null
    | undefined;

  /**
   * Set `sources[0]` on returned source map
   *
   * Default: `(filenameRelative)`
   */
  sourceFileName?: string | null | undefined;

  /**
   * If truthy, adds a `map` property to returned output. If set to `"inline"`, a comment with a sourceMappingURL directive is added to the bottom of the returned code. If set to `"both"`
   * then a `map` property is returned as well as a source map comment appended. **This does not emit sourcemap files by itself!**
   *
   * Default: `false`
   */
  sourceMaps?: boolean | "inline" | "both" | null | undefined;

  /**
   * The root from which all sources are relative
   *
   * Default: `(moduleRoot)`
   */
  sourceRoot?: string | null | undefined;

  /**
   * Indicate the mode the code should be parsed in. Can be one of "script", "module", or "unambiguous". `"unambiguous"` will make Babel attempt to guess, based on the presence of ES6
   * `import` or `export` statements. Files with ES6 `import`s and `export`s are considered `"module"` and are otherwise `"script"`.
   *
   * Default: `("module")`
   */
  sourceType?: "script" | "module" | "unambiguous" | null | undefined;

  /**
   * If all patterns fail to match, the current configuration object is considered inactive and is ignored during config processing.
   */
  test?: MatchPattern | MatchPattern[] | undefined;

  /**
   * Describes the environments you support/target for your project.
   * This can either be a [browserslist-compatible](https://github.com/ai/browserslist) query (with [caveats](https://babeljs.io/docs/en/babel-preset-env#ineffective-browserslist-queries))
   *
   * Default: `{}`
   */
  targets?:
    | string
    | string[]
    | {
        esmodules?: boolean;
        node?: Omit<string, "current"> | "current" | true;
        safari?: Omit<string, "tp"> | "tp";
        browsers?: string | string[];
        android?: string;
        chrome?: string;
        deno?: string;
        edge?: string;
        electron?: string;
        firefox?: string;
        ie?: string;
        ios?: string;
        opera?: string;
        rhino?: string;
        samsung?: string;
      };
}
