import { createTopicRegistry } from '@/lib/topic-registry';
import { howDissectContentWorks } from './demo/how-dissect-content-works';
import { acuteAppendicitis } from './topics/acute-appendicitis';

// Explicit registration validates every imported fixture when development/build loads this module.
export const topicRegistry = createTopicRegistry([
  { source: 'topics/acute-appendicitis/index.ts', content: acuteAppendicitis },
  {
    source: 'demo/how-dissect-content-works.ts',
    content: howDissectContentWorks,
  },
]);
