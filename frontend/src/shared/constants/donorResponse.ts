export const DONOR_RESPONSE_STATUSES = {
  PENDING: "Pending",
  ACCEPTED: "Accepted",
  DECLINED: "Declined",
} as const;

export type DonorResponseStatus =
  (typeof DONOR_RESPONSE_STATUSES)[keyof typeof DONOR_RESPONSE_STATUSES];

export const DONOR_RESPONSE_STATUS_LIST: DonorResponseStatus[] = [
  DONOR_RESPONSE_STATUSES.PENDING,
  DONOR_RESPONSE_STATUSES.ACCEPTED,
  DONOR_RESPONSE_STATUSES.DECLINED,
];
