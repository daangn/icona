import { style } from "@vanilla-extract/css";

export const container = style({
  display: "flex",
  position: "relative",
  flexDirection: "column",
  gap: "12px",
});

export const preview = style({
  display: "flex",
  gap: "6px",
});
