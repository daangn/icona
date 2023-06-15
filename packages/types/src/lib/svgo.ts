// NOTE(@junghyeonsu): Function type이 typescript-json-schema 에서 지원되지 않아서 Function 타입으로 대체

type XastRoot = {
  type: "root";
  children: Array<XastChild>;
};

type StringifyOptions = {
  doctypeStart?: string;
  doctypeEnd?: string;
  procInstStart?: string;
  procInstEnd?: string;
  tagOpenStart?: string;
  tagOpenEnd?: string;
  tagCloseStart?: string;
  tagCloseEnd?: string;
  tagShortStart?: string;
  tagShortEnd?: string;
  attrStart?: string;
  attrEnd?: string;
  commentStart?: string;
  commentEnd?: string;
  cdataStart?: string;
  cdataEnd?: string;
  textStart?: string;
  textEnd?: string;
  indent?: number | string;
  regEntities?: RegExp;
  regValEntities?: RegExp;
  encodeEntity?: (char: string) => string;
  pretty?: boolean;
  useShortTags?: boolean;
  eol?: "lf" | "crlf";
  finalNewline?: boolean;
};

type XastDoctype = {
  type: "doctype";
  name: string;
  data: {
    doctype: string;
  };
};

type XastInstruction = {
  type: "instruction";
  name: string;
  value: string;
};

type XastComment = {
  type: "comment";
  value: string;
};

type XastCdata = {
  type: "cdata";
  value: string;
};

type XastText = {
  type: "text";
  value: string;
};

type XastElement = {
  type: "element";
  name: string;
  attributes: Record<string, string>;
  children: Array<XastChild>;
};

type XastChild =
  | XastDoctype
  | XastInstruction
  | XastComment
  | XastCdata
  | XastText
  | XastElement;

type PluginInfo = {
  path?: string;
  multipassCount: number;
};

type DataUri = "base64" | "enc" | "unenc";

type DefaultPlugins = {
  cleanupAttrs: {
    newlines?: boolean;
    trim?: boolean;
    spaces?: boolean;
  };
  cleanupEnableBackground: Function;
  cleanupIds: {
    remove?: boolean;
    minify?: boolean;
    preserve?: Array<string>;
    preservePrefixes?: Array<string>;
    force?: boolean;
  };
  cleanupNumericValues: {
    floatPrecision?: number;
    leadingZero?: boolean;
    defaultPx?: boolean;
    convertToPx?: boolean;
  };
  collapseGroups: Function;
  convertColors: {
    currentColor?: boolean | string | RegExp;
    names2hex?: boolean;
    rgb2hex?: boolean;
    shorthex?: boolean;
    shortname?: boolean;
  };
  convertEllipseToCircle: Function;
  convertPathData: {
    applyTransforms?: boolean;
    applyTransformsStroked?: boolean;
    makeArcs?: {
      threshold: number;
      tolerance: number;
    };
    straightCurves?: boolean;
    lineShorthands?: boolean;
    curveSmoothShorthands?: boolean;
    floatPrecision?: number | false;
    transformPrecision?: number;
    removeUseless?: boolean;
    collapseRepeated?: boolean;
    utilizeAbsolute?: boolean;
    leadingZero?: boolean;
    negativeExtraSpace?: boolean;
    noSpaceAfterFlags?: boolean;
    forceAbsolutePath?: boolean;
  };
  convertShapeToPath: {
    convertArcs?: boolean;
    floatPrecision?: number;
  };
  convertTransform: {
    convertToShorts?: boolean;
    degPrecision?: number;
    floatPrecision?: number;
    transformPrecision?: number;
    matrixToTransform?: boolean;
    shortTranslate?: boolean;
    shortScale?: boolean;
    shortRotate?: boolean;
    removeUseless?: boolean;
    collapseIntoOne?: boolean;
    leadingZero?: boolean;
    negativeExtraSpace?: boolean;
  };
  mergeStyles: Function;
  inlineStyles: {
    onlyMatchedOnce?: boolean;
    removeMatchedSelectors?: boolean;
    useMqs?: Array<string>;
    usePseudos?: Array<string>;
  };
  mergePaths: {
    force?: boolean;
    floatPrecision?: number;
    noSpaceAfterFlags?: boolean;
  };

  minifyStyles: {
    /**
     * Disable or enable a structure optimisations.
     * @default true
     */
    restructure?: boolean | undefined;
    /**
     * Enables merging of @media rules with the same media query by splitted by other rules.
     * The optimisation is unsafe in general, but should work fine in most cases. Use it on your own risk.
     * @default false
     */
    forceMediaMerge?: boolean | undefined;
    /**
     * Specify what comments to leave:
     * - 'exclamation' or true – leave all exclamation comments
     * - 'first-exclamation' – remove every comment except first one
     * - false – remove all comments
     * @default true
     */
    comments?: string | boolean | undefined;
    /**
     * Advanced optimizations
     */
    usage?:
      | boolean
      | {
          force?: boolean;
          ids?: boolean;
          classes?: boolean;
          tags?: boolean;
        };
  };

  moveElemsAttrsToGroup: Function;
  moveGroupAttrsToElems: Function;
  removeComments: Function;
  removeDesc: {
    removeAny?: boolean;
  };
  removeDoctype: Function;
  removeEditorsNSData: {
    additionalNamespaces?: Array<string>;
  };
  removeEmptyAttrs: Function;
  removeEmptyContainers: Function;
  removeEmptyText: {
    text?: boolean;
    tspan?: boolean;
    tref?: boolean;
  };
  removeHiddenElems: {
    isHidden?: boolean;
    displayNone?: boolean;
    opacity0?: boolean;
    circleR0?: boolean;
    ellipseRX0?: boolean;
    ellipseRY0?: boolean;
    rectWidth0?: boolean;
    rectHeight0?: boolean;
    patternWidth0?: boolean;
    patternHeight0?: boolean;
    imageWidth0?: boolean;
    imageHeight0?: boolean;
    pathEmptyD?: boolean;
    polylineEmptyPoints?: boolean;
    polygonEmptyPoints?: boolean;
  };
  removeMetadata: Function;
  removeNonInheritableGroupAttrs: Function;
  removeTitle: Function;
  removeUnknownsAndDefaults: {
    unknownContent?: boolean;
    unknownAttrs?: boolean;
    defaultAttrs?: boolean;
    uselessOverrides?: boolean;
    keepDataAttrs?: boolean;
    keepAriaAttrs?: boolean;
    keepRoleAttr?: boolean;
  };
  removeUnusedNS: Function;
  removeUselessDefs: Function;
  removeUselessStrokeAndFill: {
    stroke?: boolean;
    fill?: boolean;
    removeNone?: boolean;
  };
  removeViewBox: Function;
  removeXMLProcInst: Function;
  sortAttrs: {
    order?: Array<string>;
    xmlnsOrder?: "front" | "alphabetical";
  };
  sortDefsChildren: Function;
};

