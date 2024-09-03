export * from './azure-service-bus.interface';
export * from './subscriber.interface';
export * from './subscriber-metadata-for-target.type';
export * from './sb-context-options';

export type MetaOrMetaFactory<T> = T | ((helper?: any) => T | Promise<T>);
