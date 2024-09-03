import {
  Server,
  CustomTransportStrategy as CustomStrategy,
} from '@nestjs/microservices';
import {
  MessageHandlers,
  ProcessErrorArgs,
  ServiceBusClient,
  ServiceBusReceivedMessage,
  ServiceBusReceiver,
} from '@azure/service-bus';

import { AzureServiceBusContext } from '../context';
import { AzureServiceBusOptions, SendDeadLetterArgs } from '../interfaces';
import { Logger } from '@nestjs/common';
import { SbSubscriberMetadata } from '../metadata';

export class AzureServiceBusServer extends Server implements CustomStrategy {
  private sbClient: ServiceBusClient;
  readonly logger = new Logger(AzureServiceBusServer.name);

  constructor(protected readonly options: AzureServiceBusOptions) {
    super();

    this.initializeSerializer(options);
    this.initializeDeserializer(options);
  }

  async listen(callback: (...optionalParams: unknown[]) => any) {
    try {
      this.sbClient = this.createServiceBusClient();
      await this.start(callback);
    } catch (err) {
      callback(err);
    }
  }

  async start(
    callback: (err?: unknown, ...optionalParams: unknown[]) => void,
  ): Promise<void> {
    await this.bindEvents();
    callback();
  }

  registerQueueReceiver(metaOptions: any) {
    const {
      queue,
      subQueueType,
      skipParsingBodyAsJson,
      receiveMode = 'peekLock',
    } = metaOptions;

    const receiver = this.sbClient.createReceiver(queue, {
      receiveMode,
      skipParsingBodyAsJson,
      subQueueType,
    });
    return receiver;
  }

  registerTopicReceiver(metaOptions: any): ServiceBusReceiver {
    const {
      topic,
      subscription,
      subQueueType,
      skipParsingBodyAsJson,
      receiveMode = 'peekLock',
    } = metaOptions;

    const receiver = this.sbClient.createReceiver(topic, subscription, {
      receiveMode,
      subQueueType,
      skipParsingBodyAsJson,
    });

    return receiver;
  }

  async bindEvents(): Promise<void> {
    const subscribe = async (pattern: string) => {
      const { metaOptions }: SbSubscriberMetadata = JSON.parse(pattern);
      const { queue, options } = metaOptions;

      if (!queue) {
        const topicReceiver = this.registerTopicReceiver(metaOptions);

        const messageHandlers = this.createMessageHandlers(
          pattern,
          topicReceiver,
        );

        topicReceiver.subscribe(messageHandlers, options);
      }

      if (queue) {
        const queueReceiver = this.registerQueueReceiver(metaOptions);

        const messageHandlers = this.createMessageHandlers(
          pattern,
          queueReceiver,
        );

        queueReceiver.subscribe(messageHandlers, options);

        await queueReceiver.close();
      }
    };

    const registeredPatterns = [...this.messageHandlers.keys()];

    await Promise.all(registeredPatterns.map(subscribe));
  }

  public createMessageHandlers = (
    pattern: string,
    receiver: ServiceBusReceiver,
  ): MessageHandlers => ({
    processMessage: async (receivedMessage: ServiceBusReceivedMessage) => {
      await this.handleMessage(receivedMessage, pattern, receiver);
    },

    processError: async (args: ProcessErrorArgs): Promise<void> => {
      return new Promise<void>(() => {
        this.logger.error(args.error);
      });
    },
  });

  public async handleMessage(
    receivedMessage: ServiceBusReceivedMessage,
    pattern: string,
    receiver: ServiceBusReceiver,
  ): Promise<void> {
    const partialPacket = { data: receivedMessage, pattern };
    const packet = await this.deserializer.deserialize(partialPacket);

    const sbContext = new AzureServiceBusContext([
      {
        completeMessage: async (msg: ServiceBusReceivedMessage) => {
          await receiver.completeMessage(msg);
        },
        deadLetterMessage: async ({ msg, options }: SendDeadLetterArgs) => {
          await receiver.deadLetterMessage(msg, options);
        },
      },
    ]);

    return this.handleEvent(packet.pattern, packet, sbContext);
  }

  createServiceBusClient(): ServiceBusClient {
    const { connectionString, options } = this.options;
    return new ServiceBusClient(connectionString, options);
  }

  async close(): Promise<void> {
    await this.sbClient?.close();
  }
}
