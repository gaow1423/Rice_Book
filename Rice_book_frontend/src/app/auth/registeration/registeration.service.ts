import { Injectable } from '@angular/core';
import { Profile } from '../../profile/profile';
import { Error_msg } from '../../profile/error_msg';
import { Router } from '@angular/router';
import { sendRequest } from 'selenium-webdriver/http';
import { HttpClient } from '@angular/common/http';
import { URL } from '../../helper';

@Injectable({
  providedIn: 'root'
})
export class RegisterationService {
  constructor(private router: Router, private http: HttpClient) { }

  public test(): void {
    this.http
      .post<any>(URL.test, {
        postMsg: 321321321,
        aaa: 'aa??'
      })
      .subscribe(result => {
        console.log('Test_post responsed.');
        console.log(result.msg);
      });
  }
  regis_profile: Profile = {
    facebookId: undefined,
    username: undefined,
    password: undefined,
    display_name: undefined,
    email_address: undefined,
    phone_number: undefined,
    DOB: undefined,
    zipcode: undefined,
    avatar: undefined,
    status: undefined
  };

  error: Error_msg = {
    username: undefined,
    password: undefined,
    display_name: undefined,
    email_address: undefined,
    phone_number: undefined,
    DOB: undefined,
    zipcode: undefined,
    avatar: undefined,
    status: undefined
  };

  getProfile(): Profile {
    return this.regis_profile;
  }
  getError(): Error_msg {
    return this.error;
  }

  resetProfile(): void {
    Object.keys(this.regis_profile).forEach(key => {
      if (
        key != 'status' &&
        key != 'avatar' &&
        this.regis_profile[key] != undefined
      ) {
        this.regis_profile[key] = undefined;
      }
    });
  }
  validation(regis_profile: Profile, error: Error_msg): boolean {
    //check if all fields are empty;
    let allempty = true;
    Object.values(regis_profile).forEach(val => {
      if (typeof val == 'string' && val.length != 0) allempty = false;
    });

    //if all fields are empty, clean all error message, and route to main.
    if (allempty) {
      // this.router.navigate(['/main']);
      Object.keys(error).forEach(key => {
        error[key] = undefined;
      });
      error['username'] = 'All fields should be filled';
      return;
    } //else check each field for validation
    else
      Object.keys(regis_profile).forEach(key => {
        error[key] = undefined;
        if (regis_profile[key] == undefined || regis_profile[key].length == 0) {
          error[key] = key + ' must be filled';
        } else {
          switch (key) {
            case 'username': {
              if (regis_profile[key].match('^[a-zA-Z][a-zA-Z0-9]*$') === null)
                error[key] =
                  'Username can only be upper or lower case letters and numbers, but may not start with a number';
              break;
            }
            case 'display_name': {
              if (regis_profile[key].match(/^[a-zA-Z][a-zA-Z0-9]*$/) === null)
                error[key] =
                  'Username can only be upper or lower case letters and numbers, but may not start with a number';
              break;
            }
            case 'email_address': {
              if (
                regis_profile[key].match(
                  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
                ) === null
              )
                error[key] =
                  "Please include an '@' in the email address. 'd' is missing an '@'.";
              break;
            }
            case 'phone_number': {
              if (regis_profile[key].match(/\d\d\d\d\d\d\d\d\d\d/) === null)
                error[key] =
                  'A valid phone number must follow 123-123-1234 pattern.';
              break;
            }
            case 'zipcode': {
              if (regis_profile[key].match(/\d\d\d\d\d/) === null)
                error[key] = 'A valid zip code must be five digits.';
              break;
            }
            default: {
              break;
            }
          }
        }
      });

    let valid = true;
    Object.keys(error).forEach(key => {
      if (key != 'status' && key != 'avatar' && error[key] != undefined) {
        valid = false; // if any field in error is not undefined, then valid is false;
      }
    });
    return valid;
  }

  resetAll(): void {
    this.http.get<any>(URL.resetAll).subscribe(() => { });
  }
}
