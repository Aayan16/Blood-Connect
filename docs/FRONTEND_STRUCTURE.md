# BloodConnect Frontend: Structure and Rules

Read this before adding any file. If something is not covered here, ask the team and update this file.

> **Stack (suggested, confirm before starting):** React + TypeScript, Vite, React Router, TanStack Query, React Hook Form + Zod, Tailwind CSS.
> `.ts` = logic, `.tsx` = files that contain JSX.

---

## 1. Folder tree

```text
frontend/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.ts
├── eslint.config.js
├── .env.example
├── public/
└── src/
    ├── main.tsx
    ├── App.tsx
    │
    ├── app/                         # app shell only
    │   ├── router.tsx               # combines the routes of every actor
    │   ├── guards/
    │   │   ├── RequireAuth.tsx
    │   │   ├── RequireHospital.tsx
    │   │   └── RequireDonorProfile.tsx
    │   └── providers/
    │       ├── AuthProvider.tsx
    │       ├── QueryProvider.tsx
    │       └── ToastProvider.tsx
    │
    ├── features/
    │   ├── requester/               # USER side: needs blood
    │   │   ├── pages/               # DashboardPage, CreateRequestPage, RequestDetailsPage, MyRequestsPage
    │   │   ├── components/
    │   │   ├── api/
    │   │   ├── hooks/
    │   │   ├── routes.tsx
    │   │   ├── types.ts
    │   │   └── index.ts
    │   │
    │   ├── donor/                   # USER side: donates blood
    │   │   ├── pages/               # IncomingRequestsPage, DonorProfilePage, DonorSetupPage, DonationsPage
    │   │   ├── components/
    │   │   ├── api/
    │   │   ├── hooks/
    │   │   ├── routes.tsx
    │   │   ├── types.ts
    │   │   └── index.ts
    │   │
    │   ├── hospital/                # HOSPITAL side
    │   │   ├── pages/               # OverviewPage, InventoryPage, BloodRequestsPage, BranchesPage, ReportsPage, HospitalProfilePage
    │   │   ├── components/
    │   │   ├── api/
    │   │   ├── hooks/
    │   │   ├── routes.tsx
    │   │   ├── types.ts
    │   │   └── index.ts
    │   │
    │   └── admin/                   # RESERVED. Do not create files until the admin side is designed.
    │
    ├── shared/                      # used by more than one actor
    │   ├── features/
    │   │   ├── landing/
    │   │   ├── auth/                # login, sign-up, Google
    │   │   ├── account/             # user Profile Settings
    │   │   ├── chat/                # chat tied to one request
    │   │   └── notifications/
    │   ├── components/              # Button, Modal, ConfirmDialog, Table, Tabs, Toggle, StatusChip,
    │   │                            # BloodGroupBadge, EmptyState, ErrorState, Spinner, Pagination
    │   ├── layouts/                 # UserLayout, HospitalLayout, Sidebar, TopBar
    │   ├── constants/               # statuses.ts, bloodGroups.ts, labels.ts, routes.ts
    │   ├── api/                     # httpClient.ts, apiError.ts, queryKeys.ts
    │   ├── hooks/                   # useAuth, useDebounce, usePagination
    │   ├── utils/                   # formatDate.ts, formatUnits.ts, validators.ts
    │   └── types/
    │
    ├── styles/                      # global CSS and theme tokens
    └── assets/                      # images, icons, fonts
```

---

## 2. What each folder is for

