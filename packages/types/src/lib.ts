import type { Config as SvgrConfig } from "@svgr/core";
import type { SVGtoPDFOptions } from "svg-to-pdfkit";
import type { Config as SvgoConfig } from "svgo";

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

export interface SvgToPdfOptions extends SVGtoPDFOptions {
  x?: number;
  y?: number;
}
export interface GeneratePDFConfig {
  /**
   * generate drawable pdf files
   * @default false
   */
  active: boolean;

  /**
   * pdf files path that will be generated
   * @default pdf
   */
  path?: string;

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

export interface GenerateReactConfig {
  /**
   * generate drawable react files
   * @default false
   */
  active: boolean;

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
  active: boolean;

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
  active: boolean;

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

export interface GeneratePNGConfig {
  /**
   * generate drawable xml files
   * @default false
   */
  active: boolean;

  /**
   * xml files path that will be generated
   * @default xml
   */
  path?: string;
}

export interface IconaConfig {
  svg: GenerateSVGConfig;
  react: GenerateReactConfig;
  pdf: GeneratePDFConfig;
  drawable: GenerateDrawableConfig;
  png: GeneratePNGConfig;
}
