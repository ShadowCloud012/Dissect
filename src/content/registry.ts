import { createTopicRegistry } from '@/lib/topic-registry';
import { howDissectContentWorks } from './demo/how-dissect-content-works';
import { acuteAppendicitis } from './topics/acute-appendicitis';
import { gallstoneDisease } from './topics/gallstone-disease';

// Explicit registration validates every imported fixture when development/build loads this module.
export const topicRegistry = createTopicRegistry([
  { source: 'topics/acute-appendicitis/index.ts', content: acuteAppendicitis },
  { source: 'topics/gallstone-disease/index.ts', content: gallstoneDisease },
  {
    source: 'demo/how-dissect-content-works.ts',
    content: howDissectContentWorks,
  },
]);
