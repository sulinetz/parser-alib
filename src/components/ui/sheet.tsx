import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Sheet({
  open,
  onOpenChange,
  title,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: ReactNode;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-bg/70" />
        <Dialog.Content
          className={cn(
            "fixed inset-y-0 left-0 z-50 flex w-full max-w-80 flex-col border-r border-border bg-bg-elevated p-3 shadow-xl outline-none",
          )}
        >
          <div className="mb-2 flex items-center justify-between px-1">
            <Dialog.Title className="text-sm font-medium">{title}</Dialog.Title>
            <Dialog.Close className="inline-flex size-10 items-center justify-center rounded-md text-muted hover:bg-surface-2 hover:text-foreground">
              <X className="size-4" />
            </Dialog.Close>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
