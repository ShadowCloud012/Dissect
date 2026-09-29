import { Suspense } from 'react';
import { topicRegistry } from '@/content/registry';
import { specialties } from '@/content/specialties';
import {
  SearchExperience,
  SearchView,
} from '@/components/search/search-experience';

export const metadata = {
  title: 'Search',
  description:
    'Find conditions, procedures, anatomy and complications by the names you use.',
};
export const dynamic = 'force-static';

// Search documents are generated at build time and ranked in the browser;
// there is no search endpoint.
export default function SearchPage() {
  const search = {
    documents: topicRegistry.searchDocuments(),
    specialtyTitles: Object.fromEntries(
      specialties.map((specialty) => [specialty.slug, specialty.title]),
    ),
  };
  return (
    <div className="browse-page">
      <p className="eyebrow">Dissect reference</p>
      <h1 className="browse-title">Search</h1>
      <p className="browse-intro">
        Search by condition, procedure, anatomy or complication, using the names
        you would use on the ward or in theatre.
      </p>
      <Suspense fallback={<SearchView {...search} urlQuery="" />}>
        <SearchExperience {...search} />
      </Suspense>
    </div>
  );
}