| Folder or file | Purpose |
|---|---|
| `app/` | Wires the app together. No screens, no business logic. |
| `app/router.tsx` | Only combines each actor's `routes.tsx` and applies layouts and guards. |
| `app/guards/` | Redirect users who may not open a page. This is convenience only. The backend enforces access. |
| `app/providers/` | Things every page needs: signed-in user, data fetching, toast messages. |
| `features/<actor>/pages/` | One file per screen. Arranges components. Holds no business rules. |
| `features/<actor>/components/` | Pieces used only by that actor's pages. |
| `features/<actor>/api/` | The only place that calls the backend for that actor. |
| `features/<actor>/hooks/` | Connect an API function to a screen with loading, error and refresh handling. |
| `features/<actor>/routes.tsx` | The routes of that actor. |
| `features/<actor>/types.ts` | Shapes of data that actor sends and receives. |
| `features/<actor>/index.ts` | The only exports other code may use from that actor. |
| `shared/features/` | Complete flows used by more than one actor (auth, account, chat, notifications). |
| `shared/components/` | Small generic UI with no BloodConnect logic. |
| `shared/layouts/` | Sidebar and top bar, built once per side. |
| `shared/constants/` | The single source for statuses, donor response states, blood groups (fixed order) and labels. |
| `shared/api/` | The shared HTTP client (adds the login token) and error handling. |
| `shared/utils/` | Helpers: date format, "1 unit" vs "2 units", validators. |

---

## 3. Import rules (enforced with ESLint)

| From | May import | Must not import |
|---|---|---|
| `features/requester` | `shared` | `features/donor`, `features/hospital` |
| `features/donor` | `shared` | `features/requester`, `features/hospital` |
| `features/hospital` | `shared` | `features/requester`, `features/donor` |
| `features/admin` | `shared` | any other actor |
| `shared` | `shared` | any actor folder |

- If two actors need the same code, move it to `shared`.
- `shared` never imports from an actor. If a shared component needs actor data (for example the sidebar badge count), pass it in as props or context.
- Import from an actor only through its `index.ts`.

---

## 4. Rules

1. **Only `api/` files talk to the backend.** Pages and components never call `fetch` directly.
2. **Statuses, blood groups and labels come only from `shared/constants`.** Never type "Donor Accepted" in a component. Blood groups always appear in the order O+, O-, A+, A-, B+, B-, AB+, AB-.
3. **Layouts are built once.** The user sidebar and hospital sidebar live in `shared/layouts` only. No page draws its own sidebar.
4. **Pages stay thin.** Business rules (status changes, matching, permissions) belong on the backend.
5. **Every list has an empty state** with the next action.
6. **Destructive or final actions need a confirmation dialog:** Confirm Blood Received, Cancel Request, Withdraw, set Branch Inactive, Delete Account.
7. **No demo scaffolding in code.** State switchers and "Preview" bars in the mockups are not built.
8. **Every UI element must map to a real feature.** No decorative statistics, urgency labels, tiers or clinical claims.
9. **Chat lives in `shared/features/chat`.** There is no inbox. A chat exists only for an accepted donor on a request.
10. **Hospital screens never show donor identities.** They show counts only.

---

## 5. Naming

- Components and pages: `PascalCase.tsx` (`CreateRequestPage.tsx`, `UnitsStepper.tsx`).
- Hooks: `useSomething.ts`.
- API files: `requests.api.ts`.
- Other files: lowercase or kebab-case (`validation.ts`, `format-date.ts`).
- Give components specific names that cannot collide: `ActiveRequestCard`, `IncomingRequestCard`, not `RequestCard`.
- Never use `*` or special characters in file names.

---

## 6. Open structure decisions (settle in the first week)

| # | Question | Default until decided |
|---|---|---|
| S1 | The Dashboard shows requester and donor content, but actors cannot import each other. | Put `DashboardPage` in `shared/features/dashboard`, or import only exported summary components from `donor/index.ts`. |
| S2 | Keep `requester` and `donor` as two folders, or merge into one `user` folder? | Keep two only if the work is split along those lines. |
| S3 | When does a `components/` folder get split by page? | When it passes about 15 files, create `components/<page-name>/`. |

---

## 7. Adding a feature

1. Decide which actor owns it. If more than one needs it, put it in `shared/features`.
2. Create the page in `pages/`, its components in `components/`, and its API calls in `api/`.
3. Export only what is needed from `index.ts` and register the route in `routes.tsx`.
4. Take statuses, labels and blood groups from `shared/constants`.
5. Add the empty, loading and error states before calling it done.
6. Run ESLint. Fix any import-rule violation before opening a pull request.
