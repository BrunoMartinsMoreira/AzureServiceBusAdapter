import { DeadLetterOptions } from '@azure/service-bus';

export type DeadLetterConfigOptions = DeadLetterOptions & {
  [key: string]: number | boolean | string | Date | null;
};
