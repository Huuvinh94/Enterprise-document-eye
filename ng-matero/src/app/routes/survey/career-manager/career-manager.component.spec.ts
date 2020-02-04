import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CareerManagerComponent } from './career-manager.component';


describe('DashboardComponent', () => {
  let component: CareerManagerComponent;
  let fixture: ComponentFixture<CareerManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CareerManagerComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CareerManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
