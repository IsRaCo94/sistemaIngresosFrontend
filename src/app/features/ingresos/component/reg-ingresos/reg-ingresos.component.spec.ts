import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegIngresosComponent } from './reg-ingresos.component';

describe('RegIngresosComponent', () => {
  let component: RegIngresosComponent;
  let fixture: ComponentFixture<RegIngresosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegIngresosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegIngresosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
