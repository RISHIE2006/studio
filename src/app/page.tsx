'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { EmergencyModal } from '@/components/emergency-modal';
import { SosButton } from '@/components/sos-button';
import { motion } from 'framer-motion';
import { ShieldCheck, Zap, Pill } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);

  const features = [
    {
      icon: <Zap className="h-6 w-6 text-primary" />,
      title: 'Instant SOS',
      description:
        'One-click SOS to automatically dispatch drones and ambulances to your exact location.',
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-primary" />,
      title: 'AI First-Aid',
      description:
        'Get instant, step-by-step first-aid guidance from our intelligent Assistant Bot while help is on the way.',
    },
    {
      icon: <Pill className="h-6 w-6 text-primary" />,
      title: 'Medicine Locator',
      description:
        'Quickly find and pre-order essential medicines from nearby highway pickup points.',
    },
  ];

  return (
    <>
      <div className="relative isolate overflow-hidden">
        <div className="container mx-auto px-6 pt-24 pb-24 text-center sm:pb-32 lg:px-8">
          <div className="mx-auto max-w-2xl">
             <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                HighwayHealers
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-300">
                Your intelligent highway emergency companion, always by your side.
              </p>
            </motion.div>
          </div>
          <div className="mt-16 flex justify-center">
             <SosButton onActivate={() => setIsEmergencyModalOpen(true)} />
          </div>
        </div>

        <div className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
              <h2 className="text-base font-semibold leading-7 text-primary">
                Smarter, Faster, Safer
              </h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Everything you need for peace of mind
              </p>
              <p className="mt-6 text-lg leading-8 text-gray-300">
                HighwayHealers combines cutting-edge AI with emergency services to provide a comprehensive safety net, wherever you are.
              </p>
            </div>
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
              <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                {features.map((feature, i) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="flex flex-col items-center text-center"
                  >
                    <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-white">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        {feature.icon}
                      </div>
                      {feature.title}
                    </dt>
                    <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-300">
                      <p className="flex-auto">{feature.description}</p>
                    </dd>
                  </motion.div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>

      <EmergencyModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
      />
    </>
  );
}
