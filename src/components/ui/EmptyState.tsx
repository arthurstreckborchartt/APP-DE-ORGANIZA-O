import type { LucideIcon } from "lucide-react";

export function EmptyState({ icon: Icon, title, text }: { icon: LucideIcon; title: string; text: string }) {
  return (
    <div className="flex flex-col items-center rounded-3xl border border-dashed border-line bg-surface/50 px-6 py-12 text-center">
      <div className="mb-4 grid size-14 place-items-center rounded-2xl bg-surface-2">
        <Icon className="size-7 text-accent" />
      </div>
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-1 max-w-xs text-sm text-muted">{text}</p>
    </div>
  );
}
