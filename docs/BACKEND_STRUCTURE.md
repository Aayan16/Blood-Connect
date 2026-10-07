# BloodConnect Backend: Structure and Rules

Read this before adding any file. If something is not covered here, ask the team and update this file.

> **Stack (suggested, confirm before starting):** Node.js + Express + TypeScript, PostgreSQL, Zod for validation, Socket.IO or polling for chat.
> Redis is not used at the start. Put anything that might use it later (jobs, rate limiting, notifications) behind your own helper so it can be swapped in one file.

---

## 1. Folder tree

```text
backend/
├── package.json
├── tsconfig.json
├── eslint.config.js
├── .env.example
└── src/
    ├── server.ts                    # starts the HTTP server
    ├── app.ts                       # builds the app and registers module routes
    │
    ├── modules/                     # one folder per feature area
    │   ├── auth/                    # register, login, Google, password reset
    │   ├── users/                   # account, notification settings, delete account
    │   ├── donors/                  # donor profile, availability, last donation
    │   ├── hospitals/               # hospitals and branches
    │   ├── inventory/               # stock, inventory history, low-stock threshold
    │   ├── requests/                # blood requests (requester and hospital read endpoints)
    │   ├── matching/                # who matches a request (single place)
    │   ├── donor-responses/         # accept, decline, withdraw, incoming requests
    │   ├── chat/                    # threads and messages
    │   ├── donations/               # created when a request completes
    │   ├── notifications/
    │   ├── reports/                 # computed from requests and inventory history
    │   └── admin/                   # RESERVED. Do not create files until the admin side is designed.
    │
    ├── core/                        # logic that several modules depend on
    │   ├── request-lifecycle/       # the ONLY place a request status changes
    │   └── permissions/             # role and ownership checks
    │
    ├── shared/
    │   ├── constants/               # statuses, donor response states, blood groups, labels
    │   ├── middleware/              # auth, role guard, validation, error handler
    │   ├── errors/                  # error types: { code, message, fields }
    │   ├── validation/              # shared rules (date not in past, units, phone, email)
    │   └── utils/
    │
    ├── db/
    │   ├── migrations/
    │   ├── seeds/                   # sample hospitals, branches, donors, requests
    │   └── schema.ts
    │
    └── config/                      # env, database, mail, file storage
```

### Inside every module

```text
requests/
├── requests.routes.ts         # URL paths and which controller function handles them
├── requests.controller.ts     # reads the HTTP request, calls the service, shapes the response
├── requests.service.ts        # business rules
├── requests.repository.ts     # database queries only
├── requests.schema.ts         # input validation
├── requests.types.ts
└── requests.test.ts
```

---

## 2. What each part is for

| Part | Purpose |
|---|---|
| `server.ts`, `app.ts` | Start the server and register every module's routes. No business logic. |
| `modules/<name>/` | One feature area, with all its layers together. |
| `routes` | Map URLs to controller functions and attach middleware. |
| `controller` | Translate between HTTP and the service. No business rules, no SQL. |
| `service` | Business rules and permissions for that module. |
| `repository` | The only code that talks to the database for that module. |
| `schema` | Validates input (Zod). Reject bad data before it reaches the service. |
| `core/request-lifecycle` | Enforces the allowed status transitions. Every status change goes through it. |
| `core/permissions` | Role and ownership checks used by many modules. |
| `shared/constants` | Statuses, donor response states, blood groups and labels, defined once. |
| `shared/middleware` | Authentication, role checks, validation, and the common error handler. |
| `db/migrations` | Versioned database changes. Never edit the database by hand. |
| `db/seeds` | Sample data so everyone can test every state. |
| `config` | Reads environment settings. No secrets in code. |

---

## 3. Module map

| Module | Owns | Main endpoints (prefix `/api/v1`) |
|---|---|---|
| `auth` | Sessions, Google sign-in | `/auth/*` |
| `users` | Account data, notification settings | `/users/me/*` |
| `donors` | Donor profile, availability, last donation, recent donations | `/donor-profile/*` |
| `hospitals` | Hospitals, branches (reference data for users, management for hospital staff) | `/hospitals`, `/branches/*` |
| `inventory` | Stock per branch, inventory history, threshold | `/hospital/inventory/*` |
| `requests` | Blood requests | `/requests/*`, `/hospital/requests/*` |
| `matching` | The matching function | none (used by other modules) |
| `donor-responses` | Accept, decline, withdraw, incoming list | `/donor/requests/*` |
| `chat` | Threads and messages | `/chats/*`, `/requests/:id/chats` |
| `donations` | Donation records | `/donations` |
| `notifications` | Bell list, unread count | `/notifications/*` |
| `reports` | Computed summaries | `/hospital/reports/*` |

