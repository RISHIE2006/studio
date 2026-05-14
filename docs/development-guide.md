# HighwayHealers — Setup & Development Guide

## Prerequisites

| Tool | Minimum Version | Purpose |
|---|---|---|
| Node.js | 18.x | JavaScript runtime |
| npm | 9.x | Package manager |
| Git | Any | Version control |

---

## 1. Clone & Install

```bash
# Clone the repository
git clone https://github.com/RISHIE2006/studio.git
cd studio

# Install all dependencies
npm install
```

---

## 2. Environment Configuration

Create a `.env.local` file in the root directory:

```env
# ── Google AI (Gemini) ──────────────────────────────────
# Required for all AI flows (first-aid, resource allocation)
# Get your key at: https://aistudio.google.com/app/apikey
GOOGLE_GENAI_API_KEY=AIza...

# ── Twilio ──────────────────────────────────────────────
# Required for the SOS SMS notification feature
# Get credentials at: https://console.twilio.com
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# ── Google Maps ─────────────────────────────────────────
# Required for the live map component on /medicine
# Enable "Maps JavaScript API" in Google Cloud Console
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIza...
```

> ⚠️ `.env.local` is already in `.gitignore`. Never commit API keys.

---

## 3. Running Locally

### Start the web app

```bash
npm run dev
```

- Opens at **http://localhost:3000**
- Uses **Turbopack** for fast hot-module replacement

### Start the Genkit AI developer UI (optional)

In a separate terminal window:

```bash
npm run genkit:dev
```

- Opens Genkit Dev UI at **http://localhost:4000**
- Allows you to inspect, test, and trace individual AI flows
- Use `npm run genkit:watch` for hot-reload of flow changes

---

## 4. Type Checking & Linting

```bash
# TypeScript type check (no emit)
npm run typecheck

# ESLint
npm run lint
```

Run both before committing:

```bash
npm run typecheck && npm run lint
```

---

## 5. Building for Production

```bash
npm run build
npm run start
```

---

## 6. Project Conventions

### File Naming
- **Pages:** `src/app/<route>/page.tsx`
- **Components:** `src/components/<component-name>.tsx` (kebab-case)
- **AI Flows:** `src/ai/flows/<flow-name>.ts` (kebab-case)

### Component Structure
All components use named exports:
```tsx
// ✅ Correct
export function MyComponent() { ... }

// ❌ Avoid default exports for components
export default function MyComponent() { ... }
```

### Server Actions
All Genkit flow wrappers must start with `'use server'`:
```ts
'use server';

export async function myFlow(input: MyInput): Promise<MyOutput> {
  return myGenkitFlow(input);
}
```

### Styling
- Use **Tailwind utility classes** from the pre-configured design tokens
- Use `cn()` from `@/lib/utils` for conditional class merging
- Avoid inline styles unless absolutely necessary

---

## 7. Adding a New AI Flow

1. Create a new file in `src/ai/flows/`:

```ts
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const MyInputSchema = z.object({ ... });
const MyOutputSchema = z.object({ ... });

export type MyInput = z.infer<typeof MyInputSchema>;
export type MyOutput = z.infer<typeof MyOutputSchema>;

export async function myFlow(input: MyInput): Promise<MyOutput> {
  return myGenkitFlow(input);
}

const myGenkitFlow = ai.defineFlow(
  { name: 'myFlow', inputSchema: MyInputSchema, outputSchema: MyOutputSchema },
  async (input) => {
    const { output } = await ai.generate({
      prompt: `Your prompt here: ${input.yourField}`,
      output: { schema: MyOutputSchema },
    });
    return output!;
  }
);
```

2. Import and call it from a `'use client'` component.
3. Test it in the Genkit Dev UI at `http://localhost:4000`.

---

## 8. Adding a New Page

1. Create `src/app/<route>/page.tsx`
2. Add the route to the `navLinks` array in `src/components/header.tsx`
3. Export a default function for the page

---

## 9. Troubleshooting

| Problem | Solution |
|---|---|
| `GOOGLE_GENAI_API_KEY not set` | Ensure `.env.local` exists with a valid key |
| Twilio SMS not sending | Verify `TWILIO_*` variables and that the number is verified in Twilio trial |
| Map not loading | Check `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` and enable Maps JavaScript API |
| Genkit flows not found | Run `npm run genkit:dev` and check `src/ai/dev.ts` imports your flow |
| Type errors after adding packages | Run `npm run typecheck` to see full error context |
