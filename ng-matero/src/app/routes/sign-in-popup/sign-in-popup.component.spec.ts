import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignInPopupComponent } from './sign-in-popup.component';

describe('SignInPopupComponent', () => {
  let component: SignInPopupComponent;
  let fixture: ComponentFixture<SignInPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignInPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignInPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
