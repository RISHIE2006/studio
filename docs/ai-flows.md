# HighwayHealers — AI Flows Reference

This document provides detailed technical documentation for all **Google Genkit AI flows** used in HighwayHealers.

---

## Overview

All flows are located in `src/ai/flows/` and are invoked as **Next.js Server Actions**. They use the shared Genkit AI instance configured in `src/ai/genkit.ts`.

```ts
// src/ai/genkit.ts
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.0-flash',
});
```

---

## Flow 1: Automated First-Aid Instructions

**File:** `src/ai/flows/automated-first-aid-instructions.ts`

### Purpose
Generates immediate, step-by-step first-aid guidance based on a plain-text description of an emergency situation. Designed for highway accidents where professional medical help may be minutes away.

### Input Schema

| Field | Type | Validation | Description |
|---|---|---|---|
| `situationDescription` | `string` | min 10 chars | User's description of the emergency |

### Output Schema

| Field | Type | Description |
|---|---|---|
| `firstAidInstructions` | `string` | Numbered, step-by-step first-aid guidance |

### Usage

```ts
import { getFirstAidInstructions } from '@/ai/flows/automated-first-aid-instructions';

const result = await getFirstAidInstructions({
  situationDescription: 'A person has a deep cut on their arm and is bleeding heavily.'
});

console.log(result.firstAidInstructions);
// "1. Apply direct pressure to the wound with a clean cloth or bandage.
//  2. Elevate the injured arm above heart level if possible.
//  ..."
```

### Safety Configuration
This flow overrides the default Gemini safety settings:

```ts
safetySettings: [
  {
    category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
    threshold: 'BLOCK_NONE', // Allow medical/first-aid content
  },
],
```

> **Rationale:** The default `BLOCK_MOST` threshold for dangerous content would incorrectly block life-saving medical instructions (e.g., how to stop bleeding, CPR steps). The UI always displays a disclaimer that these instructions do not replace professional medical advice.

---

## Flow 2: Resource Allocation Prediction

**File:** `src/ai/flows/resource-allocation-prediction.ts`

### Purpose
Predicts the optimal allocation of emergency resources (ambulances, drones, doctors) for a given emergency scenario. Designed for NHAI (National Highways Authority of India) operators managing highway incidents.

### Input Schema

| Field | Type | Validation | Description |
|---|---|---|---|
| `scenarioDescription` | `string` | min 20 chars | Description of the emergency scenario |
| `availableAmbulances` | `number` | >= 0 | Number of ambulances currently available |
| `availableDrones` | `number` | >= 0 | Number of drones currently available |
| `availableDoctors` | `number` | >= 0 | Number of doctors currently available |

### Output Schema

| Field | Type | Description |
|---|---|---|
| `predictedAmbulanceNeed` | `number` | Recommended number of ambulances to dispatch |
| `predictedDroneNeed` | `number` | Recommended number of drones to dispatch |
| `predictedDoctorNeed` | `number` | Recommended number of doctors to deploy |
| `justification` | `string` | AI explanation of the prediction rationale |

### Usage

```ts
import { predictResourceAllocation } from '@/ai/flows/resource-allocation-prediction';

const result = await predictResourceAllocation({
  scenarioDescription: 'Multi-car pile-up on NH48 near KM 287. Heavy rain. Reports of 6 injured.',
  availableAmbulances: 5,
  availableDrones: 10,
  availableDoctors: 8,
});

console.log(result);
// {
//   predictedAmbulanceNeed: 4,
//   predictedDroneNeed: 3,
//   predictedDoctorNeed: 6,
//   justification: "With 6 reported injuries in a multi-car incident..."
// }
```

---

## Flow 3: Send SMS

**File:** `src/ai/flows/send-sms-flow.ts`

### Purpose
Sends an SMS notification to an emergency contact via the **Twilio API**. Called automatically during the SOS activation flow when a user provides a contact number.

### Input Schema (`SmsInput`)

| Field | Type | Description |
|---|---|---|
| `to` | `string` | Recipient phone number in E.164 format (e.g., `+919876543210`) |
| `message` | `string` | SMS body text (includes Google Maps link with GPS coordinates) |

### Output Schema

| Field | Type | Description |
|---|---|---|
| `success` | `boolean` | Whether the SMS was sent successfully |
| `sid` | `string?` | Twilio Message SID (present on success) |

### Usage

```ts
import { sendSms } from '@/ai/flows/send-sms-flow';

const result = await sendSms({
  to: '+919876543210',
  message: 'Emergency SOS from HighwayHealers. Location: https://www.google.com/maps?q=28.6139,77.2090',
});

if (result.success) {
  console.log('SMS sent! SID:', result.sid);
}
```

### Required Environment Variables

```env
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1234567890
```

---

## Genkit Developer UI

To inspect, test, and trace all flows interactively:

```bash
npm run genkit:dev
```

Open **http://localhost:4000** to:
- Manually invoke any flow with custom inputs
- View real-time execution traces
- Inspect LLM prompts and responses
- Monitor token usage and latency
