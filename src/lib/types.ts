export type BookStatus = "pending" | "found" | "not_found" | "sold";

export type Book = {
  id: string;
  title: string;
  year: string;
  price: string;
  orderDate: string;
  code: string;
  photoUrl: string;
  status: BookStatus;
};

export type Buyer = {
  id: string;
  name: string;
  address: string;
  email: string;
  weight: string;
  archived: boolean;
  selected: boolean;
  books: Book[];
};

export const STATUS_LABEL: Record<BookStatus, string> = {
  pending: "Ожидает",
  found: "Найдено",
  not_found: "Не найдено",
  sold: "Продано",
};

export function checkedCount(buyer: Buyer) {
  return buyer.books.filter((b) => b.status !== "pending").length;
}

export function sortableDate(date: string) {
  const full = date.match(/(\d{2})\.(\d{2})\.(\d{4})/);
  if (full) return `${full[3]}${full[2]}${full[1]}`;
  const short = date.match(/(\d{2})\.(\d{2})/);
  if (short) return `2026${short[2]}${short[1]}`;
  return "00000000";
}

export function latestOrderDate(buyer: Buyer) {
  return buyer.books.reduce((max, b) => {
    const d = sortableDate(b.orderDate);
    return d > max ? d : max;
  }, "00000000");
}

export function sortBooks(books: Book[]) {
  return [...books].sort(
    (a, b) => sortableDate(b.orderDate).localeCompare(sortableDate(a.orderDate)),
  );
}
