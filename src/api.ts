const API_BASE = "https://api.hackmd.io/v1";

function getToken(): string {
  const token = process.env.HACKMD_API_TOKEN;
  if (!token) {
    throw new Error(
      "HACKMD_API_TOKEN not set. Get your token from HackMD Settings → API."
    );
  }
  return token;
}

export async function hackmdFetch(
  path: string,
  options: { method?: string; body?: unknown } = {}
): Promise<unknown> {
  const { method = "GET", body } = options;
  const token = getToken();

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HackMD API ${method} ${path} → ${res.status}: ${text}`);
  }

  if (res.status === 204) return { success: true };
  if (res.status === 202) return { success: true, status: "accepted" };

  return res.json();
}
