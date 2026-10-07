export const ROUTES = {
  HOME: "/",
  AUTH: {
    LOGIN: "/login",
    REGISTER: "/register",
  },
  REQUESTER: {
    ROOT: "/requester",
    DASHBOARD: "/requester/dashboard",
    CREATE_REQUEST: "/requester/create-request",
    MY_REQUESTS: "/requester/my-requests",
    REQUEST_DETAILS: (id: string = ":id") => `/requester/requests/${id}`,
  },
  DONOR: {
    ROOT: "/donor",
    INCOMING_REQUESTS: "/donor/incoming-requests",
    PROFILE: "/donor/profile",
    SETUP: "/donor/setup",
    DONATIONS: "/donor/donations",
  },
  HOSPITAL: {
    ROOT: "/hospital",
    OVERVIEW: "/hospital/overview",
    INVENTORY: "/hospital/inventory",
    REQUESTS: "/hospital/requests",
    BRANCHES: "/hospital/branches",
    REPORTS: "/hospital/reports",
    PROFILE: "/hospital/profile",
  },
} as const;
