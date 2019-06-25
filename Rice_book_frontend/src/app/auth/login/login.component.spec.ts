// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { LoginComponent } from './login.component';
// import { RouterModule } from '@angular/router';
// import { RouterTestingModule } from '@angular/router/testing';
// import { FormsModule } from '@angular/forms';
// import { BrowserModule } from '@angular/platform-browser';
// import { NgModule } from '@angular/core';
// import { AppRoutingModule } from '../../app-routing.module';

// describe('LoginComponent', () => {
//   let component: LoginComponent;
//   let fixture: ComponentFixture<LoginComponent>;

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       declarations: [LoginComponent],
//       imports: [RouterModule, FormsModule, RouterTestingModule]
//     }).compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(LoginComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

// it('Test1: should log in a previously registered user (not new users)', () => {
//   component.validate_a('wg15', '12345');
//   expect(component.loginStatus).toBe('user is registered');

//   component.validate_a('fe23', '12345');
//   expect(component.loginStatus).toBe('user is not registered');
// });

// it('Test2: should not log in an invalid user', () => {
//   component.validate_b('wg15', '12345');
//   expect(component.validStatus).toBe('user is valid');

//   component.validate_b('wg15', '12346');
//   expect(component.validStatus).toBe('user is invalid');
// });

// it('Test3: should update error message (for displaying login error mesage to user)', () => {
//   component.validate_c('wg15', '12345');
//   expect(component.Errormsg_display).toBe('error message is not displayed');

//   component.validate_c('f323', '12346');
//   expect(component.Errormsg_display).toBe('error message is displayed');
// });
// });
