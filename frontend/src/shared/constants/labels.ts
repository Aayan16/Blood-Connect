import { REQUEST_STATUSES, type RequestStatus } from "./statuses";
import { DONOR_RESPONSE_STATUSES, type DonorResponseStatus } from "./donorResponse";
import type { BloodGroup } from "./bloodGroups";

export const REQUEST_STATUS_LABELS: Record<RequestStatus, string> = {
  [REQUEST_STATUSES.MATCHING]: "Matching Donors",
  [REQUEST_STATUSES.DONOR_ACCEPTED]: "Donor Accepted",
  [REQUEST_STATUSES.BLOOD_RECEIVED]: "Blood Received",
  [REQUEST_STATUSES.COMPLETED]: "Completed",
  [REQUEST_STATUSES.CANCELLED]: "Cancelled",
};

export const DONOR_RESPONSE_LABELS: Record<DonorResponseStatus, string> = {
  [DONOR_RESPONSE_STATUSES.PENDING]: "Pending Response",
  [DONOR_RESPONSE_STATUSES.ACCEPTED]: "Accepted",
  [DONOR_RESPONSE_STATUSES.DECLINED]: "Declined",
};

export const BLOOD_GROUP_LABELS: Record<BloodGroup, string> = {
  "O+": "O Positive (O+)",
  "O-": "O Negative (O-)",
  "A+": "A Positive (A+)",
  "A-": "A Negative (A-)",
  "B+": "B Positive (B+)",
  "B-": "B Negative (B-)",
  "AB+": "AB Positive (AB+)",
  "AB-": "AB Negative (AB-)",
};
