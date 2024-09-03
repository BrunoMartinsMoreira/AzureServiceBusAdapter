import { SB_SUBSCRIBER_METADATA } from '../constants';
import { SubscriberMetadataForTarget } from '../interfaces';
import { SbSubscriberMetadata } from '../metadata';

export * from './sb-topic.subscriber.decorator';
export * from './sb-queue.subscriber.decorator';

export function storeMetadata(
  target: object,
  key: string,
  metadata: SbSubscriberMetadata,
): void {
  const subscriberMetadataForTarget: SubscriberMetadataForTarget =
    Reflect.getMetadata(SB_SUBSCRIBER_METADATA, target) || [];

  if (subscriberMetadataForTarget.push({ key, metadata }) === 1) {
    Reflect.defineMetadata(
      SB_SUBSCRIBER_METADATA,
      subscriberMetadataForTarget,
      target,
    );
  }
}
