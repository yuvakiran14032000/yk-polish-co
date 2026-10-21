"use client";
import { Dialog } from "radix-ui";
import { X } from "lucide-react";
export function Modal({
  open,
  onOpenChange,
  title,
  children,
  drawer = false,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  children: React.ReactNode;
  drawer?: boolean;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="modal-overlay" />
        <Dialog.Content
          className={drawer ? "modal-panel drawer-panel" : "modal-panel"}
          aria-describedby={undefined}
        >
          <div className="modal-heading">
            <Dialog.Title>{title}</Dialog.Title>
            <Dialog.Close className="icon-button" aria-label="Close dialog">
              <X size={20} />
            </Dialog.Close>
          </div>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
