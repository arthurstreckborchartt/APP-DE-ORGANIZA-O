import { Flame } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";

export function HabitsPage() {
  return (
    <>
      <PageHeader title="Hábitos" subtitle={"Constância"} />
      <EmptyState icon={Flame} title="Em breve" text="Academia, estudo e a sua sequência de dias." />
    </>
  );
}
