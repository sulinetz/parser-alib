import { Check, Package, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { checkedCount, type Buyer } from "@/lib/types";
import { cn } from "@/lib/utils";

export function BuyerList({
  buyers,
  activeId,
  onSelect,
  onToggle,
  onExportSelected,
}: {
  buyers: Buyer[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onToggle: (id: string) => void;
  onExportSelected: () => void;
}) {
  const selected = buyers.filter((b) => b.selected && !b.archived);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <Button
        variant="export"
        className="mb-3 w-full justify-between rounded-lg"
        onClick={onExportSelected}
        disabled={selected.length === 0}
      >
        <span className="inline-flex items-center gap-2">
          <Package className="size-4" />
          Экспорт выбранных
        </span>
        <span className="tabular-nums text-xs opacity-80">{selected.length}</span>
      </Button>

      <div className="min-h-0 flex-1 space-y-1.5 overflow-y-auto pr-0.5">
        {buyers.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border px-4 py-10 text-center text-sm text-muted">
            Нет заказов в этой вкладке
          </div>
        ) : (
          buyers.map((buyer) => (
            <BuyerCard
              key={buyer.id}
              buyer={buyer}
              active={buyer.id === activeId}
              onSelect={() => onSelect(buyer.id)}
              onToggle={() => onToggle(buyer.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

function BuyerCard({
  buyer,
  active,
  onSelect,
  onToggle,
}: {
  buyer: Buyer;
  active: boolean;
  onSelect: () => void;
  onToggle: () => void;
}) {
  const done = checkedCount(buyer);
  const total = buyer.books.length;
  const pct = total ? (done / total) * 100 : 0;

  return (
    <div
      className={cn(
        "rounded-xl border p-3 transition-colors duration-150",
        active
          ? "border-accent/35 bg-surface-2"
          : "border-transparent bg-surface hover:border-border",
      )}
    >
      <div className="flex items-start gap-2.5">
        {!buyer.archived ? (
          <button
            type="button"
            aria-label="Выбрать заказ"
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
            className={cn(
              "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-sm border",
              buyer.selected
                ? "border-accent bg-accent text-accent-foreground"
                : "border-border bg-surface",
            )}
          >
            {buyer.selected ? <Check className="size-3" strokeWidth={3} /> : null}
          </button>
        ) : null}

        <button type="button" onClick={onSelect} className="min-w-0 flex-1 text-left">
          <div className="truncate text-sm font-medium">{buyer.name}</div>
          <div className="mt-0.5 truncate text-xs text-muted">{buyer.address}</div>
          <div className="mt-2.5 flex items-center gap-2">
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-surface-3">
              <div
                className="h-full rounded-full bg-success"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-2xs tabular-nums text-subtle">
              {done}/{total}
            </span>
            {buyer.weight ? (
              <span className="inline-flex items-center gap-1 text-2xs text-muted">
                <Scale className="size-3" />
                {buyer.weight}
              </span>
            ) : null}
          </div>
        </button>
      </div>
    </div>
  );
}
