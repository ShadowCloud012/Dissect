import { notFound } from 'next/navigation';
import { topicRegistry } from '@/content/registry';
import { resolveTheatrePrep } from '@/lib/topic-pages';
import { TheatrePrep } from '@/components/topic/theatre-prep';

type Params = { specialty: string; topic: string; view: string };
type Props = { params: Promise<Params> };
function resolve(params: Params) {
  const topic = topicRegistry.getTopic(params.specialty, params.topic);
  const prep = topic && resolveTheatrePrep(topic, params.view);
  if (!topic || !prep) notFound();
  return { topic, prep };
}
export const dynamic = 'force-static';
export const dynamicParams = false;
// One Theatre Prep per procedure page that has a composition.
export function generateStaticParams() {
  return topicRegistry.listTopics().flatMap((metadata) => {
    const topic = topicRegistry.getTopic(metadata.specialty, metadata.slug)!;
    if (topic.metadata.contentKind !== 'clinical') return [];
    return topic.metadata.procedures
      .filter((procedure) => resolveTheatrePrep(topic, procedure.page))
      .map((procedure) => ({
        specialty: metadata.specialty,
        topic: metadata.slug,
        view: procedure.page,
      }));
  });
}
export async function generateMetadata({ params }: Props) {
  const { prep } = resolve(await params);
  return {
    title: `Theatre Prep — ${prep.procedure.title}`,
    description: `A 5-minute briefing before ${prep.procedure.title.toLowerCase()}.`,
    alternates: { canonical: prep.href },
  };
}
export default async function TheatrePrepPage({ params }: Props) {
  const { topic, prep } = resolve(await params);
  return <TheatrePrep topic={topic} prep={prep} />;
}
