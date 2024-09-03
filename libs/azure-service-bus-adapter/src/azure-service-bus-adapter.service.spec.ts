import { Test, TestingModule } from '@nestjs/testing';
import { AzureServiceBusAdapterService } from './azure-service-bus-adapter.service';

describe('AzureServiceBusAdapterService', () => {
  let service: AzureServiceBusAdapterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AzureServiceBusAdapterService],
    }).compile();

    service = module.get<AzureServiceBusAdapterService>(AzureServiceBusAdapterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
