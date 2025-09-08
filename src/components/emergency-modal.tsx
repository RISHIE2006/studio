'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Siren, LocateFixed, VideoOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { DroneIcon } from './icons/drone-icon';
import { AmbulanceIcon } from './icons/ambulance-icon';

type ModalStep = 'location' | 'tracking';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EmergencyModal({ isOpen, onClose }: EmergencyModalProps) {
  const [step, setStep] = useState<ModalStep>('location');
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isOpen) {
      setStep('location');
      setLocation(null);
      setLocationError(null);

      // Geolocation
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocation({
              lat: position.coords.latitude,
              lon: position.coords.longitude,
            });
            setLocationError(null);
            // Automatically proceed to next step once location is acquired
            setTimeout(() => setStep('tracking'), 1000);
          },
          (error) => {
            setLocationError(error.message);
            toast({
              variant: 'destructive',
              title: 'Location Access Denied',
              description: 'Please enable location services for emergency dispatch.',
            });
          }
        );
      } else {
        setLocationError('Geolocation is not supported by your browser.');
        toast({
          variant: 'destructive',
          title: 'Geolocation Not Supported',
          description: 'Your browser does not support geolocation.',
        });
      }
    }
  }, [isOpen, toast]);


  const renderStep = () => {
    switch (step) {
      case 'location':
        return (
          <motion.div
            key="location"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="flex flex-col items-center justify-center h-full text-center p-6"
          >
            <DialogTitle className="text-2xl font-bold">Acquiring Location</DialogTitle>
            <DialogDescription className="mt-2">
              Please wait while we lock your GPS coordinates.
            </DialogDescription>
            
            <div className="my-8">
                <Loader2 className="h-16 w-16 text-primary animate-spin" />
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <LocateFixed className="h-4 w-4"/>
              {location ? `Location acquired: ${location.lat.toFixed(4)}, ${location.lon.toFixed(4)}` : (locationError ? `Location error: ${locationError}`: 'Acquiring location...')}
            </div>

            {locationError && (
              <Alert variant="destructive" className="mt-4">
                <AlertTitle>Location Access Required</AlertTitle>
                <AlertDescription>
                  Please allow location access to use the SOS feature.
                </AlertDescription>
              </Alert>
            )}
          </motion.div>
        );
        case 'tracking':
        return (
          <motion.div
            key="tracking"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="flex flex-col items-center justify-center h-full text-center p-6"
          >
            <Siren className="h-16 w-16 text-primary animate-pulse"/>
            <DialogTitle className="text-2xl font-bold mt-4">NHAI Services Dispatched</DialogTitle>
            <DialogDescription className="mt-2 max-w-sm">
              Help is on the way to your location ({location?.lat.toFixed(4)}, {location?.lon.toFixed(4)}).
            </DialogDescription>
            
            <div className="grid grid-cols-2 gap-4 mt-8 w-full max-w-sm">
                <Card>
                    <CardHeader className="items-center pb-2">
                        <AmbulanceIcon className="h-10 w-10 text-primary" />
                    </CardHeader>
                    <CardContent className="text-center">
                        <p className="font-bold">Ambulance</p>
                        <p className="text-sm text-muted-foreground">ETA: 12 mins</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="items-center pb-2">
                        <DroneIcon className="h-10 w-10 text-primary" />
                    </CardHeader>
                    <CardContent className="text-center">
                        <p className="font-bold">Medical Drone</p>
                        <p className="text-sm text-muted-foreground">ETA: 7 mins</p>
                    </CardContent>
                </Card>
            </div>

            <Button onClick={onClose} className="mt-8">Close</Button>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg h-[80vh] sm:h-[60vh] flex flex-col p-0">
        <AnimatePresence mode="wait">
            {renderStep()}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
