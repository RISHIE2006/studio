'use server';

/**
 * @fileOverview AI-powered resource allocation prediction for emergency response.
 *
 * - predictResourceAllocation - Predicts resource needs (ambulance, drone, doctors) based on scenario.
 * - ResourceAllocationInput - The input type for the prediction, including scenario details.
 * - ResourceAllocationOutput - The return type, specifying predicted resource needs.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ResourceAllocationInputSchema = z.object({
  scenarioDescription: z
    .string()
    .describe(
      'Detailed description of the scenario, including location, time, and nature of the emergency (e.g., traffic accident, natural disaster).'      
    ),
  availableAmbulances: z.number().describe('Number of ambulances currently available.'),
  availableDrones: z.number().describe('Number of drones currently available for delivery.'),
  availableDoctors: z.number().describe('Number of doctors available for telemedicine.'),
});
export type ResourceAllocationInput = z.infer<typeof ResourceAllocationInputSchema>;

const ResourceAllocationOutputSchema = z.object({
  predictedAmbulanceNeed: z
    .number()
    .describe('The predicted number of ambulances required.'),
  predictedDroneNeed: z
    .number()
    .describe('The predicted number of drones required for medicine/supply delivery.'),
  predictedDoctorNeed: z
    .number()
    .describe('The predicted number of doctors required for telemedicine support.'),
  justification: z
    .string()
    .describe(
      'A brief justification for the predicted resource allocation, explaining the reasoning behind the numbers.'
    ),
});
export type ResourceAllocationOutput = z.infer<typeof ResourceAllocationOutputSchema>;

export async function predictResourceAllocation(
  input: ResourceAllocationInput
): Promise<ResourceAllocationOutput> {
  return predictResourceAllocationFlow(input);
}

const resourceAllocationPrompt = ai.definePrompt({
  name: 'resourceAllocationPrompt',
  input: {schema: ResourceAllocationInputSchema},
  output: {schema: ResourceAllocationOutputSchema},
  prompt: `Based on the following emergency scenario, predict the required number of ambulances, drones, and doctors. Provide a justification for your prediction.

Scenario Description: {{{scenarioDescription}}}
Available Ambulances: {{{availableAmbulances}}}
Available Drones: {{{availableDrones}}}
Available Doctors: {{{availableDoctors}}}

Consider the severity of the scenario, the number of potential victims, and the accessibility of the location.

Ensure that the predicted resource needs are realistic and justifiable based on the provided information.
`,
});

const predictResourceAllocationFlow = ai.defineFlow(
  {
    name: 'predictResourceAllocationFlow',
    inputSchema: ResourceAllocationInputSchema,
    outputSchema: ResourceAllocationOutputSchema,
  },
  async input => {
    const {output} = await resourceAllocationPrompt(input);
    return output!;
  }
);
