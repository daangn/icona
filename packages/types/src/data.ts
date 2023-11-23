type Base64 = string;

export interface Style {
  width: number;
  height: number;
}

export interface IconaIconData {
  name: string;
  style: Style;
  svg: string;
  png?: Base64;
}
