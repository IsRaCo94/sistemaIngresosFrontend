import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegEgresosComponent } from './reg-egresos.component';

describe('RegEgresosComponent', () => {
  let component: RegEgresosComponent;
  let fixture: ComponentFixture<RegEgresosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegEgresosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegEgresosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
