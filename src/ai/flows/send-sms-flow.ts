'use server';
/**
 * @fileOverview A flow for sending SMS messages using Twilio.
 * 
 * - sendSms - A function that sends an SMS message to a given phone number.
 * - SmsInput - The input type for the sendSms function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import twilio from 'twilio';

export const SmsInputSchema = z.object({
  to: z.string().describe('The recipient\'s phone number in E.164 format.'),
  message: z.string().describe('The content of the SMS message.'),
});
export type SmsInput = z.infer<typeof SmsInputSchema>;

export async function sendSms(input: SmsInput): Promise<{ success: boolean; messageId?: string }> {
  return sendSmsFlow(input);
}

const sendSmsFlow = ai.defineFlow(
  {
    name: 'sendSmsFlow',
    inputSchema: SmsInputSchema,
    outputSchema: z.object({
      success: z.boolean(),
      messageId: z.string().optional(),
    }),
  },
  async (input) => {
    const { to, message } = input;

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_PHONE_NUMBER;

    if (!accountSid || !authToken || !fromNumber) {
      console.error('Twilio credentials are not configured in .env file.');
      throw new Error('SMS service is not configured. Missing Twilio credentials.');
    }

    const client = twilio(accountSid, authToken);

    try {
      const result = await client.messages.create({
        body: message,
        from: fromNumber,
        to: to,
      });
      console.log('SMS sent successfully. SID:', result.sid);
      return { success: true, messageId: result.sid };
    } catch (error) {
      console.error('Failed to send SMS:', error);
      throw new Error('Failed to send SMS.');
    }
  }
);
