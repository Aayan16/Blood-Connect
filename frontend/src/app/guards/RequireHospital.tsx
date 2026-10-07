import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../providers/AuthProvider";
import { ROUTES } from "@/shared/constants/routes";

interface RequireHospitalProps {
  children: ReactNode;
}

export function RequireHospital({ children }: RequireHospitalProps) {
  const { user, isAuthenticated } = useAuthContext();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.AUTH.LOGIN} replace />;
  }

  if (user?.role !== "hospital") {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return <>{children}</>;
}
