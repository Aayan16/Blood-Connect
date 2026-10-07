# BloodConnect

BloodConnect is an emergency blood matching and inventory management platform connecting hospitals, donors, and patients in real time.

---

## 🛠️ Tech Stack

- **Frontend:** React 19 + TypeScript + Vite + Tailwind CSS v4 + shadcn/ui
- **State & Data Fetching:** TanStack React Query + Axios
- **Form Handling & Validation:** React Hook Form + Zod
- **Routing:** React Router v7
- **Notifications:** Sonner Toast Provider
- **Linting & Code Formatting:** ESLint with strict import boundary rules

---

## 📁 Frontend Architecture & Folder Structure

```text
frontend/src/
├── app/                         # App shell (providers, router, guards)
│   ├── router.tsx               # Central route aggregator
│   ├── guards/                  # RequireAuth, RequireHospital, RequireDonorProfile
│   └── providers/               # AuthProvider, QueryProvider, ToastProvider
│
├── features/                    # Flat-per-actor feature modules
│   ├── requester/               # Patient / Emergency Blood Requester Domain
│   ├── donor/                   # Blood Donor Domain
│   ├── hospital/                # Hospital / Blood Bank Admin Domain
│   └── admin/                   # Platform Administration (Reserved)
│
└── shared/                      # Cross-actor utilities & shared domain code
    ├── api/                     # httpClient, apiError, queryKeys
    ├── components/ui/           # shadcn/ui components (Button, Card, Input, etc.)
    ├── constants/               # statuses, donorResponse, bloodGroups, labels, routes
    ├── features/                # landing, auth, account, chat, notifications
    ├── hooks/                   # Custom reusable hooks
    ├── layouts/                 # UserLayout, HospitalLayout, Sidebar, TopBar
    ├── types/                   # Common shared TypeScript types
    └── utils/                   # Helper functions
```

---

## 🔒 Import Boundary Rules (Enforced by ESLint)

To maintain strict domain isolation:
- `features/requester` cannot import from `features/donor` or `features/hospital`.
- `features/donor` cannot import from `features/requester` or `features/hospital`.
- `features/hospital` cannot import from `features/requester` or `features/donor`.
- `shared/` must **never** import from any `features/*` directory.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Environment Setup
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Code Quality & Build Scripts
```bash
npm run lint      # Runs ESLint with import boundary rules
npx tsc --noEmit  # Type checking
npm run build     # Production Vite build
```
