export const queryKeys = {
  auth: {
    user: ["auth", "user"] as const,
  },
  requests: {
    all: ["requests"] as const,
    detail: (id: string) => ["requests", id] as const,
  },
  donor: {
    profile: ["donor", "profile"] as const,
    incoming: ["donor", "incoming"] as const,
  },
  hospital: {
    inventory: ["hospital", "inventory"] as const,
    overview: ["hospital", "overview"] as const,
  },
} as const;
