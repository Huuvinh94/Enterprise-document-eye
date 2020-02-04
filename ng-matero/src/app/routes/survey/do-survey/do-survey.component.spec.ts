import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DoSurveyComponent } from './do-survey.component';


describe('DoSurveyComponent', () => {
  let component: DoSurveyComponent;
  let fixture: ComponentFixture<DoSurveyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DoSurveyComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoSurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
