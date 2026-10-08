import { forwardRef, type InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & { label: string };

export const Input = forwardRef<HTMLInputElement, Props>(function Input({ label, id, className = "", ...rest }, ref) {
  const inputId = id ?? rest.name;
  return (
    <label htmlFor={inputId} className="block">
      <span className="mb-1.5 block text-sm font-medium text-muted">{label}</span>
      <input
        ref={ref}
        id={inputId}
        className={`h-12 w-full rounded-2xl border border-line bg-surface px-4 text-base text-white outline-none transition placeholder:text-zinc-600 focus:border-accent focus:ring-4 focus:ring-accent/15 ${className}`}
        {...rest}
      />
    </label>
  );
});
