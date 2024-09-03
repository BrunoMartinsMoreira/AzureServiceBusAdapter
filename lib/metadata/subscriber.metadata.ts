import {
  MetaOrMetaFactory,
  SbSubscriberMetadataOptions,
  SbSubscriberTypeMap,
} from '../interfaces';

export class SbSubscriberMetadata<
  T extends keyof SbSubscriberTypeMap = keyof SbSubscriberTypeMap,
> {
  metaOptions: SbSubscriberTypeMap[T];

  constructor(
    public readonly type: T,
    metaOptions: SbSubscriberTypeMap[T] extends SbSubscriberMetadataOptions
      ? MetaOrMetaFactory<SbSubscriberTypeMap[T]>
      : never,
  ) {
    this.metaOptions = { ...(metaOptions as any) };
  }
}
