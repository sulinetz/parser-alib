import {
  ClipboardCopy,
  History,
  Mail,
  MapPin,
  Scale,
  Trash2,
  Undo2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { BookRow } from "@/components/book-row";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { copyOrderHtml, mailtoHref } from "@/lib/export-html";
import { useOrders } from "@/lib/store";
import { sortBooks, type Buyer } from "@/lib/types";
import { toast } from "sonner";

export function Workspace({ buyer }: { buyer: Buyer }) {
  const setWeight = useOrders((s) => s.setWeight);
  const setStatus = useOrders((s) => s.setStatus);
  const archive = useOrders((s) => s.archive);
  const setTab = useOrders((s) => s.setTab);
  const remove = useOrders((s) => s.remove);
  const [weight, setLocal] = useState(buyer.weight);
  const books = useMemo(() => sortBooks(buyer.books), [buyer.books]);

  useEffect(() => {
    setLocal(buyer.weight);
  }, [buyer.id, buyer.weight]);

  function persistWeight() {
    setWeight(buyer.id, weight.trim());
  }

  function saveWeight() {
    persistWeight();
    toast.success("Вес сохранён");
  }

  async function exportOne() {
    persistWeight();
    await copyOrderHtml({ ...buyer, weight: weight.trim() });
    toast.success("Отчёт в буфере — Ctrl+V в письме");
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="border-b border-border px-4 py-4 sm:px-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0">
            <p className="text-2xs font-medium tracking-widest text-muted uppercase">
              Текущий покупатель
            </p>
            <h2 className="font-display text-2xl font-medium tracking-tight text-balance">
              {buyer.name}
            </h2>
            <p className="mt-1 flex items-start gap-1.5 text-sm text-muted">
              <MapPin className="mt-0.5 size-4 shrink-0" />
              <span>{buyer.address || "Адрес не указан"}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 rounded-lg border border-border bg-surface px-2 py-1">
              <Scale className="size-4 text-muted" />
              <Input
                aria-label="Общий вес"
                value={weight}
                onChange={(e) => setLocal(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") void exportOne();
                }}
                placeholder="600 г или 1.2 кг"
                className="h-8 w-32 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
              />
              <Button size="sm" variant="secondary" onClick={saveWeight}>
                Сохранить
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {buyer.archived ? (
            <>
              <Button
                variant="secondary"
                onClick={() => {
                  persistWeight();
                  archive(buyer.id, false);
                  setTab("work");
                }}
              >
                <Undo2 />
                Вернуть в работу
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  if (
                    confirm(
                      "Удалить этого покупателя из базы безвозвратно?",
                    )
                  )
                    remove(buyer.id);
                }}
              >
                <Trash2 />
                Удалить
              </Button>
            </>
          ) : (
            <Button
              variant="secondary"
              onClick={() => {
                persistWeight();
                archive(buyer.id, true);
                setTab("history");
              }}
            >
              <History />
              В историю
            </Button>
          )}
          <Button variant="outline" asChild>
            <a href={mailtoHref({ ...buyer, weight: weight.trim() })}>
              <Mail />
              Outlook
            </a>
          </Button>
          <Button onClick={() => void exportOne()}>
            <ClipboardCopy />
            Экспорт в буфер
          </Button>
        </div>
      </header>

      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-4 sm:p-6">
        {books.map((book, i) => (
          <BookRow
            key={book.id}
            index={i}
            book={book}
            onStatus={(status) => setStatus(buyer.id, book.id, status)}
          />
        ))}
      </div>
    </div>
  );
}

export function EmptyWorkspace() {
  return (
    <div className="flex flex-1 items-center justify-center p-8 text-center">
      <div>
        <p className="font-display text-xl text-foreground">Выберите покупателя слева</p>
        <p className="mt-2 max-w-sm text-pretty text-sm text-muted">
          Здесь появятся книги и статусы сборки. Enter в поле веса сразу
          копирует отчёт в буфер.
        </p>
      </div>
    </div>
  );
}
