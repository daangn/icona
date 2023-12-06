import { style } from "@vanilla-extract/css";

export const container = style({
  display: "flex",
  position: "relative",
  flexDirection: "column",
});

export const optionContainer = style({
  display: "flex",
  flexDirection: "column",
  flexWrap: "wrap",
  borderRadius: "4px",
  border: "1px solid #ddd",

  padding: "6px",
  marginTop: "10px",
});

export const preview = style({
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",
  borderRadius: "4px",
  border: "1px solid #ddd",
  gap: "6px",

  padding: "6px",
  marginTop: "10px",
});

export const exportButton = style({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",

  marginTop: "10px",
});
