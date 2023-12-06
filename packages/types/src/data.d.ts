type Base64 = string;

export interface Style {
  width: number;
  height: number;
}

export interface IconaIconData {
  name: string;
  style: Style;
  svg: string;
  png: {
    x1?: Base64;
    x2?: Base64;
    x3?: Base64;
    x4?: Base64;
  };
}