Keep the donor modules as one folder (`donors`) while they are small. Split `donor-responses` out as written above only because it is tightly tied to requests.

---

## 4. Import rules

| From | May import | Must not import |
|---|---|---|
| a module's controller | its own service, `shared` | repositories, other modules |
| a module's service | its own repository, `core`, `shared`, another module's **service** | another module's repository or database tables |
| a module's repository | `db`, `shared` | services, controllers |
| `core/*` | `shared` | controllers, routes |
| `shared/*` | `shared` | modules, core |

Give hospital-side endpoints their own routes and responses, even if they read the same tables as user endpoints. A user response must never include hospital fields, and a hospital response must never include donor identities.

---

## 5. Rules

1. **One place changes request status.** Only `core/request-lifecycle` may change it. Allowed transitions are listed below.
2. **One place changes inventory.** All quantity changes go through the inventory service, which writes the history row (blood group, change, new total, reason, staff member, time) in the same step. Reject negative values and stale edits (the quantity changed since the form was opened).
3. **One place decides matching.** Blood group compatibility, distance and availability live in `modules/matching` only.
4. **Everything inventory-related is branch scoped.** Combined totals exist only in Reports, calculated by summing branches. They are never stored.
5. **Check permissions on the server for every request.** A user reads only their own requests and chats. A donor reads only requests matched to them. Hospital staff read only their own hospital's branches.
6. **The hospital gets counts, never donor data.** No donor names, locations or chat content in any hospital response.
7. **Chat is gated by acceptance.** A thread is created only when a donor accepts. It is read-only after the request is Completed or Cancelled, or after the donor withdraws. There is no "create chat" endpoint.
8. **Contact details stay private.** Phone numbers and addresses are not returned to the other party by default.
9. **Branches are never deleted.** Use Inactive. Inactive branches are excluded from the request form, but their old requests stay readable.
10. **Reports are computed from stored requests and inventory history.** Never store report numbers.
11. **Validate on the server too.** Date not in the past, units at least 1 for requests, units at least 0 for inventory, phone and email formats.
12. **Never store what the app does not need.** No patient identifiers, clinical notes or medical eligibility flags.
13. **Errors use one format:** `{ code, message, fields? }`. Status codes: 400 validation, 401 not signed in, 403 not allowed, 404 not found, 409 conflict (such as an invalid status transition).
14. **The last donation date is the donor's own entry.** It is always editable and is not derived from donation records.

---

## 6. Allowed status transitions

| From | To | Trigger |
|---|---|---|
| Matching | Donor Accepted | First matched donor accepts |
| Matching | Cancelled | Requester cancels |
| Donor Accepted | Completed (see decision D1) | Requester confirms blood received |
| Donor Accepted | Cancelled | Requester cancels. Accepted donors are notified and chats become read-only. |
| Donor Accepted | Matching (proposed) | All accepted donors withdraw |
| Completed, Cancelled | none | Terminal |

Any other transition is rejected with a 409. Write a test for every allowed transition and at least one forbidden transition per status.

---

## 7. Database basics

- Hierarchy: Hospital, then Branch, then Inventory (one row per branch and blood group).
- Account data lives in the user record. Donor data lives in a separate donor profile record linked to the user. A missing donor profile means "No donor profile yet".
- Each donor response is one row per matched donor per request, with state Pending, Accepted or Declined (and Withdrawn if decision D12 is yes).
- Every inventory change writes an inventory history row.
- Use migrations for every change. Use seeds for sample data.

---

## 8. Naming

- Files: `<module>.<layer>.ts` (for example `requests.service.ts`).
- Folders: lowercase and kebab-case.
- One module per feature area. Do not create a module before it has code.
- Never use `*` or special characters in file names.

---

## 9. Open decisions that change this backend

| # | Question | Effect |
|---|---|---|
| D1 | Does Confirm Blood Received set Completed directly? | The status list and the transition table. |
| D2 | What does Donor Accepted mean when 2 or more units are needed? | Completion rules and the donor responses logic. |
| D4 | Blood group compatibility, distance limit, and whether the hospital can supply blood directly. | The matching module and an optional hospital endpoint. |
| D5 | What happens to a request nobody confirms? | A scheduled job and an Expired status. |
| D12 | Can a donor withdraw after accepting? | The withdraw endpoint and the Withdrawn state. |

Do not build the parts that depend on a decision until it is settled.

---

## 10. Adding a feature

1. Decide which module owns it. Create a new module only if none fits.
2. Write the endpoint contract first (paths, request and response shapes, errors).
3. Add routes, controller, service, repository and schema in that module.
4. Take statuses, labels and blood groups from `shared/constants`.
5. Check permissions in the service. Never rely on the frontend hiding a button.
6. Add tests for the allowed case, the forbidden case and the validation errors.
7. Add seed data so the feature can be tested in every state.
