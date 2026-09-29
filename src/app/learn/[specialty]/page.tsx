import { notFound } from 'next/navigation';
import { getSpecialty, specialties } from '@/content/specialties';
import { topicRegistry } from '@/content/registry';
import { Breadcrumbs } from '@/components/navigation/breadcrumbs';
import {
  SpecialtyBrowser,
  SpecialtyBrowserView,
} from '@/components/navigation/specialty-browser';
import { Suspense } from 'react';
type Props = { params: Promise<{ specialty: string }> };
export const dynamic = 'force-static';
export function generateStaticParams() {
  return specialties.map(({ slug }) => ({ specialty: slug }));
}
export async function generateMetadata({ params }: Props) {
  const specialty = getSpecialty((await params).specialty);
  return {
    title: specialty?.title ?? 'Specialty not found',
    description: specialty?.description,
  };
}
export default async function SpecialtyPage({ params }: Props) {
  const specialty = getSpecialty((await params).specialty);
  if (!specialty) notFound();
  const browser = {
    conditions: topicRegistry.listConditions(specialty.slug),
    procedures: topicRegistry.listProcedures(specialty.slug),
    categories: specialty.categories,
  };
  return (
    <div className="browse-page">
      <Breadcrumbs
        items={[{ title: 'Learn', href: '/learn' }, { title: specialty.title }]}
      />
      <p className="eyebrow mt-8">Specialty reference</p>
      <h1 className="browse-title">{specialty.title}</h1>
      <p className="browse-intro">{specialty.description}</p>
      <Suspense
        fallback={
          <SpecialtyBrowserView
            {...browser}
            selected="all"
            pathname={`/learn/${specialty.slug}`}
          />
        }
      >
        <SpecialtyBrowser {...browser} />
      </Suspense>
    </div>
  );
}
