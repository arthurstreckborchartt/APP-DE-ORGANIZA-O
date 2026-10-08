import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "@/auth/AuthProvider";
import { LoginPage } from "@/auth/LoginPage";
import { RequireAuth } from "@/auth/RequireAuth";
import { NewPasswordPage } from "@/auth/NewPasswordPage";
import { Layout } from "@/components/Layout";
import { TodayPage } from "@/features/today/TodayPage";
import { BillsPage } from "@/features/bills/BillsPage";
import { GoalsPage } from "@/features/goals/GoalsPage";
import { HabitsPage } from "@/features/habits/HabitsPage";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <RecoveryRedirect />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/nova-senha" element={<NewPasswordPage />} />
          <Route element={<RequireAuth />}>
            <Route element={<Layout />}>
              <Route index element={<TodayPage />} />
              <Route path="contas" element={<BillsPage />} />
              <Route path="metas" element={<GoalsPage />} />
              <Route path="habitos" element={<HabitsPage />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

/**
 * Se a pessoa chegou pelo link de "esqueci minha senha" em outra página
 * (ex.: o Supabase redirecionou para a raiz do site), leva para /nova-senha.
 */
function RecoveryRedirect() {
  const { recovery } = useAuth();
  const { pathname } = useLocation();
  return recovery && pathname !== "/nova-senha" ? <Navigate to="/nova-senha" replace /> : null;
}
