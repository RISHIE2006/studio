'use client';

import {
  APIProvider,
  Map as GoogleMap,
  AdvancedMarker,
  Pin,
} from '@vis.gl/react-google-maps';
import { Button } from './ui/button';
import { LocateFixed, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Skeleton } from './ui/skeleton';

interface MapProps {
  locations: {
    lat: number;
    lng: number;
    name: string;
  }[];
}

const defaultPosition = { lat: 20.5937, lng: 78.9629 }; // Centered on India

export function Map({ locations }: MapProps) {
  const [position, setPosition] = useState(defaultPosition);
  const [loading, setLoading] = useState(true);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    // Component did mount, so we can now say we're not loading
    setLoading(false);
  }, []);

  const handleUseMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location', error);
          alert('Could not get your location. Please enable location services.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  if (!apiKey) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center bg-muted">
        <p className="mb-2 text-center text-muted-foreground">
          Google Maps API Key is missing.
        </p>
        <p className="text-center text-sm text-muted-foreground">
          Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your .env file.
        </p>
      </div>
    );
  }

  if (loading) {
     return <Skeleton className="h-full w-full" />;
  }

  return (
    <APIProvider apiKey={apiKey}>
      <div className="relative h-full w-full">
        <GoogleMap
          defaultCenter={position}
          center={position}
          defaultZoom={7}
          mapId="highway-healers-map"
          gestureHandling={'greedy'}
        >
          {locations.map((loc, index) => (
            <AdvancedMarker key={index} position={loc}>
              <Pin>
                 <MapPin className="h-6 w-6 text-primary" />
              </Pin>
            </AdvancedMarker>
          ))}
           <AdvancedMarker position={position}>
              <div className="relative flex h-6 w-6 items-center justify-center">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex h-4 w-4 rounded-full bg-primary"></span>
              </div>
            </AdvancedMarker>
        </GoogleMap>
        <div className="absolute bottom-4 left-4">
          <Button onClick={handleUseMyLocation} size="sm">
            <LocateFixed className="mr-2 h-4 w-4" /> Use My Location
          </Button>
        </div>
      </div>
    </APIProvider>
  );
}
