'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getFirstAidInstructions } from '@/ai/flows/automated-first-aid-instructions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Bot, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const FormSchema = z.object({
  situationDescription: z.string().min(10, {
    message: 'Please describe the situation in at least 10 characters.',
  }),
});

export function AssistanceBot() {
  const [instructions, setInstructions] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      situationDescription: '',
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    setInstructions(null);
    try {
      const result = await getFirstAidInstructions(data);
      setInstructions(result.firstAidInstructions);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error getting instructions',
        description: 'There was an issue with the AI assistant. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot />
            Describe the Emergency
          </CardTitle>
           <CardDescription>
            The more detail you provide, the better the guidance.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="situationDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Situation Details</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., 'A person has a deep cut on their arm and is bleeding heavily.' or 'Someone is choking and can't breathe.'"
                        rows={5}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                Get First-Aid Instructions
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>First-Aid Instructions</CardTitle>
           <CardDescription>
            Follow these steps carefully while waiting for help.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          {!isLoading && instructions && (
             <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap rounded-md bg-muted p-4">
                {instructions}
            </div>
          )}
          {!isLoading && !instructions && (
            <div className="flex justify-center items-center h-40 text-muted-foreground">
              <p>Instructions will appear here.</p>
            </div>
          )}
           <Alert variant="destructive" className="mt-4">
              <AlertTitle>This is not a substitute for professional medical advice.</AlertTitle>
              <AlertDescription>
                Always call emergency services in a real emergency. These instructions are for guidance only.
              </AlertDescription>
            </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
