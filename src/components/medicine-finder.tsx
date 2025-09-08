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
import { Search } from 'lucide-react';
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
import { Map } from './map';

const pickupLocations = [
  {
    name: 'Toll Plaza KM 120',
    type: 'Toll Booth',
    distance: '5 km',
    medicines: ['Painkillers', 'Bandages'],
    lat: 20.983,
    lng: 78.583,
  },
  {
    name: 'NHAI Highway Stop',
    type: 'Kiosk',
    distance: '8 km',
    medicines: ['Antiseptics', 'Gauze'],
    lat: 20.6,
    lng: 78.9,
  },
  {
    name: 'Expressway Fuel Station',
    type: 'Petrol Pump',
    distance: '12 km',
    medicines: ['Painkillers', 'First-aid kits'],
    lat: 20.3,
    lng: 79.2,
  },
];

const mapLocations = pickupLocations.map(loc => ({
    name: loc.name,
    lat: loc.lat,
    lng: loc.lng
}))

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
    <div className="grid h-[calc(100vh-8rem)] grid-cols-1 gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2 h-full">
        <Card className="h-full flex flex-col">
          <CardHeader>
            <CardTitle>Pickup Locations Map</CardTitle>
          </CardHeader>
          <CardContent className='flex-grow'>
            <div className="relative h-full w-full overflow-hidden rounded-lg bg-muted">
              <Map locations={mapLocations} />
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
        <div className="space-y-4 max-h-[calc(100vh-12rem)] overflow-y-auto">
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
