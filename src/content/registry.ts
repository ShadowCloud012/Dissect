import { createTopicRegistry } from '@/lib/topic-registry';
import { howDissectContentWorks } from './demo/how-dissect-content-works';

// Explicit registration validates every imported fixture when development/build loads this module.
export const topicRegistry = createTopicRegistry([
  {
    source: 'demo/how-dissect-content-works.ts',
    content: howDissectContentWorks,
  },
]);
