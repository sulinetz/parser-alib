import type { Buyer } from "./types";
import { sortBooks } from "./types";

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "\u0026amp;")
    .replace(/</g, "\u0026lt;")
    .replace(/>/g, "\u0026gt;")
    .replace(/"/g, "\u0026quot;");
}

function displayWeight(raw: string) {
  const w = raw.trim();
  if (!w) return "";
  return /^\d+$/.test(w) ? `${w} г` : w;
}

function statusHtml(status: Buyer["books"][number]["status"]) {
  if (status === "found") {
    return '<font color="#15803d"><b>[✓ НАЙДЕНО]</b></font>';
  }
  if (status === "not_found") {
    return '<font color="#b91c1c"><b>[✕ НЕ НАЙДЕНО]</b></font>';
  }
  if (status === "sold") {
    return '<font color="#7c3aed"><b>[⛔ ПРОДАНО]</b></font>';
  }
  return '<font color="#b45309"><b>[ОЖИДАЕТ СБОРКИ]</b></font>';
}

function photoHtml(url: string) {
  const safe = escapeHtml(url);
  return [
    "&nbsp;&nbsp;<span>",
    `<a href="${safe}" target="_blank" `,
    'style="background:#2563eb;background-color:#2563eb;color:#ffffff;',
    "font-family:Segoe UI,sans-serif;font-size:9pt;font-weight:bold;",
    "text-decoration:none;padding:1px 6px;border-radius:3px;",
    'border:1px solid #1d4ed8;">',
    '<font color="#ffffff"><b>фото</b></font></a></span>',
  ].join("");
}

export function orderToHtml(buyer: Buyer) {
  const fio = escapeHtml(buyer.name || "Неизвестно");
  const address = escapeHtml(buyer.address || "Адрес не указан");
  const weight = displayWeight(buyer.weight);

  const items = sortBooks(buyer.books)
    .map((book) => {
      const title = escapeHtml(book.title || "?");
      const price = escapeHtml(book.price || "цена не указана");
      const photo = book.photoUrl ? photoHtml(book.photoUrl) : "";
      return `<li style="margin:6px 0;line-height:1.4;">${title} — <b>${price}</b> ${statusHtml(book.status)}${photo}</li>`;
    })
    .join("");

  const weightRow = weight
    ? `<div style="font-size:11pt;font-weight:bold;margin-bottom:8px;"><b>Общий вес:</b> ${escapeHtml(weight)}</div>`
    : "";

  return [
    '<div style="font-family:Segoe UI,Calibri,Arial,sans-serif;color:#222222;font-size:11pt;line-height:1.45;margin-bottom:18px;">',
    `<div style="font-size:15pt;font-weight:bold;color:#0f172a;margin-bottom:4px;">Покупатель: <b>${fio}</b></div>`,
    `<div style="font-size:11pt;color:#334155;margin-bottom:6px;"><b>Адрес:</b> ${address}</div>`,
    weightRow,
    '<div style="border-top:2px solid #94a3b8;width:320px;margin:10px 0 12px 0;"></div>',
    '<ol style="margin:0;padding-left:24px;">',
    items,
    "</ol></div>",
  ].join("");
}

export function orderToText(buyer: Buyer) {
  const weight = displayWeight(buyer.weight);
  const lines = [
    `Покупатель: ${buyer.name}`,
    `Адрес: ${buyer.address || "Адрес не указан"}`,
  ];
  if (weight) lines.push(`Общий вес: ${weight}`);
  lines.push("------------------------------");

  const statusMap = {
    found: "НАЙДЕНО",
    not_found: "НЕ НАЙДЕНО",
    sold: "ПРОДАНО",
    pending: "ОЖИДАЕТ СБОРКИ",
  } as const;

  sortBooks(buyer.books).forEach((book, idx) => {
    const photo = book.photoUrl ? ` (фото: ${book.photoUrl})` : "";
    const price = book.price || "цена не указана";
    lines.push(
      `${idx + 1}. ${book.title} — ${price}${photo} [${statusMap[book.status]}]`,
    );
  });
  return lines.join("\n");
}

export async function copyOrdersHtml(buyers: Buyer[]) {
  const html = buyers
    .map(orderToHtml)
    .join(
      '<br><hr style="border:none;border-top:2px dashed #64748b;margin:24px 0;"><br>',
    );
  const text = buyers
    .map(orderToText)
    .join("\n\n==================================================\n\n");
  try {
    await navigator.clipboard.write([
      new ClipboardItem({
        "text/html": new Blob([html], { type: "text/html" }),
        "text/plain": new Blob([text], { type: "text/plain" }),
      }),
    ]);
  } catch {
    await navigator.clipboard.writeText(text);
  }
}

export async function copyOrderHtml(buyer: Buyer) {
  await copyOrdersHtml([buyer]);
}

export async function copyText(text: string) {
  await navigator.clipboard.writeText(text);
}

export function mailtoHref(buyer: Buyer) {
  const subject = encodeURIComponent(`Заказ — ${buyer.name}`);
  const body = encodeURIComponent(orderToText(buyer));
  return `mailto:${buyer.email && !buyer.email.startsWith("no_email_") ? buyer.email : ""}?subject=${subject}&body=${body}`;
}
