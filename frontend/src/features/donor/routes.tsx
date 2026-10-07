import type { RouteObject } from "react-router-dom";

export const donorRoutes: RouteObject[] = [
  {
    path: "/donor",
    element: <div>Donor Home</div>,
  },
  {
    path: "/donor/incoming-requests",
    element: <div>Incoming Requests</div>,
  },
  {
    path: "/donor/profile",
    element: <div>Donor Profile</div>,
  },
  {
    path: "/donor/setup",
    element: <div>Donor Setup</div>,
  },
  {
    path: "/donor/donations",
    element: <div>Donation History</div>,
  },
];
