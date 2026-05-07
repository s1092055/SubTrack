export function LoginShell({ children }) {
  return (
    <div className="h-screen flex flex-col bg-white">
      <header className="flex-shrink-0 w-full flex justify-center pt-8 pb-2">
        <p className="font-extrabold text-[var(--color-text-secondary)] text-sm tracking-widest">SUBTRACK</p>
      </header>
      <div className="flex-1 overflow-y-auto min-h-0 flex flex-col items-center px-6 pt-12 pb-6">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
export function RegisterShell({ children, footer, maxWidth = "max-w-sm" }) {
  return (
    <div className="h-screen flex flex-col bg-white">
      <header className="flex-shrink-0 w-full flex justify-center pt-8 pb-2">
        <p className="font-extrabold text-[var(--color-text-secondary)] text-sm tracking-widest">SUBTRACK</p>
      </header>
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className={`w-full ${maxWidth} mx-auto px-6 pt-10 pb-6`}>
          {children}
        </div>
      </div>
      <div className="flex-shrink-0 bg-white border-t border-[var(--color-border)] px-6">
        <div className="w-full max-w-2xl mx-auto h-16 flex items-center">
          {footer}
        </div>
      </div>
    </div>
  );
}
