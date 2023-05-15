export function handleFigmaMessage(
  type: string,
  fn: (pluginMessage: { type: string; [key: string]: any }) => void,
): (event: MessageEvent) => void {
  return (event: MessageEvent) => {
    if (event.origin !== "https://www.figma.com") {
      return;
    }
    if (event.data.pluginMessage.type !== type) {
      return;
    }
    fn(event.data.pluginMessage);
  };
}

export function requestIcons() {
  parent.postMessage({ pluginMessage: { type: "get.page.icons" } }, "*");
}

export async function sendSlackMessage(
  webhookUrl: string,
  docname: string,
  date: string,
  description: string,
  link: string,
) {
  return fetch(webhookUrl, {
    method: "POST",
    headers: {
      accept: "*/*",
      "accept-language": "en-US",
      "content-type": "text/plain;charset=UTF-8",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "no-cors",
      "sec-fetch-site": "cross-site",
    },
    referrerPolicy: "origin-when-cross-origin",
    body: JSON.stringify({
      docname,
      date,
      description,
      link,
    }),
  });
}
