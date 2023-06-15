import type { Config as SvgoConfig } from "./lib/svgo";
import type { Config as SvgrConfig } from "./lib/svgr";

export type IconaIconData = {
  name: string;
  svg: string;
};

type PdfKitConfig = PDFKit.PDFDocumentOptions;
export interface GeneratePDFConfig {
  /**
   * generate drawable pdf files
   * @default false
   */
  active?: boolean;

  /**
   * pdf files path that will be generated
   * @default pdf
   */
  path?: string;

  /**
   * PDFKit.PDFDocumentOptions
   * @see https://pdfkit.org/docs/getting_started.html#document-structure
   */
  pdfKitConfig?: PdfKitConfig;
}

export interface GenerateReactConfig {
  /**
   * generate drawable react files
   * @default false
   */
  active?: boolean;

  /**
   * react component files path that will be generated
   * @default react
   */
  path?: string;

  /**
   * Config (@svgr/core)
   * @see https://react-svgr.com/docs/options/
   */
  svgrConfig?: SvgrConfig;
}

export interface GenerateSVGConfig {
  /**
   * generate drawable svg files
   * @default true
   */
  active?: boolean;

  /**
   * svg files path that will be generated
   * @default svg
   */
  path?: string;

  /**
   * Config (svgo)
   * @see https://github.com/svg/svgo#configuration
   */
  svgoConfig?: SvgoConfig;
}

interface Svg2vectordrawableOptions {
  floatPrecision?: number; // default 2
  strict?: boolean; // defaults to false
  fillBlack?: boolean; // defaults to false
  xmlTag?: boolean; // defaults to false
  tint?: string;
}

export interface GenerateDrawableConfig {
  /**
   * generate drawable xml files
   * @default false
   */
  active?: boolean;

  /**
   * xml files path that will be generated
   * @default xml
   */
  path?: string;

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

export interface IconaConfig {
  svg?: GenerateSVGConfig;
  react?: GenerateReactConfig;
  pdf?: GeneratePDFConfig;
  drawable?: GenerateDrawableConfig;
}