type BuiltinsWithRequiredParams = {
  addAttributesToSVGElement: {
    attribute?: string | Record<string, null | string>;
    attributes?: Array<string | Record<string, null | string>>;
  };
  addClassesToSVGElement: {
    className?: string;
    classNames?: Array<string>;
  };
  removeAttributesBySelector: any;
  removeAttrs: {
    elemSeparator?: string;
    preserveCurrentColor?: boolean;
    attrs: string | Array<string>;
  };
  removeElementsByAttr: {
    id?: string | Array<string>;
    class?: string | Array<string>;
  };
};

type PresetDefaultOverrides = {
  [Name in keyof DefaultPlugins]?: DefaultPlugins[Name] | false;
};

type BuiltinsWithOptionalParams = DefaultPlugins & {
  "preset-default": {
    floatPrecision?: number;
    /**
     * All default plugins can be customized or disabled here
     * for example
     * {
     *   sortAttrs: { xmlnsOrder: "alphabetical" },
     *   cleanupAttrs: false,
     * }
     */
    overrides?: PresetDefaultOverrides;
  };
  cleanupListOfValues: {
    floatPrecision?: number;
    leadingZero?: boolean;
    defaultPx?: boolean;
    convertToPx?: boolean;
  };
  convertStyleToAttrs: {
    keepImportant?: boolean;
  };
  prefixIds: {
    prefix?:
      | boolean
      | string
      | ((node: XastElement, info: PluginInfo) => string);
    delim?: string;
    prefixIds?: boolean;
    prefixClassNames?: boolean;
  };
  removeDimensions: Function;
  removeOffCanvasPaths: Function;
  removeRasterImages: Function;
  removeScriptElement: Function;
  removeStyleElement: Function;
  removeXMLNS: Function;
  reusePaths: Function;
};

type XastParent = XastRoot | XastElement;

type VisitorNode<Node> = {
  enter?: (node: Node, parentNode: XastParent) => Function | symbol;
  exit?: (node: Node, parentNode: XastParent) => Function;
};

type VisitorRoot = {
  enter?: (node: XastRoot, parentNode: null) => Function;
  exit?: (node: XastRoot, parentNode: null) => Function;
};

type Visitor = {
  doctype?: VisitorNode<XastDoctype>;
  instruction?: VisitorNode<XastInstruction>;
  comment?: VisitorNode<XastComment>;
  cdata?: VisitorNode<XastCdata>;
  text?: VisitorNode<XastText>;
  element?: VisitorNode<XastElement>;
  root?: VisitorRoot;
};

type PluginFn<Params> = (
  root: XastRoot,
  params: Params,
  info: PluginInfo,
) => null | Visitor;

type CustomPlugin = {
  name: string;
  fn: PluginFn<Function>;
};

type PluginConfig =
  | keyof BuiltinsWithOptionalParams
  | {
      [Name in keyof BuiltinsWithOptionalParams]: {
        name: Name;
        params?: BuiltinsWithOptionalParams[Name];
      };
    }[keyof BuiltinsWithOptionalParams]
  | {
      [Name in keyof BuiltinsWithRequiredParams]: {
        name: Name;
        params: BuiltinsWithRequiredParams[Name];
      };
    }[keyof BuiltinsWithRequiredParams]
  | CustomPlugin;

export type Config = {
  /** Can be used by plugins, for example prefixids */
  path?: string;
  /** Pass over SVGs multiple times to ensure all optimizations are applied. */
  multipass?: boolean;
  /** Precision of floating point numbers. Will be passed to each plugin that suppors this param. */
  floatPrecision?: number;
  /**
   * Plugins configuration
   * ['preset-default'] is default
   * Can also specify any builtin plugin
   * ['sortAttrs', { name: 'prefixIds', params: { prefix: 'my-prefix' } }]
   * Or custom
   * [{ name: 'myPlugin', fn: () => ({}) }]
   */
  plugins: PluginConfig[];
  /** Options for rendering optimized SVG from AST. */
  js2svg?: StringifyOptions;
  /** Output as Data URI string. */
  datauri?: DataUri;
};
