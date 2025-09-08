import { ResourceAllocator } from '@/components/resource-allocator';

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">NHAI Partner Dashboard</h1>
        <p className="text-muted-foreground">
          Manage availability and predict resource needs for highway emergencies.
        </p>
      </div>
      <ResourceAllocator />
    </div>
  );
}
