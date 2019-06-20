import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DistanceTableComponent } from './distance-table.component';

describe('DistanceTableComponent', () => {
  let component: DistanceTableComponent;
  let fixture: ComponentFixture<DistanceTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DistanceTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DistanceTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
