import type { Config as SvgrConfig } from "@svgr/core";
import type { SVGtoPDFOptions as LibSVGtoPDFOptions } from "svg-to-pdfkit";
import type { Config as SvgoConfig } from "svgo";

/**
 * @param overwrite overwrite existing files in folder
 * @param recreate rm -rf all files and generate new files in folder
 */
type GenerateMode = "recreate" | "overwrite";

interface BaseConfig {
  /**
   * @default overwrite
   */
  genMode?: GenerateMode;

  /**
   * files path that will be generated
   */
  path?: string;

  /**
   * generate files in folder
   * @default false
   */
  active: boolean;
}

export interface SVGConfig extends Omit<BaseConfig, "active"> {
  /**
   * Config (svgo)
   * @see https://github.com/svg/svgo#configuration
   */
  svgoConfig?: SvgoConfig;
}

type SvgToPdfOptions = {
  x?: number;
  y?: number;
} & LibSVGtoPDFOptions;

type PDFKitConfig = PDFKit.PDFDocumentOptions & {
  /**
   * @readme
   * If you use `info` option, pdf output will be different every time.
   * So it occur git diff. So we use default info option.
   * If user want change info option, they can change it.
   * **But not recommend.**
   * 
   * ```ts
   *  const defaultPdfkitConfigInfo = {
        Author: "Icona",
        Creator: "Icona",
        Producer: "Icona",
        Title: IconName,
        Subject: IconName,
        Keywords: IconName,
        CreationDate: new Date(0),
        ModDate: new Date(0),
      };
   * ```
   */
  info?: PDFKit.PDFDocumentOptions["info"];
};

export interface PDFConfig extends BaseConfig {
  /**
   * PDFKit.PDFDocumentOptions
   * @see https://pdfkit.org/docs/getting_started.html#document-structure
   *
   * @readme
   * If you use `info` option, pdf output will be different every time.
   * So it occur git diff. So we use default info option.
   *
   * If user want change info option, they can change it.
   * But not recommend.
   */
  pdfKitConfig?: PDFKitConfig;

  svgToPdfOptions?: SvgToPdfOptions;
}

export interface ReactConfig extends BaseConfig {
  /**
   * Config (@svgr/core)
   * @see https://react-svgr.com/docs/options/
   */
  svgrConfig?: SvgrConfig;

  genIndexFile?: boolean;
}

interface Svg2vectordrawableOptions {
  floatPrecision?: number; // default 2
  strict?: boolean; // defaults to false
  fillBlack?: boolean; // defaults to false
  xmlTag?: boolean; // defaults to false
  tint?: string;
}

export interface DrawableConfig extends BaseConfig {
  /**
   * Config (svg2vectordrawable)
   * @see https://github.com/Ashung/svg2vectordrawable
   */
  svg2vectordrawableConfig?: Svg2vectordrawableOptions;

  /**
   * drawable default color is #FF212124
   * if you want to change default color, you can use this option
   * @default #FF212124
   */
  defaultColor?: string;
}

export interface PNGConfig extends BaseConfig {}

export interface Vue2Config extends BaseConfig {
  genShimFile?: boolean;

  genIndexFile?: boolean;

  attributes?: Record<string, string>;
}

export interface Vue3Config extends BaseConfig {
  genShimFile?: boolean;

  genIndexFile?: boolean;

  attributes?: Record<string, string>;
}

export interface IconaConfig {
  svg: SVGConfig;
  react: ReactConfig;
  pdf: PDFConfig;
  drawable: DrawableConfig;
  png: PNGConfig;
  vue2: Vue2Config;
  vue3: Vue3Config;
}
