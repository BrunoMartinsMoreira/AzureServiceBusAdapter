import { SubscribeOptions } from '@azure/service-bus';

export interface SbSubscriberMetadataOptions {
  subscription?: string;
  queue?: string;
  receiveMode?: 'peekLock' | 'receiveAndDelete';
  subQueueType?: 'deadLetter' | 'transferDeadLetter';
  skipParsingBodyAsJson?: boolean;
  options?: SubscribeOptions;
}

export interface SbSubscriptionMetadataOptions
  extends SbSubscriberMetadataOptions {
  topic: string;
}

export interface SbQueueSubscriptionMetadataOptions
  extends SbSubscriberMetadataOptions {
  queue: string;
}

export interface SbSubscriberTypeMap {
  subscription?: SbSubscriptionMetadataOptions;
  queue?: SbQueueSubscriptionMetadataOptions;
}
