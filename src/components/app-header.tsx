import { BookOpen, Clock, RotateCcw, Workflow } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { useOrders } from "@/lib/store";

export function AppHeader() {
  const buyers = useOrders((s) => s.buyers);
  const reset = useOrders((s) => s.resetDemo);
  const work = buyers.filter((b) => !b.archived).length;
  const history = buyers.filter((b) => b.archived).length;
  const books = buyers.reduce((n, b) => n + b.books.length, 0);

  return (
    <header className="flex flex-col gap-3 border-b border-border px-4 py-3 sm:flex-row sm:flex-wrap sm:items-center sm:px-6">
      <div className="flex items-center justify-between gap-3 sm:mr-auto">
        <div>
          <div className="font-display text-2xl leading-none tracking-tight">ALIB</div>
          <div className="mt-1 text-2xs font-medium tracking-widest text-muted uppercase">
            Менеджер заказов
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={reset} className="sm:hidden">
          <RotateCcw />
          Демо
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Stat icon={<Workflow className="size-3.5" />} label="В работе" value={work} />
        <Stat icon={<Clock className="size-3.5" />} label="История" value={history} />
        <Stat icon={<BookOpen className="size-3.5" />} label="Книг" value={books} />
      </div>

      <Button variant="ghost" size="sm" onClick={reset} className="hidden sm:inline-flex">
        <RotateCcw />
        Демо
      </Button>
    </header>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="inline-flex h-9 items-center gap-2 rounded-full border border-border bg-surface px-3 text-xs">
      <span className="text-muted">{icon}</span>
      <span className="text-muted">{label}</span>
      <span className="tabular-nums font-medium">{value}</span>
    </div>
  );
}
