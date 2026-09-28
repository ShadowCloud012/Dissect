import { notFound } from 'next/navigation';
import { topicRegistry } from '@/content/registry';
import { TopicLayout } from '@/components/topic/topic-layout';
import { TopicExperience } from '@/components/topic/topic-experience';
import { topicHref } from '@/lib/topic-pages';

type Props = { params: Promise<{ specialty: string; topic: string }> };
function resolveTopic(specialty: string, slug: string) {
  const topic = topicRegistry.getTopic(specialty, slug);
  if (!topic) notFound();
  return topic;
}
export const dynamic = 'force-static';
export function generateStaticParams() {
  return topicRegistry
    .listTopics()
    .map(({ specialty, slug }) => ({ specialty, topic: slug }));
}
export async function generateMetadata({ params }: Props) {
  const { specialty, topic: slug } = await params;
  const { metadata } = resolveTopic(specialty, slug);
  return {
    title: metadata.title,
    description: metadata.summary,
    alternates: { canonical: topicHref(metadata) },
  };
}
export default async function TopicPage({ params }: Props) {
  const { specialty, topic } = await params;
  const content = resolveTopic(specialty, topic);
  return content.experience ? (
    <TopicExperience topic={content} />
  ) : (
    <TopicLayout topic={content} />
  );
}
