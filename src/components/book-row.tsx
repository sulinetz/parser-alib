import { Camera, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { copyText } from "@/lib/export-html";
import type { Book, BookStatus } from "@/lib/types";
import { STATUS_LABEL } from "@/lib/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const STATUSES: BookStatus[] = ["pending", "found", "not_found", "sold"];

export function BookRow({
  index,
  book,
  onStatus,
}: {
  index: number;
  book: Book;
  onStatus: (status: BookStatus) => void;
}) {
  const n = String(index + 1).padStart(2, "0");
  const meta = [
    book.year && `${book.year} год`,
    book.price ? `Цена: ${book.price}` : null,
    book.orderDate && `заказ от ${book.orderDate}`,
    book.code && `Код BS: ${book.code}`,
  ]
    .filter(Boolean)
    .join("  ·  ");

  return (
    <article className="rounded-xl border border-border bg-surface p-3 sm:p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start">
        <div className="flex min-w-0 flex-1 gap-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-surface-3 font-mono text-xs tabular-nums text-muted">
            {n}
          </div>
          <div className="min-w-0">
            <h3 className="text-pretty text-sm font-medium leading-snug">{book.title}</h3>
            {meta ? <p className="mt-1 text-xs text-muted">{meta}</p> : null}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 lg:justify-end">
          <div className="inline-flex rounded-lg bg-surface-3 p-0.5">
            {STATUSES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => onStatus(s)}
                className={cn(
                  "h-8 rounded-md px-2 text-2xs font-medium transition-colors duration-150",
                  book.status === s
                    ? statusActive[s]
                    : "text-muted hover:text-foreground",
                )}
              >
                {STATUS_LABEL[s]}
              </button>
            ))}
          </div>

          <Tooltip content="Скопировать название для поиска на складе">
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                await copyText(book.title);
                toast.success("Название скопировано");
              }}
            >
              <Search />
              В поиск
            </Button>
          </Tooltip>

          <Tooltip content={book.photoUrl ? "Открыть фото лота" : "Ссылка на фото не найдена"}>
            <Button
              variant="outline"
              size="sm"
              disabled={!book.photoUrl}
              onClick={() => {
                if (book.photoUrl) window.open(book.photoUrl, "_blank", "noopener");
              }}
            >
              <Camera />
              Фото
            </Button>
          </Tooltip>
        </div>
      </div>
    </article>
  );
}

const statusActive: Record<BookStatus, string> = {
  pending: "bg-warn text-warn-foreground",
  found: "bg-success text-success-foreground",
  not_found: "bg-danger text-danger-foreground",
  sold: "bg-sold text-sold-foreground",
};
