import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogPortal = DialogPrimitive.Portal;
export const DialogClose = DialogPrimitive.Close;

export function DialogOverlay({ className, ...props }) {
  return (
    <DialogPrimitive.Overlay
      className={cn(
        "fixed inset-0 z-50 bg-black/45",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className
      )}
      {...props}
    />
  );
}

export function DialogContent({
  className,
  children,
  size = "md",
  showClose = true,
  title = "對話視窗",
  description = "此視窗包含目前操作的相關內容。",
  hideTitle = true,
  hideDescription = true,
  ...props
}) {
  const widthMap = {
    sm: "var(--modal-width-sm)",
    md: "var(--modal-width-md)",
    lg: "var(--modal-width-lg)",
    xl: "var(--modal-width-xl)",
  };

  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        className={cn(
          "fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2",
          "w-[calc(100vw-2rem)] overflow-hidden",
          "bg-[var(--color-card)]",
          "focus:outline-none",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          className
        )}
        style={{
          maxWidth: widthMap[size] ?? widthMap.md,
          maxHeight: "var(--modal-max-height)",
          borderRadius: "var(--radius-modal)",
          boxShadow: "var(--shadow-modal)",
        }}
        {...props}
      >
        <DialogPrimitive.Title
          className={hideTitle ? "sr-only" : "text-sm font-semibold text-[var(--color-text-primary)]"}
        >
          {title}
        </DialogPrimitive.Title>

        <DialogPrimitive.Description
          className={hideDescription ? "sr-only" : "text-sm text-[var(--color-text-muted)]"}
        >
          {description}
        </DialogPrimitive.Description>

        {children}

        {showClose && (
          <DialogPrimitive.Close className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-primary-strong)] focus:outline-none">
            <X className="h-4 w-4" />
            <span className="sr-only">關閉</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

export function DialogHeader({ className, ...props }) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1.5 px-6 pt-5 pb-4 border-b border-[var(--color-border)]",
        className
      )}
      {...props}
    />
  );
}

export function DialogFooter({ className, ...props }) {
  return (
    <div
      className={cn(
        "flex items-center justify-end gap-3 px-6 py-4 border-t border-[var(--color-border)]",
        className
      )}
      {...props}
    />
  );
}

export function DialogTitle({ className, ...props }) {
  return (
    <DialogPrimitive.Title
      className={cn("text-sm font-semibold text-[var(--color-text-primary)]", className)}
      {...props}
    />
  );
}

export function DialogDescription({ className, ...props }) {
  return (
    <DialogPrimitive.Description
      className={cn("text-sm text-[var(--color-text-muted)]", className)}
      {...props}
    />
  );
}
