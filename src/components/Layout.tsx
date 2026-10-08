import { NavLink, Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { CalendarCheck, Flame, LogOut, Target, Wallet, type LucideIcon } from "lucide-react";
import { useAuth } from "@/auth/AuthProvider";

type Tab = { to: string; label: string; icon: LucideIcon };

const tabs: Tab[] = [
  { to: "/", label: "Hoje", icon: CalendarCheck },
  { to: "/contas", label: "Contas", icon: Wallet },
  { to: "/metas", label: "Metas", icon: Target },
  { to: "/habitos", label: "Hábitos", icon: Flame },
];

export function Layout() {
  const { user, signOut } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-dvh md:flex">
      {/* Menu lateral (PC / tablet) */}
      <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-line bg-surface/40 p-5 backdrop-blur md:flex">
        <div className="mb-8 flex items-center gap-3 px-2">
          <img src="/icon.svg" alt="" className="size-9" />
          <span className="text-xl font-bold tracking-tight">Organiza</span>
        </div>
        <nav className="flex flex-1 flex-col gap-1">
          {tabs.map((t) => (
            <NavLink
              key={t.to}
              to={t.to}
              end={t.to === "/"}
              className={({ isActive }) =>
                `relative flex h-11 items-center gap-3 rounded-xl px-3 font-medium transition ${
                  isActive ? "text-white" : "text-muted hover:bg-surface-2/60 hover:text-zinc-200"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.span
                      layoutId="side-active"
                      className="absolute inset-0 -z-10 rounded-xl bg-surface-2"
                      transition={{ type: "spring", stiffness: 400, damping: 34 }}
                    />
                  )}
                  <t.icon className={`size-5 ${isActive ? "text-accent" : ""}`} />
                  {t.label}
                </>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-line pt-4">
          <p className="mb-2 truncate px-2 text-xs text-muted">{user?.email}</p>
          <button
            onClick={signOut}
            className="flex h-10 w-full items-center gap-3 rounded-xl px-3 text-sm text-muted transition hover:bg-surface-2/60 hover:text-zinc-200"
          >
            <LogOut className="size-4" /> Sair
          </button>
        </div>
      </aside>

      {/* Conteúdo */}
      <main className="mx-auto w-full max-w-2xl flex-1 px-5 pt-[max(1.5rem,env(safe-area-inset-top))] pb-28 md:px-10 md:pt-10 md:pb-10">
        <div className="mb-4 flex items-center justify-between md:hidden">
          <div className="flex items-center gap-2">
            <img src="/icon.svg" alt="" className="size-7" />
            <span className="font-bold tracking-tight">Organiza</span>
          </div>
          <button
            onClick={signOut}
            aria-label="Sair"
            className="grid size-10 place-items-center rounded-xl text-muted transition hover:bg-surface-2 hover:text-zinc-200"
          >
            <LogOut className="size-5" />
          </button>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Abas embaixo (celular) */}
      <nav className="pb-safe fixed inset-x-0 bottom-0 z-20 border-t border-line bg-bg/85 backdrop-blur-xl md:hidden">
        <div className="mx-auto grid max-w-md grid-cols-4">
          {tabs.map((t) => (
            <NavLink
              key={t.to}
              to={t.to}
              end={t.to === "/"}
              className={({ isActive }) =>
                `relative flex h-16 flex-col items-center justify-center gap-1 text-[11px] font-medium transition ${
                  isActive ? "text-white" : "text-muted"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.span
                      layoutId="tab-active"
                      className="absolute top-0 h-0.5 w-10 rounded-full bg-gradient-to-r from-accent to-accent-2"
                      transition={{ type: "spring", stiffness: 500, damping: 36 }}
                    />
                  )}
                  <motion.span animate={{ scale: isActive ? 1.1 : 1 }}>
                    <t.icon className={`size-6 ${isActive ? "text-accent" : ""}`} />
                  </motion.span>
                  {t.label}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
