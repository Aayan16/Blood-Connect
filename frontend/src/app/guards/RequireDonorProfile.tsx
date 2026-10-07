import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../providers/AuthProvider";
import { ROUTES } from "@/shared/constants";

interface RequireDonorProfileProps {
  children: ReactNode;
}

export function RequireDonorProfile({ children }: RequireDonorProfileProps) {
  const { user, isAuthenticated } = useAuthContext();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.AUTH.LOGIN} replace />;
  }

  if (!user?.hasDonorProfile) {
    return <Navigate to={ROUTES.DONOR.SETUP} replace />;
  }

  return <>{children}</>;
}
