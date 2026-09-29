import { notFound } from 'next/navigation';
import { topicRegistry } from '@/content/registry';
import { topicHref, resolveTopicPage } from '@/lib/topic-pages';
import { TopicExperience } from '@/components/topic/topic-experience';
type Params = { specialty: string; topic: string; view: string };
type Props = { params: Promise<Params> };
function resolve(params: Params) {
  const topic = topicRegistry.getTopic(params.specialty, params.topic);
  if (!topic) notFound();
  const resolved = resolveTopicPage(topic, params.view);
  if (!resolved) notFound();
  return { topic, ...resolved };
}
export const dynamic = 'force-static';
export function generateStaticParams() {
  return topicRegistry.listTopics().flatMap((metadata) => {
    const topic = topicRegistry.getTopic(metadata.specialty, metadata.slug)!;
    return (topic.experience?.pages ?? []).map((page) => ({
      specialty: metadata.specialty,
      topic: metadata.slug,
      view: page.slug,
    }));
  });
}
export async function generateMetadata({ params }: Props) {
  const { topic, page } = resolve(await params);
  return {
    title: `${page.title} — ${topic.metadata.title}`,
    description: page.description,
    alternates: { canonical: `${topicHref(topic.metadata)}/${page.slug}` },
  };
}
export default async function TopicSubpage({ params }: Props) {
  const { topic, page } = resolve(await params);
  return (
    <TopicExperience
      topic={topic}
      pageSlug={page.slug}
      procedures={topicRegistry.relationsFor(topic)}
    />
  );
}
