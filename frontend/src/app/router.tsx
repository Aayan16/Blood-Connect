import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { requesterRoutes } from "@/features/requester/routes";
import { donorRoutes } from "@/features/donor/routes";
import { hospitalRoutes } from "@/features/hospital/routes";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <div className="p-8 text-center text-xl font-semibold text-primary">
        BloodConnect Landing Page
      </div>
    ),
  },
  {
    path: "/login",
    element: (
      <div className="p-8 text-center text-xl font-semibold">Login Page</div>
    ),
  },
  {
    path: "/register",
    element: (
      <div className="p-8 text-center text-xl font-semibold">Register Page</div>
    ),
  },
  ...requesterRoutes,
  ...donorRoutes,
  ...hospitalRoutes,
  {
    path: "*",
    element: (
      <div className="p-8 text-center text-xl font-semibold">
        404 - Page Not Found
      </div>
    ),
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
