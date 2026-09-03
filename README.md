# CEDO CRM

Enterprise B2B Customer Relationship Management (CRM) platform engineered with **Next.js (App Router)**, **Supabase (PostgreSQL & Auth)**, and **Tailwind CSS**.

---

## Key Features

- **Executive Analytics Dashboard:** Real-time KPI summaries for closed revenue, pipeline valuation, win rates, stage distribution, and recent sales activities.
- **Lead Management:** Inbound/outbound lead tracking with AI-scoring indicators (0-100), estimated deal value, and source attribution.
- **Deal Pipeline (Kanban):** Visual drag/stage progression across *Discovery*, *Proposal*, *Negotiation*, *Closed Won*, and *Closed Lost* with stage volume metrics.
- **Contacts Directory:** Centralized stakeholder address book with direct email/phone actions, role tags, and primary buyer indicators.
- **Accounts & Companies:** Corporate accounts categorized by tier (*Enterprise*, *Mid-Market*, *SMB*, *Startup*), revenue, and associated opportunities.
- **Tasks & Action Items:** Follow-up management with priority levels (*Urgent*, *High*, *Medium*, *Low*), completion toggles, and deal associations.
- **Zero-Config Interactive Demo Mode:** Runs immediately out of the box with a rich B2B dataset if Supabase credentials are not yet configured.

---

## Technology Stack

- **Framework:** [Next.js 16 (App Router)](https://nextjs.org)
- **Frontend & UI:** React 19, [Tailwind CSS](https://tailwindcss.com), Lucide Icons, Class Variance Authority
- **Database & Auth:** [Supabase](https://supabase.com) (PostgreSQL with Row Level Security, Supabase SSR Auth)
- **Validation & State:** TypeScript 5, Zod, Date-fns

---

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Local Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to access the CEDO CRM dashboard. The application will immediately load in **Interactive Demo Mode**.

---

## Supabase Setup (Phase 4 Database Activation)

To connect your own live Supabase PostgreSQL database:

1. Create a project at [supabase.com](https://supabase.com).
2. Go to **Project Settings &rarr; API** and retrieve your `Project URL` and `anon public` API key.
3. Configure your local `.env.local` file:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-optional
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Go to **Supabase Dashboard &rarr; SQL Editor**, open [`supabase/schema.sql`](./supabase/schema.sql), and run the script. This will create:
   - `profiles` (linked to `auth.users` with automated sign-up trigger)
   - `companies`
   - `contacts`
   - `leads`
   - `deals`
   - `tasks`
   - `activities`
   - Row Level Security (RLS) policies for secure multi-seat CRM access.

---

## Project Structure

```text
CEDO_CRM/
├── supabase/
│   └── schema.sql                  # PostgreSQL schema, RLS policies, triggers
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx      # Sign in with Supabase Auth & Demo shortcut
│   │   │   ├── signup/page.tsx     # Organization registration
│   │   │   └── auth/callback/      # OAuth / email verification route handler
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx          # Dashboard shell with persistent sidebar & header
│   │   │   ├── page.tsx            # Executive Overview & Pipeline Analytics
│   │   │   ├── leads/page.tsx      # Inbound/outbound leads list & creation modal
│   │   │   ├── deals/page.tsx      # Interactive Kanban pipeline
│   │   │   ├── contacts/page.tsx   # Stakeholder directory
│   │   │   ├── companies/page.tsx  # Enterprise accounts & customer tiers
│   │   │   ├── tasks/page.tsx      # Action items & deliverables manager
│   │   │   └── settings/page.tsx   # Supabase connection diagnostic & team settings
│   │   ├── api/                    # Route Handlers
│   │   │   ├── leads/route.ts
│   │   │   ├── deals/route.ts
│   │   │   ├── contacts/route.ts
│   │   │   ├── companies/route.ts
│   │   │   └── tasks/route.ts
│   │   ├── globals.css             # Tailwind CSS tokens
│   │   └── layout.tsx              # Root HTML layout
│   ├── components/
│   │   ├── layout/
│   │   │   ├── sidebar.tsx         # Navigation sidebar
│   │   │   ├── header.tsx          # Top bar with quick actions and search
│   │   │   └── dashboard-shell.tsx # Shell container with demo status banner
│   │   └── ui/                     # Reusable design system primitives
│   │       ├── badge.tsx
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       └── table.tsx
│   ├── lib/
│   │   ├── data-service.ts         # Resilient data layer (Supabase + Demo fallback)
│   │   ├── mock-data.ts            # Enterprise mock dataset
│   │   ├── utils.ts                # Formatting and class merging helpers
│   │   └── supabase/               # Supabase SSR client, server, and middleware
│   │       ├── client.ts
│   │       ├── server.ts
│   │       └── middleware.ts
│   ├── middleware.ts               # Next.js auth session refresh middleware
│   └── types/
│       └── crm.ts                  # TypeScript CRM domain models
├── .env.local.example              # Environment variables template
├── package.json
└── tsconfig.json
```

---

## API Endpoints

All endpoints support `GET` and `POST`:

| Endpoint | Description |
| :--- | :--- |
| `GET /api/leads` | Retrieve all leads |
| `POST /api/leads` | Create a new lead |
| `GET /api/deals` | Retrieve deals with stage & organization relationships |
| `POST /api/deals` | Create a new deal opportunity |
| `GET /api/contacts` | Retrieve stakeholder contacts |
| `POST /api/contacts` | Add a new contact |
| `GET /api/companies` | List corporate accounts |
| `POST /api/companies` | Add an account |
| `GET /api/tasks` | Retrieve action items ordered by due date |
| `POST /api/tasks` | Create a new task |

---

## Deployment (Phase 6)

1. Push code to GitHub.
2. Import project in [Vercel](https://vercel.com).
3. Add environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
4. Deploy with one click.
