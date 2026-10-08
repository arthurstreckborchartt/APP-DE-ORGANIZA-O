import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "@/auth/AuthProvider";
import { LoginPage } from "@/auth/LoginPage";
import { RequireAuth } from "@/auth/RequireAuth";
import { Layout } from "@/components/Layout";
import { TodayPage } from "@/features/today/TodayPage";
import { BillsPage } from "@/features/bills/BillsPage";
import { GoalsPage } from "@/features/goals/GoalsPage";
import { HabitsPage } from "@/features/habits/HabitsPage";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
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
