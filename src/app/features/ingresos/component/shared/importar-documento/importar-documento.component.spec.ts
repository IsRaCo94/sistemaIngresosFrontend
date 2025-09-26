import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportarDocumentoComponent } from './importar-documento.component';

describe('ImportarDocumentoComponent', () => {
  let component: ImportarDocumentoComponent;
  let fixture: ComponentFixture<ImportarDocumentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ImportarDocumentoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportarDocumentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
