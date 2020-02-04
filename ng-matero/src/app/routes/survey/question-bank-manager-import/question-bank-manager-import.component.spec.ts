import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { QuestionBankManagerImportComponent } from './question-bank-manager-import.component';


describe('QuestionBankManagerComponent', () => {
  let component: QuestionBankManagerImportComponent;
  let fixture: ComponentFixture<QuestionBankManagerImportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [QuestionBankManagerImportComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionBankManagerImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
