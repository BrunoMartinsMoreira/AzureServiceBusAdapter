import { ServiceBusReceivedMessage } from '@azure/service-bus';
import { DeadLetterConfigOptions } from '../types';

export interface SendDeadLetterArgs {
  msg: ServiceBusReceivedMessage;
  options: DeadLetterConfigOptions;
}
