import { TestBed } from '@angular/core/testing';

import { DetalleRubrosService } from './detalle-rubros.service';

describe('DetalleRubrosService', () => {
  let service: DetalleRubrosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DetalleRubrosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
