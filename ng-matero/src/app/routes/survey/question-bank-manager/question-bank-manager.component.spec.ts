import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { QuestionBankManagerComponent } from './question-bank-manager.component';


describe('QuestionBankManagerComponent', () => {
  let component: QuestionBankManagerComponent;
  let fixture: ComponentFixture<QuestionBankManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [QuestionBankManagerComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionBankManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
