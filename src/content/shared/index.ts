import {
  composeTopic as composeWith,
  createSharedLibrary,
  type AuthoredTopic,
} from '@/lib/shared-content';
import { sharedReferences } from './references';
import { sharedBlocks } from './blocks';

// Validated when imported, like topic content.
export const sharedLibrary = createSharedLibrary({
  references: sharedReferences,
  blocks: sharedBlocks,
});
// Used by each topic's index.ts to resolve its explicit shared includes.
export const composeTopic = <T extends AuthoredTopic>(topic: T) =>
  composeWith(topic, sharedLibrary);
