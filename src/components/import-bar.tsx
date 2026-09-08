import { ChevronDown, Download, FileCode2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { fetchAlibPage } from "@/lib/fetch-alib";
import { looksLikeAlibHtml, parseAlibHtml } from "@/lib/parser";
import { SAMPLE_ALIB_HTML } from "@/lib/seed";
import { useOrders } from "@/lib/store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function ImportBar() {
  const url = useOrders((s) => s.importUrl);
  const html = useOrders((s) => s.importHtml);
  const setUrl = useOrders((s) => s.setImportUrl);
  const setHtml = useOrders((s) => s.setImportHtml);
  const mergeParsed = useOrders((s) => s.mergeParsed);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  function applyParsed(raw: string, isManual: boolean) {
    if (!looksLikeAlibHtml(raw)) {
      toast.error("Нужен исходный HTML страницы заказов Alib, а не обычный текст.");
      if (isManual) setOpen(true);
      return;
    }
    const parsed = parseAlibHtml(raw);
    if (!parsed.length) {
      toast.error(isManual ? "В тексте не найдено новых заказов." : "На странице не удалось найти заказы.");
      return;
    }
    const { added } = mergeParsed(parsed);
    if (added > 0) toast.success(`Добавлено новых книг: ${added}`);
    else toast.message("Новых заказов нет — существующие обновлены.");
  }

  async function loadUrl() {
    const src = url.trim();
    if (!src.startsWith("http")) {
      toast.error("Введите корректную ссылку на заказы.");
      return;
    }
    setBusy(true);
    try {
      const { html: page } = await fetchAlibPage({ data: { url: src } });
      applyParsed(page, false);
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Не удалось загрузить. Вставьте HTML вручную.",
      );
      setOpen(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="border-b border-border px-4 py-3 sm:px-6">
      <div className="flex flex-col gap-2">
        <div className="text-xs font-medium tracking-wide text-muted uppercase">
          Импорт заказов
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Ссылка на страницу заказов Alib.ru"
            className="min-w-0 flex-1 bg-surface"
          />
          <div className="flex gap-2">
            <Button onClick={loadUrl} disabled={busy} className="flex-1 sm:flex-none">
              <Download />
              {busy ? "Загрузка…" : "Загрузить"}
            </Button>
            <Button
              variant="ghost"
              onClick={() => setOpen((v) => !v)}
              className="flex-1 sm:flex-none"
            >
              <FileCode2 />
              HTML
              <ChevronDown className={cn("size-4", open && "rotate-180")} />
            </Button>
          </div>
        </div>
      </div>

      {open ? (
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <Textarea
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            placeholder="Вставьте исходный HTML со страницы заказов Alib.ru"
            className="min-h-24 flex-1 bg-surface font-mono text-xs"
          />
          <div className="flex gap-2 sm:flex-col">
            <Button
              variant="secondary"
              onClick={() => applyParsed(html, true)}
            >
              Распарсить
            </Button>
            <Button
              variant="ghost"
              onClick={() => setHtml(SAMPLE_ALIB_HTML)}
            >
              Пример
            </Button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
