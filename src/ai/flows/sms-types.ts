import { z } from 'zod';

export const SmsInputSchema = z.object({
  to: z.string().describe("The recipient's phone number in E.164 format."),
  message: z.string().describe('The content of the SMS message.'),
});

export type SmsInput = z.infer<typeof SmsInputSchema>;
