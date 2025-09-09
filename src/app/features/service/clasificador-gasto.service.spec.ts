import { TestBed } from '@angular/core/testing';

import { ClasificadorGastoService } from './clasificador-gasto.service';

describe('ClasificadorGastoService', () => {
  let service: ClasificadorGastoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClasificadorGastoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
