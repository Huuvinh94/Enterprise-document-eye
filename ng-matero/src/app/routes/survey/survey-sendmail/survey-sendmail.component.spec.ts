import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SurveySendMailComponent } from './survey-sendmail.component';


describe('SurveySendMailComponent', () => {
  let component: SurveySendMailComponent;
  let fixture: ComponentFixture<SurveySendMailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SurveySendMailComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveySendMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
