export function Footer() {
  return (
    <footer className="border-t border-border/50 px-6 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="font-mono text-sm text-muted-foreground">
          <span className="text-primary">Void</span>Craft &copy;{" "}
          {new Date().getFullYear()}
        </p>
        <p className="text-xs text-muted-foreground/60">
          Building things from the void.
        </p>
      </div>
    </footer>
  );
}
