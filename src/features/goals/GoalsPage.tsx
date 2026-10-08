import { Target } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";

export function GoalsPage() {
  return (
    <>
      <PageHeader title="Metas" subtitle={"Foco"} />
      <EmptyState icon={Target} title="Em breve" text="Poucas metas, cada uma com o próximo passo." />
    </>
  );
}
