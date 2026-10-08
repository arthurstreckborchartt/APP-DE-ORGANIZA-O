import { useState, type KeyboardEvent } from "react";
import { motion } from "motion/react";
import { Trash2 } from "lucide-react";
import { CheckButton } from "@/components/ui/CheckButton";
import type { Priority } from "@/types/db";

type Props = {
  item: Priority;
  onToggle: () => void;
  onRename: (title: string) => void;
  onRemove: () => void;
};

export function PriorityRow({ item, onToggle, onRename, onRemove }: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(item.title);

  function commit() {
    const title = draft.trim();
    setEditing(false);
    if (title && title !== item.title) onRename(title);
    else setDraft(item.title);
  }

  function onKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") commit();
    if (e.key === "Escape") {
      setDraft(item.title);
      setEditing(false);
    }
  }

  return (
    <motion.div
      layout
      className={`group flex min-h-16 items-center gap-3 rounded-2xl border px-4 py-3 transition-colors ${
        item.done ? "border-line/60 bg-surface/50" : "border-line bg-surface"
      }`}
    >
      <CheckButton checked={item.done} onClick={onToggle} label={`Marcar "${item.title}" como feita`} />

      {editing ? (
        <input
          autoFocus
          value={draft}
          maxLength={200}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={onKey}
          className="min-w-0 flex-1 bg-transparent text-base outline-none"
        />
      ) : (
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="min-w-0 flex-1 text-left text-base break-words"
          title="Toque para editar"
        >
          <span
            className={`line-through decoration-2 transition-colors duration-300 ${
              item.done ? "text-muted decoration-muted" : "decoration-transparent"
            }`}
          >
            {item.title}
          </span>
        </button>
      )}

      <button
        type="button"
        onClick={onRemove}
        aria-label={`Apagar "${item.title}"`}
        className="grid size-9 shrink-0 place-items-center rounded-xl text-muted/60 transition hover:bg-rose-500/10 hover:text-rose-400 md:opacity-0 md:group-hover:opacity-100 md:focus:opacity-100"
      >
        <Trash2 className="size-4" />
      </button>
    </motion.div>
  );
}
