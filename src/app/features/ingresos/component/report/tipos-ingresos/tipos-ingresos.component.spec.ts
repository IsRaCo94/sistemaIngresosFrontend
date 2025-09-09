import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiposIngresosComponent } from './tipos-ingresos.component';

describe('TiposIngresosComponent', () => {
  let component: TiposIngresosComponent;
  let fixture: ComponentFixture<TiposIngresosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TiposIngresosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TiposIngresosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
