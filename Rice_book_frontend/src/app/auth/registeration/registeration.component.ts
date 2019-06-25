import { Component, OnInit } from '@angular/core';
import { Profile } from '../../profile/profile';
import { Error_msg } from '../../profile/error_msg';
import { Router } from '@angular/router';
import { RegisterationService } from './registeration.service';
import { HttpClient } from '@angular/common/http';
import { URL } from '../../helper';

@Component({
  selector: 'app-registeration',
  templateUrl: './registeration.component.html',
  styleUrls: ['./registeration.component.css']
})
export class RegisterationComponent implements OnInit {
  constructor(
    private router: Router,
    private registerationService: RegisterationService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.getProfile();
    this.getError();
  }

  regis_profile: Profile;
  error: Error_msg;

  sendRequest(regis_profile: Profile): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .post<any>(URL.postNewUser, {
          username: regis_profile.username,
          password: regis_profile.password,
          display_name: regis_profile.display_name,
          email_address: regis_profile.email_address,
          phone_number: regis_profile.phone_number,
          DOB: regis_profile.DOB,
          zipcode: regis_profile.zipcode
        })
        .subscribe(result => {
          if (result.result == 'fail') {
            reject();
          } else {
            resolve();
          }
        });
    });
  }

  getProfile(): void {
    this.regis_profile = this.registerationService.getProfile();
  }

  getError(): void {
    this.error = this.registerationService.getError();
  }

  resetAll() {
    this.registerationService.resetAll();
  }

  validation_regis(regis_profile: Profile, error: Error_msg): void {
    if (this.registerationService.validation(regis_profile, error)) {
      this.sendRequest(regis_profile)
        .then(() => {
          console.log('success');
          error.username = 'Success!';
          this.registerationService.resetProfile();
        })
        .catch(() => {
          console.log('fail');
          error.username = 'The username already exist';
        });
    }
  }
}
