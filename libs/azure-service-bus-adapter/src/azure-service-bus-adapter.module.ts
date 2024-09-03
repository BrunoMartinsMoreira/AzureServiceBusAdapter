import { Module } from '@nestjs/common';
import { AzureServiceBusAdapterService } from './azure-service-bus-adapter.service';

@Module({
  providers: [AzureServiceBusAdapterService],
  exports: [AzureServiceBusAdapterService],
})
export class AzureServiceBusAdapterModule {}
