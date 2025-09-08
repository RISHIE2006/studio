import { MedicineFinder } from '@/components/medicine-finder';

export default function MedicinePage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Medicine Locator</h1>
        <p className="text-muted-foreground">
          Find and pre-order essential medicines for pickup.
        </p>
      </div>
      <MedicineFinder />
    </div>
  );
}
