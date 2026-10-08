import { CalendarCheck } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";

export function TodayPage() {
  return (
    <>
      <PageHeader title="Hoje" subtitle={new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })} />
      <EmptyState icon={CalendarCheck} title="Em breve" text="Aqui vão ficar suas 3 prioridades do dia." />
    </>
  );
}
