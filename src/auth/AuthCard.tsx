import type { ReactNode } from "react";
import { motion } from "motion/react";

/** Moldura das telas de autenticação: logo, título e cartão central. */
export function AuthCard({ subtitle, children }: { subtitle: string; children: ReactNode }) {
  return (
    <div className="flex min-h-dvh items-center justify-center px-5 py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
        className="w-full max-w-sm"
      >
        <div className="mb-8 text-center">
          <img src="/icon.svg" alt="" className="mx-auto mb-4 size-14 drop-shadow-[0_8px_24px_rgb(139_92_246/0.45)]" />
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="text-gradient">Organiza</span>
          </h1>
          <p className="mt-2 text-muted">{subtitle}</p>
        </div>
        <div className="rounded-3xl border border-line bg-surface/80 p-6 shadow-2xl shadow-black/40 backdrop-blur">
          {children}
        </div>
      </motion.div>
    </div>
  );
}

export function FormMessage({ error, info }: { error?: string | null; info?: string | null }) {
  if (error)
    return (
      <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-rose-400" role="alert">
        {error}
      </motion.p>
    );
  if (info)
    return (
      <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-emerald-400" role="status">
        {info}
      </motion.p>
    );
  return null;
}
