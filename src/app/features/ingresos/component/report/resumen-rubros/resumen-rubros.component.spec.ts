import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumenRubrosComponent } from './resumen-rubros.component';

describe('ResumenRubrosComponent', () => {
  let component: ResumenRubrosComponent;
  let fixture: ComponentFixture<ResumenRubrosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResumenRubrosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResumenRubrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
