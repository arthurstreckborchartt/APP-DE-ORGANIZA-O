import { motion } from "motion/react";

export function CheckButton({ checked, onClick, label }: { checked: boolean; onClick: () => void; label: string }) {
  return (
    <motion.button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      onClick={onClick}
      whileTap={{ scale: 0.85 }}
      className={`grid size-7 shrink-0 place-items-center rounded-full border-2 transition-colors ${
        checked ? "border-transparent bg-gradient-to-br from-accent to-accent-2" : "border-line hover:border-accent"
      }`}
    >
      <svg viewBox="0 0 24 24" className="size-4">
        <motion.path
          d="M5 12.5l4.5 4.5L19 7.5"
          fill="none"
          stroke="white"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={false}
          animate={{ pathLength: checked ? 1 : 0, opacity: checked ? 1 : 0 }}
          transition={{ duration: 0.25 }}
        />
      </svg>
    </motion.button>
  );
}
