# HighwayHealers — Technical Architecture

## Overview

HighwayHealers is built as a **server-rendered Next.js 15 application** using the App Router. The architecture separates concerns across three layers:

1. **Frontend (React / Next.js)** — UI, state management, user interaction
2. **AI Layer (Google Genkit)** — LLM flows called as Next.js Server Actions
3. **External Services** — Twilio (SMS), Google Maps, Firebase (hosting)

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                     Browser (Client)                    │
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌────────────────────┐    │
│  │  SOS     │  │ First-Aid│  │  Medicine Locator   │    │
│  │  Button  │  │  Bot     │  │  / Dashboard        │    │
│  └────┬─────┘  └────┬─────┘  └────────┬───────────┘    │
└───────┼─────────────┼─────────────────┼────────────────┘
        │             │                 │
        │    Next.js Server Actions (src/ai/flows/)
        │             │                 │
┌───────▼─────────────▼─────────────────▼────────────────┐
│                  Next.js App Server                     │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │              Google Genkit Runtime                │  │
│  │                                                   │  │
│  │  ┌─────────────────┐  ┌────────────────────────┐ │  │
│  │  │  First-Aid Flow  │  │ Resource Allocation    │ │  │
│  │  │  (Gemini LLM)   │  │ Prediction Flow        │ │  │
│  │  └─────────────────┘  └────────────────────────┘ │  │
│  │                                                   │  │
│  │  ┌─────────────────┐                             │  │
│  │  │  SMS Send Flow  │                             │  │
│  │  │  (Twilio API)   │                             │  │
│  │  └─────────────────┘                             │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
        │             │                 │
        ▼             ▼                 ▼
   Google AI      Twilio API      Google Maps API
   (Gemini)       (SMS)           (Geolocation)
```

---

## Data Flow: SOS Emergency Activation

```
User taps SOS Button
        │
        ▼
EmergencyModal opens (step: "contact")
        │
        ├─ User enters emergency contact number (optional)
        │
        ▼
handleContactSubmit() called
        │
        ├─ Validates Indian phone number format (+91XXXXXXXXXX)
        │
        ▼
step → "location"
        │
        ▼
navigator.geolocation.getCurrentPosition()
        │
        ├─ SUCCESS → stores {lat, lon} in state
        │            → step → "tracking" after 1s
        │
        └─ FAILURE → shows error toast + alert
                   │
                   ▼
(If contact provided) sendSms() Server Action called
        │
        ├─ Genkit "sendSmsFlow" invokes Twilio REST API
        │
        └─ Returns { success, sid } → shows toast notification
```

---

## Data Flow: AI First-Aid Instructions

```
User describes emergency in <AssistanceBot> textarea
        │
        ▼
Form validated with Zod (min 10 chars)
        │
        ▼
getFirstAidInstructions() Server Action called
        │
        ▼
Genkit "firstAidInstructionsFlow" runs
        │
        ├─ Passes situationDescription to Gemini LLM
        │  (with BLOCK_NONE safety for medical content)
        │
        ▼
Structured output: { firstAidInstructions: string }
        │
        ▼
Rendered in prose format with medical disclaimer
```

---

## Data Flow: Resource Allocation Prediction

```
NHAI operator fills in:
  - Emergency scenario description (min 20 chars)
  - Available: ambulances, drones, doctors
        │
        ▼
predictResourceAllocation() Server Action called
        │
        ▼
Genkit "resourceAllocationPredictionFlow" runs
        │
        ├─ Gemini analyses scenario vs available resources
        │
        ▼
Structured output:
  {
    predictedAmbulanceNeed: number,
    predictedDroneNeed: number,
    predictedDoctorNeed: number,
    justification: string
  }
        │
        ▼
Displayed in metric cards with justification text
```

---

## Component Hierarchy

```
RootLayout (layout.tsx)
├── Header
│   ├── Logo
│   └── NavLinks → [/first-aid, /medicine, /dashboard, /login, /signup]
├── main
│   ├── / (page.tsx)
│   │   ├── Hero Section (motion.div)
│   │   ├── SosButton → opens EmergencyModal
│   │   ├── Feature Cards (3-column grid)
│   │   └── EmergencyModal
│   │       ├── Step: "contact" → Phone Input
│   │       ├── Step: "location" → GPS acquisition UI
│   │       └── Step: "tracking" → ETA cards (Ambulance + Drone)
│   ├── /first-aid
│   │   └── AssistanceBot
│   │       ├── Emergency Description Form
│   │       └── Instructions Output Panel
│   ├── /medicine
│   │   ├── MedicineFinder
│   │   └── Map
│   ├── /dashboard
│   │   └── ResourceAllocator
│   │       ├── Scenario Input Form
│   │       └── AI Prediction Output
│   ├── /login
│   └── /signup
└── Toaster (global toast notifications)
```

---

## Key Design Decisions

### Server Actions for AI Calls
All Genkit flows are invoked as **Next.js Server Actions** (`'use server'` directive). This keeps API keys server-side and avoids exposing them to the browser, while giving React components a direct async function interface.

### Zod for End-to-End Type Safety
Zod schemas are defined in each Genkit flow and also re-used in React Hook Form resolvers on the client, providing a single source of truth for data shapes across the full stack.

### Framer Motion for Perceived Performance
Staggered fade-in animations and `AnimatePresence` transitions in the SOS modal steps create a smooth user experience that feels responsive even during async operations (GPS acquisition, LLM calls).

### shadcn/ui + Radix UI
All interactive UI primitives (Dialog, Card, Form, Toast, etc.) are built on Radix UI for accessibility compliance, then styled with Tailwind CSS tokens for the HighwayHealers design system.
