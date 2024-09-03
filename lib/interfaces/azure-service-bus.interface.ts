import { ServiceBusClientOptions } from '@azure/service-bus';

export interface AzureServiceBusOptions {
  connectionString: string;
  options?: ServiceBusClientOptions;
}
