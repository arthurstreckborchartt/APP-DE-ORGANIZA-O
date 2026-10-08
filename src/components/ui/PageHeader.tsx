import { motion } from "motion/react";
import type { ReactNode } from "react";

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 flex items-end justify-between gap-4"
    >
      <div>
        {subtitle && <p className="text-sm font-medium text-muted first-letter:uppercase">{subtitle}</p>}
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      </div>
      {action}
    </motion.header>
  );
}
