import { TestBed } from '@angular/core/testing';

import { DetalleGastoService } from './detalle-gasto.service';

describe('DetalleGastoService', () => {
  let service: DetalleGastoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DetalleGastoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
