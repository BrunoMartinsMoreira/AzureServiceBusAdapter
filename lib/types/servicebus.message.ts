import { ServiceBusReceivedMessage as DefaulSbMessage } from '@azure/service-bus';

export interface ServiceBusMessage<T> extends DefaulSbMessage {
  body: T;
  deliveryCount: number;
}
