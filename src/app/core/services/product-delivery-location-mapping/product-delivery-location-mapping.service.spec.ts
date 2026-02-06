import { TestBed } from '@angular/core/testing';

import { ProductDeliveryLocationMappingService } from './product-delivery-location-mapping.service';

describe('ProductDeliveryLocationMappingService', () => {
  let service: ProductDeliveryLocationMappingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductDeliveryLocationMappingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
