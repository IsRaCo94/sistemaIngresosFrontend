import { TestBed } from '@angular/core/testing';

import { ReportesIngresosService } from './reportes-ingresos.service';

describe('ReportesIngresosService', () => {
  let service: ReportesIngresosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReportesIngresosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
