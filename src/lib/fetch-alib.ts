import { createServerFn } from "@tanstack/react-start";

export const fetchAlibPage = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    if (
      typeof data !== "object" ||
      data === null ||
      !("url" in data) ||
      typeof (data as { url: unknown }).url !== "string"
    ) {
      throw new Error("Нужна ссылка");
    }
    const url = (data as { url: string }).url.trim();
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      throw new Error("Введите корректную ссылку на заказы.");
    }
    return { url };
  })
  .handler(async ({ data }) => {
    const res = await fetch(data.url, {
      headers: { "User-Agent": "Mozilla/5.0" },
      signal: AbortSignal.timeout(12000),
    });
    if (!res.ok) {
      throw new Error(`Не удалось загрузить страницу: HTTP ${res.status}`);
    }
    const buf = await res.arrayBuffer();
    let html = "";
    try {
      html = new TextDecoder("windows-1251").decode(buf);
    } catch {
      html = new TextDecoder("utf-8").decode(buf);
    }
    return { html };
  });
