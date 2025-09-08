import { AssistanceBot } from '@/components/assistance-bot';

export default function FirstAidPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">AI First-Aid Assistant</h1>
        <p className="text-muted-foreground">
          Describe the situation, and our AI will provide step-by-step first-aid instructions.
        </p>
      </div>
      <AssistanceBot />
    </div>
  );
}
