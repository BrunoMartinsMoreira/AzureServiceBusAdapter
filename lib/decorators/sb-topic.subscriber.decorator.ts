import { EventPattern } from '@nestjs/microservices';

import { SbSubscriberMetadata } from '../metadata';
import {
  MetaOrMetaFactory,
  SbSubscriptionMetadataOptions,
} from '../interfaces';
import { storeMetadata } from '.';

export function SbTopicSubscription(
  metadata: MetaOrMetaFactory<SbSubscriptionMetadataOptions>,
) {
  return (target: object, key: string, descriptor: PropertyDescriptor) => {
    const sbSubscriberMetadata = new SbSubscriberMetadata(
      'subscription',
      metadata,
    );

    storeMetadata(target, key, sbSubscriberMetadata);

    if (descriptor) {
      return EventPattern(sbSubscriberMetadata)(target, key, descriptor);
    }
  };
}
