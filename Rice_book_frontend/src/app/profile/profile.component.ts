import { Component, OnInit } from '@angular/core';
import { Profile } from './profile';
import { Error_msg } from './error_msg';
import { HttpClient } from '@angular/common/http';
import { ProfileService } from 'src/app/profile/profile.service';
import { Router } from '@angular/router';
import { URL } from '../helper';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  fblinkerror: string = "";
  linkError: string = "";
  loginType: string = "";
  linkUsername: string = "";
  linkPassword: string = "";
  constructor(
    private router: Router,
    private http: HttpClient,
    private profileService: ProfileService
  ) { }

  profile: Profile = {
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

  Input_profile: Profile = {
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

  error: Error_msg = {
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

  ngOnInit() {
    this.getprofiles();
    this.profileService.showprofiles();
  }
  getprofiles(): void {
    this.profileService.getBS().subscribe(profiles => {
      if (profiles != undefined) {

        if (profiles.facebookId === profiles.username) {
          this.loginType = "remote";
        }
        else {
          this.loginType = "local";
        }

        Object.keys(profiles).forEach(key => {
          this.profile[key] = profiles[key];
        });
      }
    });
  }
  Gotoprofile(): void {
    this.router.navigate(['/profile']);
  }

  validation(): void {
    Object.keys(this.Input_profile).forEach(key => {
      this.error[key] = undefined;
      if (
        typeof this.Input_profile[key] == 'string' &&
        this.Input_profile[key].length > 0
      )
        switch (key) {
          case 'username': {
            if (
              this.Input_profile[key].match(/^[a-zA-Z][a-zA-Z0-9]*$/) === null
            )
              this.error[key] =
                'Username can only be upper or lower case letters and numbers, but may not start with a number';
            break;
          }
          case 'display_name': {
            if (
              this.Input_profile[key].match(/^[a-zA-Z][a-zA-Z0-9]*$/) === null
            )
              this.error[key] =
                'Username can only be upper or lower case letters and numbers, but may not start with a number';
            break;
          }
          case 'email_address': {
            if (
              this.Input_profile[key].match(
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
              ) === null
            )
              this.error[key] =
                "Please include an '@' in the email address. 'd' is missing an '@'.";
            break;
          }
          case 'phone_number': {
            if (this.Input_profile[key].match(/\d\d\d\d\d\d\d\d\d\d/) === null)
              this.error[key] =
                'A valid phone number must follow 1231231234 pattern.';
            break;
          }
          case 'zipcode': {
            if (this.Input_profile[key].match(/\d\d\d\d\d/) === null)
              this.error[key] = 'A valid zip code must be five digits.';
            break;
          }
          default: {
            break;
          }
        }
    });

    let valid = true;

    Object.values(this.error).forEach(val => {
      if (val != undefined) valid = false;
    });

    if (valid == true) {
      new Promise((resolve, reject) => {
        let value = this.Input_profile.password;
        this.http
          .put<any>(URL.putpassword, {
            password: this.Input_profile['password']
          })
          .subscribe(() => {
            resolve();
          });
      })
        .then(() => {
          return new Promise((resolve, reject) => {
            this.http
              .put<any>(URL.putPhoneNumber, {
                phone_number: this.Input_profile['phone_number']
              })
              .subscribe(() => {
                resolve();
              });
          });
        })
        .then(() => {
          return new Promise((resolve, reject) => {
            this.http
              .put<any>(URL.putZipcode, {
                zipcode: this.Input_profile['zipcode']
              })
              .subscribe(() => {
                resolve();
              });
          });
        })
        .then(() => {
          return new Promise((resolve, reject) => {
            this.http
              .put<any>(URL.putemail, {
                email: this.Input_profile['email_address']
              })
              .subscribe(() => {
                resolve();
              });
          });
        })
        .then(() => {
          return new Promise((resolve, reject) => {
            this.http
              .put<any>(URL.putAvatar, {
                avatar: this.Input_profile['avatar']
              })
              .subscribe(() => {
                resolve();
              });
          });
        })
        .then(() => {
          this.ngOnInit();
          Object.keys(this.Input_profile).forEach(key => {
            this.Input_profile[key] = undefined;
          });
        });
    }
  }

  handleImageChange(event: any): void {
    var file = event.srcElement.files[0];
    var form = new FormData();
    form.append("image", file);
    form.append("title", file.name);
    this.profileService.handleImageChange(form).then((res) => {
      this.Input_profile.avatar = res.url;
      this.profile.avatar = res.url;
      this.validation();
    });
  }

  linkfb(): void {
    this.profileService.linkCheck(this.linkUsername, this.linkPassword).then((res) => {
      if (res.msg == "Local_login_success") {
        this.profileService.fbLinkAuth();
      }
      else if (res.msg == "FB_login_success") {
        this.profileService.FBLinkAuth_fb_local(this.linkUsername, this.linkPassword);
      }
      else {
        this.linkError = res.msg;
        setTimeout(() => {
          this.linkError = "";
        }, 5000)
      }
    });
  }

  unlinkfb(): void {
    this.profileService.unlinkCheck().then((res) => {
      if (res.msg == "success") {
        this.profileService.fbUnlinkAuth().then((res) => {
          if (res.profile && !res.profile.facebookId) {
            this.linkError = "Unlink successfully!"
            setTimeout(() => {
              this.linkError = "";
            }, 5000);
          }
        });
      }
      else {
        this.linkError = res.msg;
        setTimeout(() => {
          this.linkError = "";
        }, 5000)
      }
    })
  }

  checkType(): boolean {
    if (this.loginType === "remote")
      return true;
    else
      return false;
  }
}
