import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiposRubrosComponent } from './tipos-rubros.component';

describe('TiposRubrosComponent', () => {
  let component: TiposRubrosComponent;
  let fixture: ComponentFixture<TiposRubrosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TiposRubrosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TiposRubrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
