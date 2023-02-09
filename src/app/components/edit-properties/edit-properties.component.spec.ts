import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPropertiesComponent } from './edit-properties.component';

describe('EditPropertiesComponent', () => {
  let component: EditPropertiesComponent;
  let fixture: ComponentFixture<EditPropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditPropertiesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
