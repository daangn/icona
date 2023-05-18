import { globalStyle } from "@vanilla-extract/css";

globalStyle("html, body", {
  margin: 0,
  padding: 0,
});

globalStyle(
  "html, body, div, span, h1, h2, h3, h4, h5, h6, p, blockquote, pre, a, em, img, ins, kbd, q, s, samp, small, strike, strong, article, footer, header,main,nav, section",
  {
    margin: "0",
    padding: "0",
    border: "0",
    fontSize: "100%",
    verticalAlign: "baseline",
  },
);

globalStyle(
  "article, aside, details, figcaption, figure, footer, header, hgroup, main, menu, nav, section",
  {
    display: "block",
  },
);

globalStyle("ol, ul", {
  listStyle: "none",
});

globalStyle("*, *:after, *:before", {
  boxSizing: "border-box",
});

globalStyle("a", {
  textDecoration: "none",
  color: "inherit",
});
