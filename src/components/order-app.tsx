import { PanelLeft } from "lucide-react";
import { useMemo, useState } from "react";
import { Toaster } from "sonner";
import { AppHeader } from "@/components/app-header";
import { BuyerList } from "@/components/buyer-list";
import { ImportBar } from "@/components/import-bar";
import { EmptyWorkspace, Workspace } from "@/components/workspace";
import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import { TooltipProvider } from "@/components/ui/tooltip";
import { copyOrdersHtml } from "@/lib/export-html";
import { useOrders } from "@/lib/store";
import { latestOrderDate } from "@/lib/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function OrderApp() {
  const buyers = useOrders((s) => s.buyers);
  const tab = useOrders((s) => s.tab);
  const setTab = useOrders((s) => s.setTab);
  const activeId = useOrders((s) => s.activeId);
  const setActive = useOrders((s) => s.setActive);
  const toggleSelect = useOrders((s) => s.toggleSelect);
  const archiveMany = useOrders((s) => s.archiveMany);
  const [sheet, setSheet] = useState(false);

  const visible = useMemo(
    () =>
      buyers
        .filter((b) => (tab === "history" ? b.archived : !b.archived))
        .sort((a, b) => latestOrderDate(b).localeCompare(latestOrderDate(a))),
    [buyers, tab],
  );
  const active = buyers.find((b) => b.id === activeId) ?? null;

  async function exportSelected() {
    const pack = buyers.filter((b) => b.selected && !b.archived);
    if (!pack.length) {
      toast.error("Отметьте хотя бы одного покупателя слева.");
      return;
    }
    await copyOrdersHtml(pack);
    archiveMany(pack.map((b) => b.id));
    toast.success(`Скопировано в буфер: ${pack.length}. Заказы ушли в историю.`);
  }

  const list = (
    <div className="flex h-full min-h-0 flex-col">
      <div className="mb-3 grid grid-cols-2 rounded-lg bg-surface-3 p-0.5">
        <button
          type="button"
          onClick={() => setTab("work")}
          className={cn(
            "h-9 rounded-md text-sm font-medium",
            tab === "work" ? "bg-surface text-foreground" : "text-muted",
          )}
        >
          В работе
        </button>
        <button
          type="button"
          onClick={() => setTab("history")}
          className={cn(
            "h-9 rounded-md text-sm font-medium",
            tab === "history" ? "bg-surface text-foreground" : "text-muted",
          )}
        >
          История
        </button>
      </div>
      <BuyerList
        buyers={visible}
        activeId={activeId}
        onSelect={(id) => {
          setActive(id);
          setSheet(false);
        }}
        onToggle={toggleSelect}
        onExportSelected={exportSelected}
      />
    </div>
  );

  return (
    <TooltipProvider>
      <div className="flex h-dvh flex-col bg-bg text-foreground">
        <AppHeader />
        <ImportBar />
        <div className="flex min-h-0 flex-1">
          <aside className="hidden w-80 shrink-0 border-r border-border p-3 md:flex md:flex-col">
            {list}
          </aside>
          <main className="flex min-w-0 flex-1 flex-col">
            <div className="flex items-center gap-2 border-b border-border px-3 py-2 md:hidden">
              <Button variant="secondary" size="sm" onClick={() => setSheet(true)}>
                <PanelLeft />
                Покупатели
              </Button>
            </div>
            {active ? <Workspace buyer={active} /> : <EmptyWorkspace />}
          </main>
        </div>
        <Sheet open={sheet} onOpenChange={setSheet} title="Покупатели">
          {list}
        </Sheet>
        <Toaster theme="dark" position="bottom-right" />
      </div>
    </TooltipProvider>
  );
}
