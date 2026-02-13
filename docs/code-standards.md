# Code Standards

## File Naming

- Use kebab-case for files: `user-menu.tsx`, `header.tsx`
- Names should describe purpose, not implementation
- No abbreviations (unless widely known)

## Code Style

### TypeScript

- Strict mode enabled
- Explicit types for function parameters
- Use `interface` for object shapes, `type` for unions/primitives
- Avoid `any`, use `unknown` when type is truly unknown

### React Components

- Use function components with hooks
- Prefer Server Components over Client Components
- Only use `"use client"` when necessary (interactivity, browser APIs)
- Destructure props in function signature

### Supabase Usage

**Client-side:**
```typescript
import { createClient } from "@/lib/supabase/client";
const supabase = createClient();
```

**Server-side:**
```typescript
import { createClient } from "@/lib/supabase/server";
const supabase = await createClient();
```

### Auth Patterns

**Get current user (server):**
```typescript
const { data: { user } } = await supabase.auth.getUser();
if (!user) redirect("/login");
```

**Listen to auth changes (client):**
```typescript
useEffect(() => {
  const supabase = createClient();
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (_event, session) => setUser(session?.user ?? null)
  );
  return () => subscription.unsubscribe();
}, []);
```

### Utility Functions

Place shared utilities in `src/lib/utils/`:
- `user.ts` - User-related utilities (getInitials)
- `rating-calculator.ts` - Rating calculations
- `cn.ts` - Tailwind className merger

### Component Organization

```
components/
├── ui/                 # shadcn/ui components (don't modify directly)
├── layout/            # Layout components (Header, Footer)
├── clinic/            # Feature-specific components
└── booking/           # Feature-specific components
```

## Best Practices

### DRY (Don't Repeat Yourself)

Extract common logic to utilities:
- Duplicate `getInitials` -> Extract to `lib/utils/user.ts`
- Reusable validation -> Zod schemas in `lib/validators/`

### Error Handling

```typescript
try {
  await supabase.auth.signOut();
} catch (error) {
  console.error("Operation failed:", error);
  // Show user-facing error message
}
```

### Accessibility

- Use `aria-label` for icon-only buttons
- Use `aria-expanded` for toggles
- Provide alt text for images
- Use semantic HTML elements

### Performance

- Use Server Components by default
- Only opt into Client Components when necessary
- Use `Image` component from next/image
- Lazy load heavy components

## File Size Limits

- Keep files under 200 lines for maintainability
- Split large components into smaller sub-components
- Extract large functions to separate files

## Import Order

1. React/Next.js imports
2. Third-party libraries
3. Internal imports (use @/ alias)
4. Relative imports

```typescript
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
```
