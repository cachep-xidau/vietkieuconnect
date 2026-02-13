# System Architecture

VietKieu Connect follows a modern web architecture with clear separation of concerns.

## Tech Stack

- **Frontend**: Next.js 16 (App Router), TypeScript, Tailwind CSS v4
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **UI Library**: shadcn/ui (Radix UI + Tailwind)
- **i18n**: next-intl (English + Vietnamese)

## Directory Structure

```
src/
├── app/[locale]/           # Route groups by functionality
│   ├── (public)/          # Public pages (home, clinics)
│   ├── (auth)/            # Protected pages (dashboard, profile)
│   └── admin/             # Admin routes
├── components/
│   ├── ui/               # shadcn/ui base components
│   ├── layout/           # Header, Footer, UserMenu
│   ├── clinic/           # Clinic-related components
│   ├── booking/          # Booking components
│   └── admin/            # Admin components
├── lib/
│   ├── actions/          # Server actions
│   ├── validators/       # Zod schemas
│   ├── auth/            # Auth helpers
│   └── utils/           # Shared utilities
├── hooks/               # Custom React hooks
├── types/               # TypeScript types
└── middleware.ts         # Auth + i18n middleware
```

## Data Flow

### Authentication Flow

1. User signs up/logs in via Supabase Auth
2. Middleware validates session on protected routes
3. Client components use `supabase/auth.onAuthStateChange()`
4. Server components use `createServerClient()` to get user
5. RLS policies enforce data access

### Profile Page Flow

```
Profile Page (Server Component)
    ├─> createServerClient()
    ├─> supabase.auth.getUser()
    ├─> Redirect if !user
    ├─> Fetch from profiles table
    └─> Display user data
```

### User Menu Flow

```
Header Component (Client)
    ├─> useEffect: getInitialUser()
    ├─> onAuthStateChange subscription
    ├─> Show UserMenu if user exists
    └─> Show Sign In button if !user

UserMenu Component
    ├─> Avatar with initials
    ├─> Dropdown menu
    ├─> Profile link -> /profile
    └─> Sign Out -> signOut() -> push("/")
```

## Component Architecture

### Layout Components

| Component | Type | Purpose |
|-----------|------|---------|
| `Header` | Client | Navigation, auth state, mobile menu |
| `Footer` | Server | Footer links, static content |
| `UserMenu` | Client | User dropdown, logout |
| `LanguageToggle` | Client | i18n language switcher |

### Auth Patterns

**Client-side auth detection:**
```typescript
const [user, setUser] = useState<User | null>(null);

useEffect(() => {
  const supabase = createClient();
  supabase.auth.getUser().then(({ data: { user } }) => {
    setUser(user);
  });
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (_event, session) => setUser(session?.user ?? null)
  );
  return () => subscription.unsubscribe();
}, []);
```

**Server-side auth protection:**
```typescript
const supabase = await createClient();
const { data: { user } } = await supabase.auth.getUser();
if (!user) redirect("/login");
```

## Utility Functions

### User Utilities (`lib/utils/user.ts`)

```typescript
getInitials(name: string | undefined): string
// Returns initials from full name (e.g., "John Doe" -> "JD")
```

## Database Schema

8 main tables with RLS policies:
- `profiles` - User profiles with roles
- `clinics` - Dental clinic information
- `consultations` - Consultation requests
- `consultation_images` - X-ray uploads
- `treatment_plans` - Admin quotes
- `bookings` - Confirmed bookings
- `reviews` - User reviews
- `flagged_reviews` - Moderation data

## Security

- Row Level Security on all tables
- Server-side validation (Zod)
- Auth middleware for protected routes
- SQL injection prevention (Supabase client)
