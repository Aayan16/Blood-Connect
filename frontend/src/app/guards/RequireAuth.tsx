import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../providers/AuthProvider";
import { ROUTES } from "@/shared/constants/routes";

interface RequireAuthProps {
  children: ReactNode;
}

export function RequireAuth({ children }: RequireAuthProps) {
  const { isAuthenticated } = useAuthContext();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.AUTH.LOGIN} replace />;
  }

  return <>{children}</>;
}
