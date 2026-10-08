import { useEffect, useState } from "react";
import { toISODate } from "./dates";

/** Data de hoje (YYYY-MM-DD) que se atualiza ao virar o dia ou ao voltar para o app. */
export function useToday(): string {
  const [today, setToday] = useState(toISODate);

  useEffect(() => {
    const refresh = () => setToday(toISODate());
    const timer = setInterval(refresh, 60_000);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, []);

  return today;
}
