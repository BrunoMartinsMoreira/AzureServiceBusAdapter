import { EventPattern } from '@nestjs/microservices';
import { SbSubscriberMetadata } from '../metadata';
import { storeMetadata } from '.';
import {
  MetaOrMetaFactory,
  SbQueueSubscriptionMetadataOptions,
} from '../interfaces';

export const SbQueueSubscription = (
  metadata: MetaOrMetaFactory<SbQueueSubscriptionMetadataOptions>,
) => {
  return (target: object, key: string, descriptor: PropertyDescriptor) => {
    const sbQueueSubscriberMetadata = new SbSubscriberMetadata(
      'queue',
      metadata,
    );

    storeMetadata(target, key, sbQueueSubscriberMetadata);

    if (descriptor) {
      return EventPattern(sbQueueSubscriberMetadata)(target, key, descriptor);
    }
  };
};
