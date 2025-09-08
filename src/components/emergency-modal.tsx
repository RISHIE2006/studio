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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { getFirstAidInstructions } from '@/ai/flows/automated-first-aid-instructions';
import { Loader2, Bot, Video, VideoOff, Siren } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';

type ModalStep = 'vitals' | 'guidance' | 'tracking';
type FirstAidState = 'idle' | 'loading' | 'success';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EmergencyModal({ isOpen, onClose }: EmergencyModalProps) {
  const [step, setStep] = useState<ModalStep>('vitals');
  const [firstAidState, setFirstAidState] = useState<FirstAidState>('idle');
  const [situation, setSituation] = useState('');
  const [instructions, setInstructions] = useState('');
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);

  useEffect(() => {
    if (isOpen) {
      setStep('vitals');
      setFirstAidState('idle');
      setSituation('');
      setInstructions('');

      const getCameraPermission = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          setHasCameraPermission(true);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (error) {
          console.error('Error accessing camera:', error);
          setHasCameraPermission(false);
          toast({
            variant: 'destructive',
            title: 'Camera Access Denied',
            description: 'Please enable camera permissions for vital sign monitoring.',
          });
        }
      };
      getCameraPermission();
    } else {
        // Stop camera stream when modal is closed
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
    }
  }, [isOpen, toast]);

  const handleGetInstructions = async () => {
    if (!situation) return;
    setFirstAidState('loading');
    try {
      const result = await getFirstAidInstructions({ situationDescription: situation });
      setInstructions(result.firstAidInstructions);
      setFirstAidState('success');
    } catch (error) {
      console.error('Failed to get first aid instructions:', error);
      setInstructions('Could not retrieve instructions. Please describe the situation to the operator.');
      setFirstAidState('success');
    }
  };
  
  const renderStep = () => {
    switch (step) {
      case 'vitals':
        return (
          <motion.div
            key="vitals"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="flex flex-col items-center justify-center h-full text-center p-6"
          >
            <DialogTitle className="text-2xl font-bold">Vital Sign Scan</DialogTitle>
            <DialogDescription className="mt-2">
              Please remain still while we scan your vital signs using your camera.
            </DialogDescription>
            <div className="relative w-full max-w-md aspect-video bg-muted rounded-lg my-6 overflow-hidden">
                <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                {hasCameraPermission === false && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50">
                        <VideoOff className="h-12 w-12 text-destructive" />
                        <p className="mt-2 text-white">Camera access denied.</p>
                    </div>
                )}
            </div>
            {hasCameraPermission === null ? (
                <Button disabled>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Requesting Camera...
                </Button>
            ) : (
                <Button onClick={() => setStep('guidance')} disabled={!hasCameraPermission}>
                    Proceed to Guidance
                </Button>
            )}

            {!hasCameraPermission && (
              <Alert variant="destructive" className="mt-4">
                <AlertTitle>Camera Access Required</AlertTitle>
                <AlertDescription>
                  Please allow camera access to use this feature.
                </AlertDescription>
              </Alert>
            )}
          </motion.div>
        );
      case 'guidance':
        return (
           <motion.div
            key="guidance"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="p-6 h-full flex flex-col"
          >
            <DialogHeader className="text-left">
              <DialogTitle className="text-2xl">AI-Powered Guidance</DialogTitle>
              <DialogDescription>
                Describe the situation for immediate first-aid instructions.
              </DialogDescription>
            </DialogHeader>
            <div className="flex-grow py-4 space-y-4 overflow-y-auto">
              <div className="space-y-2">
                <Label htmlFor="situation">Describe the situation</Label>
                <Textarea
                  id="situation"
                  placeholder="e.g., 'Person is unconscious but breathing after a fall.'"
                  value={situation}
                  onChange={(e) => setSituation(e.target.value)}
                  className="bg-secondary/50"
                />
              </div>
              <Button onClick={handleGetInstructions} disabled={firstAidState === 'loading' || !situation}>
                {firstAidState === 'loading' ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Bot className="mr-2 h-4 w-4" />
                )}
                Get AI Instructions
              </Button>
              <AnimatePresence>
                {firstAidState !== 'idle' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <Card className="bg-secondary/50">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Bot /> AI First-Aid Steps
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="prose prose-sm dark:prose-invert max-w-none">
                        {firstAidState === 'loading' ? (
                          <div className="flex items-center space-x-2 text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Generating instructions...</span>
                          </div>
                        ) : (
                           instructions.split('\n').map((line, i) => <p key={i}>{line}</p>)
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
             <div className="pt-4 border-t">
              <Button onClick={() => setStep('tracking')} className="w-full">
                <Siren className="mr-2"/> Dispatch Emergency Services
              </Button>
            </div>
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
            <DialogTitle className="text-2xl font-bold mt-4">Emergency Services Dispatched</DialogTitle>
            <DialogDescription className="mt-2">
              Help is on the way. Estimated arrival: 12 minutes.
            </DialogDescription>
            <div className="mt-6 w-full">
                <p className="text-sm text-muted-foreground">You can close this window. We will notify you of updates.</p>
            </div>
            <Button onClick={onClose} className="mt-4">Close</Button>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg h-[80vh] flex flex-col p-0">
        <AnimatePresence mode="wait">
            {renderStep()}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
