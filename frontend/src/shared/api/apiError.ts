export interface ApiError {
  code: string;
  message: string;
  fields?: Record<string, string>;
}

export function parseApiError(error: unknown): ApiError {
  if (
    error &&
    typeof error === "object" &&
    "response" in error &&
    error.response &&
    typeof error.response === "object" &&
    "data" in error.response &&
    error.response.data
  ) {
    const data = error.response.data as Partial<ApiError>;
    return {
      code: data.code || "UNKNOWN_ERROR",
      message: data.message || "An unexpected error occurred.",
      fields: data.fields,
    };
  }

  if (error instanceof Error) {
    return {
      code: "CLIENT_ERROR",
      message: error.message,
    };
  }

  return {
    code: "UNKNOWN_ERROR",
    message: "An unexpected error occurred.",
  };
}
