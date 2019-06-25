import { Injectable } from '@angular/core';
import { Profile } from '../../profile/profile';
import { Error_msg } from '../../profile/error_msg';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { stringify } from '@angular/compiler/src/util';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(private router: Router, private http: HttpClient) {
    http
      .get<Profile[]>('../../../assets/profile.json')
      .subscribe(profile_json => (this.registered_Users = profile_json));
  }

  registered_Users: Profile[];

  login_profile: Profile = {
    facebookId: undefined,
    username: undefined,
    password: undefined,
    display_name: undefined,
    email_address: undefined,
    phone_number: undefined,
    DOB: undefined,
    zipcode: undefined,
    status: undefined,
    avatar: undefined
  };

  error_login: Error_msg = {
    username: undefined,
    password: undefined,
    display_name: undefined,
    email_address: undefined,
    phone_number: undefined,
    DOB: undefined,
    zipcode: undefined,
    status: undefined,
    avatar: undefined
  };

  getProfile(): Profile {
    return this.login_profile;
  }
  getError(): Error_msg {
    return this.error_login;
  }
  resetProfile(): void {
    Object.keys(this.login_profile).forEach(key => {
      this.login_profile[key] = undefined;
    });
    this.router.navigate(['/main']);
  }
  validation(login_profile: Profile) {
    let allfilled = true;
    Object.keys(login_profile).forEach(key => {
      if (key == 'username' || key == 'password') {
        this.error_login[key] = undefined;
        if (
          login_profile[key] == undefined ||
          (typeof login_profile[key] == 'string' &&
            login_profile[key].length == 0)
        ) {
          allfilled = false;
          this.error_login[key] = 'This field can not be empty';
        }
      }
    });
    return allfilled;
  }
}
