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
    "1x": Base64 | null;
    "2x": Base64 | null;
    "3x": Base64 | null;
    "4x": Base64 | null;
  };
}
