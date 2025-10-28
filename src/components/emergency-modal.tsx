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
import { Loader2, Siren, LocateFixed, Phone, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { DroneIcon } from './icons/drone-icon';
import { AmbulanceIcon } from './icons/ambulance-icon';
import { Input } from './ui/input';
import { Label } from './ui/label';

type ModalStep = 'contact' | 'location' | 'tracking';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EmergencyModal({ isOpen, onClose }: EmergencyModalProps) {
  const [step, setStep] = useState<ModalStep>('contact');
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [emergencyContact, setEmergencyContact] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      // Reset state when modal opens
      setStep('contact');
      setLocation(null);
      setLocationError(null);
      setEmergencyContact('');
    }
  }, [isOpen]);

  const handleContactSubmit = () => {
    if (emergencyContact && !/^\d{10}$/.test(emergencyContact)) {
        toast({
            variant: 'destructive',
            title: 'Invalid Phone Number',
            description: 'Please enter a valid 10-digit phone number.',
        });
        return;
    }
    setStep('location');
    startLocationAcquisition();
  };

  const startLocationAcquisition = () => {
     if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocation({
              lat: position.coords.latitude,
              lon: position.coords.longitude,
            });
            setLocationError(null);
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


  const renderStep = () => {
    switch (step) {
      case 'contact':
        return (
          <motion.div
            key="contact"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="flex flex-col items-center justify-center h-full text-center p-6"
          >
            <DialogTitle className="text-2xl font-bold">Emergency Contact</DialogTitle>
            <DialogDescription className="mt-2">
              Enter a phone number to notify in case of an emergency.
            </DialogDescription>

            <div className="my-8 w-full max-w-sm">
                <div className="grid gap-2 text-left">
                    <Label htmlFor="emergency-contact" className="flex items-center gap-2">
                        <Phone className="h-4 w-4" /> Emergency Contact Number
                    </Label>
                    <Input
                        id="emergency-contact"
                        type="tel"
                        placeholder="e.g., 1234567890"
                        value={emergencyContact}
                        onChange={(e) => setEmergencyContact(e.target.value)}
                    />
                </div>
            </div>

            <Button onClick={handleContactSubmit}>Confirm and Continue</Button>
            <Button variant="link" className="mt-2 text-muted-foreground" onClick={() => {
                setEmergencyContact('');
                setStep('location');
                startLocationAcquisition();
            }}>
                Skip for now
            </Button>
          </motion.div>
        );
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
            <DialogTitle className="text-2xl font-bold mt-4">NHAI & Contact Notified</DialogTitle>
            <DialogDescription className="mt-2 max-w-sm">
              Help is on the way to your location ({location?.lat.toFixed(4)}, {location?.lon.toFixed(4)}).
              {emergencyContact && ` Your contact (${emergencyContact}) has been notified.`}
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
