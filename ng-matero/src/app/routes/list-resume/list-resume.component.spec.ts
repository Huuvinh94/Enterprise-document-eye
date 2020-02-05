import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ListResumeComponent } from './list-resume.component';


describe('ListResumeComponent', () => {
  let component: ListResumeComponent;
  let fixture: ComponentFixture<ListResumeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListResumeComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListResumeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
