interface UseJuneProps {
  writeKey: string;
  devMode?: boolean;
}

interface IdentifyProps {
  userId?: string;
  email?: string;
  userName?: string;
}

const BASE_URL = "https://api.june.so/sdk";

export function useJune({ writeKey }: UseJuneProps) {
  if (!writeKey) {
    throw new Error("[useJune] writeKey is required");
  }

  const headers = {
    Authorization: `Basic ${writeKey}`,
    "Content-Type": "application/json",
  };

  const track = async (event: string) => {
    try {
      await fetch(`${BASE_URL}/track`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          event,
        }),
      });
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * 현재는 figma에서는 이메일을 받아올 수 있는 수단이 없음
   */
  const identify = async ({ userName }: IdentifyProps) => {
    if (!userName) {
      return;
    }

    try {
      await fetch(`${BASE_URL}/identify`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          traits: {
            username: userName,
          },
        }),
      });
    } catch (error) {
      console.error(error);
    }
  };

  return { track, identify };
}
