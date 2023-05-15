figma.on("run", ({ command }: RunEvent) => {
  figma.showUI(__html__, { width: 360, height: 600 });
});
