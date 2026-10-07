import type { RouteObject } from "react-router-dom";

export const hospitalRoutes: RouteObject[] = [
  {
    path: "/hospital",
    element: <div>Hospital Overview</div>,
  },
  {
    path: "/hospital/overview",
    element: <div>Hospital Overview</div>,
  },
  {
    path: "/hospital/inventory",
    element: <div>Hospital Inventory</div>,
  },
  {
    path: "/hospital/requests",
    element: <div>Hospital Blood Requests</div>,
  },
  {
    path: "/hospital/branches",
    element: <div>Hospital Branches</div>,
  },
  {
    path: "/hospital/reports",
    element: <div>Hospital Reports</div>,
  },
  {
    path: "/hospital/profile",
    element: <div>Hospital Profile</div>,
  },
];
