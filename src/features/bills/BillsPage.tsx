import { Wallet } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";

export function BillsPage() {
  return (
    <>
      <PageHeader title="Contas" subtitle={"Financeiro"} />
      <EmptyState icon={Wallet} title="Em breve" text="Suas contas, valores e vencimentos." />
    </>
  );
}
