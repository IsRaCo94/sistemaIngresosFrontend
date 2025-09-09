import { TestBed } from '@angular/core/testing';

import { LibretaService } from './libreta.service';

describe('LibretaService', () => {
  let service: LibretaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LibretaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
