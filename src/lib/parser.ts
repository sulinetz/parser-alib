import type { Book } from "./types";

export type ParsedBook = {
  email: string;
  name: string;
  address: string;
  book: Omit<Book, "status"> & { status?: Book["status"] };
};

function stripTags(html: string) {
  return html
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function firstBold(html: string) {
  const m = html.match(/<b>([\s\S]*?)<\/b>/i);
  return m ? stripTags(m[1]) : "";
}

function paragraphs(block: string) {
  return [...block.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)].map((m) => m[0]);
}

function extractPrice(text: string) {
  const patterns = [
    /Цена\s*[:\-]?\s*([\d\s]+(?:[,.]\d{1,2})?)\s*(?:руб\.?|р\.|₽)/i,
    /([\d\s]+(?:[,.]\d{1,2})?)\s*(?:руб\.?|р\.)/i,
  ];
  for (const re of patterns) {
    const m = text.match(re);
    if (m) return `${m[1].replace(/\s+/g, " ").trim()} ₽`;
  }
  return "";
}

function extractPhoto(block: string) {
  const tags = [...block.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)];
  for (const tag of tags) {
    const attrs = tag[1];
    const text = stripTags(tag[2]).toLowerCase();
    const href = attrs.match(/href\s*=\s*["']([^"']+)["']/i)?.[1];
    if (!href) continue;
    if (text.includes("фото") || href.toLowerCase().includes("photo")) {
      if (href.startsWith("http")) return href;
      return `https://www.alib.ru/${href.replace(/^\/+/, "")}`;
    }
  }
  return "";
}

function parseAlibBlock(block: string): ParsedBook | null {
  if (!block.trim() || block.includes("Конец списка")) return null;
  const ps = paragraphs(block);
  if (ps.length < 3) return null;

  const p0 = ps[0];
  const p1 = ps[1];
  const p2 = ps[2];
  const p0Text = stripTags(p0);
  const p1Text = stripTags(p1);
  const p2Text = stripTags(p2);
  const blockText = stripTags(block);

  const title = firstBold(p0) || "Неизвестная книга";
  const year = p0Text.match(/(\d{4})г\./)?.[1] ?? "Год?";
  const price = extractPrice(blockText);
  const photoUrl = extractPhoto(block);

  const codeMatch = p1Text.match(/Код книги для BS:\s*(.*)/i);
  const code = (codeMatch?.[1] ?? "").trim() || `no_code_${title.slice(0, 10)}`;

  const fioHtml = p2.match(/ФИО:\s*<b>([\s\S]*?)<\/b>/i);
  const name = fioHtml
    ? stripTags(fioHtml[1])
    : p2Text.match(/ФИО:\s*(.+?)(?:\s+mail:|$)/i)?.[1]?.trim() || "Неизвестно";

  const emailMatch = p2Text.match(/mail:\s*([^\s)]+)/i);
  const email =
    emailMatch?.[1]?.trim() ||
    `no_email_${name.replace(/\s+/g, "_")}`;

  let address = "";
  const addrHtml = p2.match(
    /Адрес:\s*([\s\S]*?)(?:<br\s*\/?>|Комментарий|ФИО)/i,
  );
  if (addrHtml) address = stripTags(addrHtml[1]).replace(/,+$/, "");
  if (!address) {
    address = p2Text.match(/Адрес:\s*(.+?)(?:Комментарий|ФИО|$)/i)?.[1]?.trim() ?? "";
  }

  const orderDate = p2Text.match(/(\d{2}\.\d{2}\.\d{4})/)?.[1] ?? "??";

  return {
    email,
    name,
    address,
    book: {
      id: code,
      title,
      year,
      price,
      orderDate,
      code,
      photoUrl,
      status: "pending",
    },
  };
}

export function looksLikeAlibHtml(raw: string) {
  const lower = raw.toLowerCase();
  return lower.includes("<p") || lower.includes("<hr");
}

export function parseAlibHtml(raw: string): ParsedBook[] {
  const html = raw.trim();
  if (!html) return [];
  const blocks = html.split(/<hr\s*\/?>/i);
  const out: ParsedBook[] = [];
  for (const block of blocks) {
    const item = parseAlibBlock(block);
    if (item) out.push(item);
  }
  return out;
}
