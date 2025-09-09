import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibretaComponent } from './libreta.component';

describe('LibretaComponent', () => {
  let component: LibretaComponent;
  let fixture: ComponentFixture<LibretaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LibretaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LibretaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
