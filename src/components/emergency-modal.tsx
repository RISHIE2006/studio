'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AmbulanceIcon } from '@/components/icons/ambulance-icon';
import { DroneIcon } from '@/components/icons/drone-icon';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { getFirstAidInstructions } from '@/ai/flows/automated-first-aid-instructions';
import { Loader2, Siren, Bot } from 'lucide-react';
import Image from 'next/image';

type ModalState = 'connecting' | 'tracking' | 'error';
type FirstAidState = 'idle' | 'loading' | 'success';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EmergencyModal({ isOpen, onClose }: EmergencyModalProps) {
  const [modalState, setModalState] = useState<ModalState>('connecting');
  const [firstAidState, setFirstAidState] = useState<FirstAidState>('idle');
  const [situation, setSituation] = useState('');
  const [instructions, setInstructions] = useState('');
  const [eta, setEta] = useState({ ambulance: 15, drone: 10 });

  useEffect(() => {
    if (isOpen) {
      setModalState('connecting');
      const timer = setTimeout(() => {
        setModalState('tracking');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (modalState === 'tracking') {
      const interval = setInterval(() => {
        setEta((prev) => ({
          ambulance: Math.max(0, prev.ambulance - 1),
          drone: Math.max(0, prev.drone - 1),
        }));
      }, 60000);
      return () => clearInterval(interval);
    }
  }, [modalState]);

  const handleGetInstructions = async () => {
    if (!situation) return;
    setFirstAidState('loading');
    try {
      const result = await getFirstAidInstructions({
        situationDescription: situation,
      });
      setInstructions(result.firstAidInstructions);
      setFirstAidState('success');
    } catch (error) {
      console.error('Failed to get first aid instructions:', error);
      setInstructions(
        'Could not retrieve instructions. Please describe the situation to the operator.'
      );
      setFirstAidState('success');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0">
        {modalState === 'connecting' && (
          <div className="flex flex-col items-center justify-center h-full">
            <AmbulanceIcon className="h-24 w-24 text-primary animate-pulse" />
            <p className="mt-4 text-2xl font-semibold text-foreground">
              Connecting to Emergency Services...
            </p>
            <p className="text-muted-foreground">Please wait, help is on the way.</p>
          </div>
        )}
        {modalState === 'tracking' && (
          <div className="grid grid-cols-1 md:grid-cols-2 h-full">
            <div className="relative h-full flex flex-col">
              <DialogHeader className="p-6 pb-2">
                <DialogTitle className="text-2xl">Live Tracking</DialogTitle>
                <DialogDescription>
                  Help is en route. Stay on the line.
                </DialogDescription>
              </DialogHeader>
              <div className="flex-grow relative m-6 rounded-lg overflow-hidden">
                <Image src="https://picsum.photos/800/600" data-ai-hint="map road" alt="Map" fill style={{ objectFit: 'cover' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <Siren className="h-8 w-8 text-red-500 animate-ping" />
                </div>
                 <div className="absolute top-1/4 left-1/4 animate-[pulse_2s_infinite]">
                    <AmbulanceIcon className="h-10 w-10 text-primary" />
                </div>
                <div className="absolute bottom-1/4 right-1/4 animate-[pulse_2s_infinite_1s]">
                    <DroneIcon className="h-10 w-10 text-accent" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 p-6 pt-0">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Ambulance ETA</CardTitle>
                    <AmbulanceIcon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{eta.ambulance} min</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Drone ETA</CardTitle>
                    <DroneIcon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{eta.drone} min</div>
                  </CardContent>
                </Card>
              </div>
            </div>
            <div className="bg-background/50 h-full flex flex-col border-l">
              <DialogHeader className="p-6 pb-2">
                <DialogTitle className="text-2xl">Live Guidance</DialogTitle>
                <DialogDescription>
                  AI-powered first-aid and live doctor support.
                </DialogDescription>
              </DialogHeader>
              <div className="flex-grow p-6 pt-0 space-y-4 overflow-y-auto">
                <div className="space-y-2">
                  <Label htmlFor="situation">Describe the situation</Label>
                  <Textarea
                    id="situation"
                    placeholder="e.g., 'Person is unconscious but breathing after a fall.'"
                    value={situation}
                    onChange={(e) => setSituation(e.target.value)}
                  />
                </div>
                <Button onClick={handleGetInstructions} disabled={firstAidState === 'loading'}>
                  {firstAidState === 'loading' ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Bot className="mr-2 h-4 w-4" />
                  )}
                  Get AI Instructions
                </Button>
                {firstAidState !== 'idle' && (
                    <Card className="bg-card/50">
                        <CardHeader>
                            <CardTitle className="text-lg">First-Aid Steps</CardTitle>
                        </CardHeader>
                        <CardContent className="prose prose-invert text-foreground/90 max-w-none">
                            {firstAidState === 'loading' ? (
                                <div className="flex items-center space-x-2">
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    <span>Generating instructions...</span>
                                </div>
                            ) : (
                                instructions.split('\n').map((line, i) => <p key={i}>{line}</p>)
                            )}
                        </CardContent>
                    </Card>
                )}
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle>Doctor on Call</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                      <p className="text-muted-foreground">Connecting to doctor...</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
