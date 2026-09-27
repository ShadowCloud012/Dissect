import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

export function PlaceholderPage({
  title,
  description,
  note,
}: {
  title: string;
  description: string;
  note: string;
}) {
  return (
    <div className="mx-auto max-w-5xl px-5 py-14 sm:px-8 sm:py-20">
      <Badge>Dissect / {title}</Badge>
      <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
        {title}
      </h1>
      <p className="mt-5 max-w-2xl text-lg leading-8 text-dissect-muted">
        {description}
      </p>
      <Card className="mt-10 max-w-2xl">
        <h2 className="mb-4 text-xl font-semibold">
          A space for {title.toLowerCase()}
        </h2>
        <Alert title="Content placeholder">{note}</Alert>
      </Card>
    </div>
  );
}
