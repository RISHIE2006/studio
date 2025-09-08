'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  predictResourceAllocation,
  type ResourceAllocationOutput,
} from '@/ai/flows/resource-allocation-prediction';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Bot, Loader2, Ambulance, User, Microscope } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const FormSchema = z.object({
  scenarioDescription: z
    .string()
    .min(20, 'Please provide a more detailed description.'),
  availableAmbulances: z.coerce.number().min(0),
  availableDrones: z.coerce.number().min(0),
  availableDoctors: z.coerce.number().min(0),
});

export function ResourceAllocator() {
  const [prediction, setPrediction] = useState<ResourceAllocationOutput | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      scenarioDescription: '',
      availableAmbulances: 5,
      availableDrones: 10,
      availableDoctors: 8,
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    setPrediction(null);
    try {
      const result = await predictResourceAllocation(data);
      setPrediction(result);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Prediction Failed',
        description:
          'Could not get a resource prediction. Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Dynamic Resource Allocation</CardTitle>
          <CardDescription>
            Use AI to predict resource needs for a given scenario.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="scenarioDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Emergency Scenario</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Multi-car pile-up on highway KM 123 during heavy rain, reports of multiple injuries."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="availableAmbulances"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ambulances</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="availableDrones"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Drones</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="availableDoctors"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Doctors</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Bot className="mr-2 h-4 w-4" />
                )}
                Predict Resources
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>AI Prediction</CardTitle>
          <CardDescription>
            Recommended resource allocation based on the scenario.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          {isLoading && (
            <div className="flex h-full items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          {!isLoading && prediction && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <Card>
                  <CardHeader>
                    <Ambulance className="mx-auto h-8 w-8 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">
                      {prediction.predictedAmbulanceNeed}
                    </p>
                    <p className="text-sm text-muted-foreground">Ambulances</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <Microscope className="mx-auto h-8 w-8 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">
                      {prediction.predictedDroneNeed}
                    </p>
                    <p className="text-sm text-muted-foreground">Drones</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <User className="mx-auto h-8 w-8 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">
                      {prediction.predictedDoctorNeed}
                    </p>
                    <p className="text-sm text-muted-foreground">Doctors</p>
                  </CardContent>
                </Card>
              </div>
              <div>
                <h4 className="font-semibold">Justification</h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  {prediction.justification}
                </p>
              </div>
            </div>
          )}
          {!isLoading && !prediction && (
            <div className="flex h-full items-center justify-center">
              <p className="text-muted-foreground">
                Enter a scenario to get a prediction.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
