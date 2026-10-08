import { motion, type HTMLMotionProps } from "motion/react";

type Variant = "primary" | "ghost";

const styles: Record<Variant, string> = {
  primary:
    "bg-gradient-to-r from-accent to-accent-2 text-white shadow-lg shadow-accent/20 hover:brightness-110",
  ghost: "bg-surface-2 text-zinc-200 hover:bg-line",
};

type Props = HTMLMotionProps<"button"> & { variant?: Variant; loading?: boolean };

export function Button({ variant = "primary", loading, disabled, className = "", children, ...rest }: Props) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      disabled={disabled || loading}
      className={`inline-flex h-12 items-center justify-center gap-2 rounded-2xl px-5 font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${styles[variant]} ${className}`}
      {...rest}
    >
      {loading ? (
        <span className="size-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
      ) : (
        children
      )}
    </motion.button>
  );
}
