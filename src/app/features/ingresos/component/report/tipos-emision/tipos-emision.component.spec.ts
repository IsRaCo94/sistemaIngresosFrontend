import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiposEmisionComponent } from './tipos-emision.component';

describe('TiposEmisionComponent', () => {
  let component: TiposEmisionComponent;
  let fixture: ComponentFixture<TiposEmisionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TiposEmisionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TiposEmisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
