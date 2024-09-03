import { ServiceBusReceivedMessage } from '@azure/service-bus';
import { BaseRpcContext } from '@nestjs/microservices/ctx-host/base-rpc.context';
import { SendDeadLetterArgs } from '../interfaces';

export interface SbMessageHandler {
  completeMessage: (message: ServiceBusReceivedMessage) => Promise<void>;
  deadLetterMessage: (args: SendDeadLetterArgs) => Promise<void>;
}

type AzureServiceBusContextArgs = [SbMessageHandler];

export class AzureServiceBusContext extends BaseRpcContext<AzureServiceBusContextArgs> {
  constructor(args: AzureServiceBusContextArgs) {
    super(args);
  }

  getMessageHandler(): SbMessageHandler {
    return this.args[0];
  }
}
