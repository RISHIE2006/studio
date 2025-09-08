'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { HighwayAnimation } from '@/components/highway-animation';
import { EmergencyModal } from '@/components/emergency-modal';

export default function Home() {
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);

  return (
    <div className="relative flex h-[calc(100vh-4rem)] w-full flex-col items-center justify-center overflow-hidden">
      <HighwayAnimation />
      <div className="z-10 flex flex-col items-center text-center">
        <h1 className="text-5xl font-bold tracking-tighter text-primary sm:text-6xl md:text-7xl">
          Highway Healers
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-foreground/80 md:text-xl">
          Your guardian on the road. Instant access to emergency services,
          medicine, and live medical guidance.
        </p>
        <Button
          onClick={() => setIsEmergencyModalOpen(true)}
          className="mt-8 scale-110 transform transition-transform duration-300 ease-in-out hover:scale-125 focus:scale-125"
          size="lg"
          aria-label="Activate Emergency Assistance"
        >
          <Heart className="mr-2 h-6 w-6 animate-pulse" />
          <span className="text-lg font-semibold">
            Activate Emergency Assistance
          </span>
        </Button>
      </div>
      <EmergencyModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
      />
    </div>
  );
}
