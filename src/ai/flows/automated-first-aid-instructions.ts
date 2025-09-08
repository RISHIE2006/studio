'use server';
/**
 * @fileOverview Provides immediate, automated first-aid instructions based on the user's reported situation.
 *
 * - getFirstAidInstructions - A function that generates first-aid instructions based on the user's description of the emergency.
 * - FirstAidInput - The input type for the getFirstAidInstructions function.
 * - FirstAidOutput - The return type for the getFirstAidInstructions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FirstAidInputSchema = z.object({
  situationDescription: z
    .string()
    .describe('A detailed description of the emergency situation.'),
});
export type FirstAidInput = z.infer<typeof FirstAidInputSchema>;

const FirstAidOutputSchema = z.object({
  firstAidInstructions: z
    .string()
    .describe('Step-by-step first-aid instructions for the reported situation.'),
});
export type FirstAidOutput = z.infer<typeof FirstAidOutputSchema>;

export async function getFirstAidInstructions(
  input: FirstAidInput
): Promise<FirstAidOutput> {
  return firstAidInstructionsFlow(input);
}

const firstAidPrompt = ai.definePrompt({
  name: 'firstAidPrompt',
  input: {schema: FirstAidInputSchema},
  output: {schema: FirstAidOutputSchema},
  prompt: `You are an AI assistant providing immediate first-aid instructions.

  Based on the user's description of the emergency situation, provide clear, concise, and step-by-step first-aid instructions.

  Situation Description: {{{situationDescription}}}
  `, safetySettings: [
    {
      category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
      threshold: 'BLOCK_NONE',
    },
  ],
});

const firstAidInstructionsFlow = ai.defineFlow(
  {
    name: 'firstAidInstructionsFlow',
    inputSchema: FirstAidInputSchema,
    outputSchema: FirstAidOutputSchema,
  },
  async input => {
    const {output} = await firstAidPrompt(input);
    return output!;
  }
);
