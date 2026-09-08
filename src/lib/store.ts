import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ParsedBook } from "./parser";
import type { BookStatus, Buyer } from "./types";
import { latestOrderDate } from "./types";
import { SEED_BUYERS } from "./seed";

type Tab = "work" | "history";

type State = {
  buyers: Buyer[];
  activeId: string | null;
  tab: Tab;
  importUrl: string;
  importHtml: string;
  setTab: (tab: Tab) => void;
  setActive: (id: string | null) => void;
  setImportUrl: (v: string) => void;
  setImportHtml: (v: string) => void;
  mergeParsed: (items: ParsedBook[]) => { added: number };
  toggleSelect: (id: string) => void;
  setWeight: (id: string, weight: string) => void;
  setStatus: (buyerId: string, bookId: string, status: BookStatus) => void;
  archive: (id: string, archived: boolean) => void;
  archiveMany: (ids: string[]) => void;
  remove: (id: string) => void;
  resetDemo: () => void;
};

function mergeParsedInto(buyers: Buyer[], items: ParsedBook[]) {
  let added = 0;
  const next = [...buyers];

  for (const item of items) {
    const idx = next.findIndex(
      (b) => b.email === item.email || b.id === item.email,
    );
    if (idx === -1) {
      next.unshift({
        id: item.email,
        name: item.name,
        address: item.address,
        email: item.email,
        weight: "",
        archived: false,
        selected: false,
        books: [
          {
            ...item.book,
            id: item.book.code,
            status: "pending",
          },
        ],
      });
      added += 1;
      continue;
    }

    const buyer = next[idx];
    const books = [...buyer.books];
    const bookIdx = books.findIndex((b) => b.code === item.book.code);
    if (bookIdx === -1) {
      books.push({ ...item.book, id: item.book.code, status: "pending" });
      added += 1;
    } else {
      const existing = books[bookIdx];
      books[bookIdx] = {
        ...existing,
        price: existing.price || item.book.price,
        photoUrl: existing.photoUrl || item.book.photoUrl,
      };
    }
    next[idx] = {
      ...buyer,
      name: item.name || buyer.name,
      address: item.address || buyer.address,
      archived: false,
      books,
    };
  }

  next.sort((a, b) => latestOrderDate(b).localeCompare(latestOrderDate(a)));
  return { buyers: next, added };
}

export const useOrders = create<State>()(
  persist(
    (set) => ({
      buyers: SEED_BUYERS,
      activeId: "b1",
      tab: "work",
      importUrl: "",
      importHtml: "",
      setTab: (tab) =>
        set((s) => {
          const visible = s.buyers.filter((b) =>
            tab === "history" ? b.archived : !b.archived,
          );
          const keep =
            s.activeId && visible.some((b) => b.id === s.activeId)
              ? s.activeId
              : (visible[0]?.id ?? null);
          return { tab, activeId: keep };
        }),
      setActive: (id) => set({ activeId: id }),
      setImportUrl: (importUrl) => set({ importUrl }),
      setImportHtml: (importHtml) => set({ importHtml }),
      mergeParsed: (items) => {
        let added = 0;
        set((s) => {
          const result = mergeParsedInto(s.buyers, items);
          added = result.added;
          const firstEmail = items[0]?.email;
          return {
            buyers: result.buyers,
            tab: "work",
            activeId: firstEmail ?? s.activeId,
            importHtml: "",
          };
        });
        return { added };
      },
      toggleSelect: (id) =>
        set((s) => ({
          buyers: s.buyers.map((b) =>
            b.id === id ? { ...b, selected: !b.selected } : b,
          ),
        })),
      setWeight: (id, weight) =>
        set((s) => ({
          buyers: s.buyers.map((b) => (b.id === id ? { ...b, weight } : b)),
        })),
      setStatus: (buyerId, bookId, status) =>
        set((s) => ({
          buyers: s.buyers.map((b) =>
            b.id !== buyerId
              ? b
              : {
                  ...b,
                  books: b.books.map((book) =>
                    book.id === bookId || book.code === bookId
                      ? { ...book, status }
                      : book,
                  ),
                },
          ),
        })),
      archive: (id, archived) =>
        set((s) => ({
          buyers: s.buyers.map((b) =>
            b.id === id ? { ...b, archived, selected: false } : b,
          ),
        })),
      archiveMany: (ids) =>
        set((s) => {
          const setIds = new Set(ids);
          return {
            buyers: s.buyers.map((b) =>
              setIds.has(b.id) ? { ...b, archived: true, selected: false } : b,
            ),
          };
        }),
      remove: (id) =>
        set((s) => ({
          buyers: s.buyers.filter((b) => b.id !== id),
          activeId: s.activeId === id ? null : s.activeId,
        })),
      resetDemo: () =>
        set({
          buyers: SEED_BUYERS,
          activeId: "b1",
          tab: "work",
        }),
    }),
    { name: "alib-orders-v2" },
  ),
);
