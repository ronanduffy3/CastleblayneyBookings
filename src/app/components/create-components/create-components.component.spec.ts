import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateComponentsComponent } from './create-components.component';

describe('CreateComponentsComponent', () => {
  let component: CreateComponentsComponent;
  let fixture: ComponentFixture<CreateComponentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateComponentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateComponentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
