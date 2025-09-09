import { TestBed } from '@angular/core/testing';

import { CertificacionService } from './certificacion.service';

describe('CertificacionService', () => {
  let service: CertificacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CertificacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
