import { Component, OnInit } from '@angular/core';
import { Profile } from '../../profile/profile';
import { Error_msg } from '../../profile/error_msg';
import { Router } from '@angular/router';
import { LoginService } from './login.service';
import { HttpClient } from '@angular/common/http';
import { ProfileService } from 'src/app/profile/profile.service';
import { URL } from '../../helper';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  constructor(private loginService: LoginService, private http: HttpClient) { }

  ngOnInit() {
    this.getProfile();
    this.getError();
  }

  login_profile: Profile;
  error_login: Error_msg;

  getProfile(): void {
    this.login_profile = this.loginService.getProfile();
  }

  getError(): void {
    this.error_login = this.loginService.getError();
  }
  loginRequest(login_profile: Profile): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .post<any>(URL.postLogin, {
          username: this.login_profile.username,
          password: this.login_profile.password
        })
        .subscribe(result => {
          if (result.result == 'fail') {
            reject();
          } else {
            resolve(result);
          }
        });
    });
  }
  validation_login(login_profile: Profile): void {
    if (this.loginService.validation(login_profile)) {
      this.loginRequest(login_profile)
        .then(result => {
          localStorage.setItem('username', result.username);
          this.loginService.resetProfile();
        })
        .catch(() => {
          this.error_login.username =
            'The user does not exist, or the password is wrong!!';
        });
    }
  }

  FBlogin(): void {
    window.location.href = URL.server + "/auth/facebook";
  }

}
