import type { RouteObject } from "react-router-dom";

export const requesterRoutes: RouteObject[] = [
  {
    path: "/requester",
    element: <div>Requester Dashboard</div>,
  },
  {
    path: "/requester/dashboard",
    element: <div>Requester Dashboard</div>,
  },
  {
    path: "/requester/create-request",
    element: <div>Create Request</div>,
  },
  {
    path: "/requester/my-requests",
    element: <div>My Requests</div>,
  },
  {
    path: "/requester/requests/:id",
    element: <div>Request Details</div>,
  },
];
