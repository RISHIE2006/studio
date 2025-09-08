'use client';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Image from 'next/image';
import { MapPin, Search } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const pickupLocations = [
  {
    name: 'Toll Plaza KM 120',
    type: 'Toll Booth',
    distance: '5 km',
    medicines: ['Painkillers', 'Bandages'],
  },
  {
    name: 'NHAI Highway Stop',
    type: 'Kiosk',
    distance: '8 km',
    medicines: ['Antiseptics', 'Gauze'],
  },
  {
    name: 'Expressway Fuel Station',
    type: 'Petrol Pump',
    distance: '12 km',
    medicines: ['Painkillers', 'First-aid kits'],
  },
];

export function MedicineFinder() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLocations = pickupLocations.filter(
    (loc) =>
      loc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loc.medicines.some((med) =>
        med.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Pickup Locations Map</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative h-96 w-full overflow-hidden rounded-lg bg-muted">
              <Image
                src="https://picsum.photos/seed/highwaymap/1200/800"
                alt="Map of pickup locations"
                data-ai-hint="map road"
                fill
                style={{ objectFit: 'cover' }}
              />
              <div className="absolute top-1/4 left-1/3 text-accent">
                <MapPin className="h-8 w-8" />
              </div>
              <div className="absolute top-2/3 left-1/2 text-accent">
                <MapPin className="h-8 w-8" />
              </div>
              <div className="absolute top-1/2 right-1/4 text-accent">
                <MapPin className="h-8 w-8" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search for medicines or locations..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="space-y-4">
          {filteredLocations.map((location, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{location.name}</CardTitle>
                <CardDescription>
                  {location.type} - Approx. {location.distance} away
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-medium">Available:</p>
                <p className="text-sm text-muted-foreground">
                  {location.medicines.join(', ')}
                </p>
              </CardContent>
              <CardFooter>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button className="w-full">Pre-order</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirm Pre-order</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will place a pre-order at {location.name}. You can
                        pay at the pickup point. Are you sure?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction>Confirm Order</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          ))}
          {filteredLocations.length === 0 && (
            <p className="text-center text-muted-foreground">
              No locations found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
