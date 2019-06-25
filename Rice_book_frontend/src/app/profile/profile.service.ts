import { Injectable } from '@angular/core';
import { Profile } from '../profile/profile';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { URL } from '../helper';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  registered_Users: Profile[];
  login_profile: Profile;
  private dataSource = new BehaviorSubject<Profile>(undefined);

  public Promise_helper(
    method: string,
    URL_endpoint: string,
    username: string,
    payload: any
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      // var HTTP_request;
      if (method == 'get') {
        this.http.get<any>(URL_endpoint + '/' + username).subscribe(result => {
          if (result == null) {
            reject();
          } else {
            resolve(result);
          }
        });
      } else if (method == 'put') {
        let value = Object.values(payload)[0];
        if (
          value != undefined &&
          (typeof value == 'string' && value.length > 0)
        ) {
          this.http.put<any>(URL_endpoint, payload).subscribe(result => {
            if (result == null) {
              reject();
            } else {
              resolve(result);
            }
          });
        }
      }
    });
  }

  constructor(private router: Router, private http: HttpClient) {
  }
  showprofiles(): void {
    let newUser = new Profile();
    this.http.get<any>(URL.getName).subscribe((res) => {
      newUser.username = res.username;
      this.Promise_helper('get', URL.getemail, newUser.username, {})
        .then(result => {
          //fill email
          newUser.email_address = result.email;
          return this.Promise_helper(
            'get',
            URL.getphone_number,
            newUser.username,
            {}
          );
        })
        .then(result => {
          //fill phone number
          newUser.phone_number = result.phone_number;
          return this.Promise_helper('get', URL.getdob, newUser.username, {});
        })
        .then(result => {
          //fill date of birth
          newUser.DOB = result.dob;
          return this.Promise_helper('get', URL.getzipcode, newUser.username, {});
        })
        .then(result => {
          //fill date of zipcode
          newUser.zipcode = result.zipcode;
          return this.Promise_helper('get', URL.getAvatar, newUser.username, {});
        })
        .then(result => {
          //fill date of avatar
          newUser.avatar = result.avatars[0].avatar;
          return this.Promise_helper('get', URL.getFacebookId, newUser.username, {});
        })
        .then(result => {
          //fill facebookId
          newUser.facebookId = result.facebookId;
          this.dataSource.next(newUser);
        });
    });

  }

  getBS(): BehaviorSubject<Profile> {
    return this.dataSource;
  }

  handleImageChange(formdata: any): any {
    return new Promise((resolve, reject) => {
      this.http.post<any>(URL.postImage, formdata).subscribe((res) => {
        if (res) {
          resolve(res);
        }
        else {
          reject();
        }

      });
    });
  }

  linkCheck(username: string, password: string): any {
    return new Promise((resolve, reject) => {
      this.http.post<any>(URL.linkcheck, { username: username, password: password }).subscribe((res) => {
        resolve(res);
      });
    })
  }

  unlinkCheck(): any {
    return new Promise((resolve, reject) => {
      this.http.get<any>(URL.unlinkcheck).subscribe((res) => {
        resolve(res);
      });
    })
  }

  fbLinkAuth(): void {
    window.location.href = URL.server + "/link/facebook"
  }

  FBLinkAuth_fb_local(username: string, password: string): void {
    this.http.post<any>(URL.linkfblocal, { username: username, password: password }).subscribe((res) => {
      // console.log(res);
      if (res.msg === "link successfully") {
        this.http.put<any>(URL.putLogout, null).subscribe((res) => {
          this.http.post<any>(URL.postLogin, { username: username, password: password }).subscribe((res) => {
            if (res.result == "success") {
              this.router.navigate(['/main']);
            }
          });
        });
      }
    });
  }

  fbUnlinkAuth(): any {
    // window.location.href = URL.server + "/unlink/facebook"
    return new Promise((resolve, reject) => {
      this.http.get<any>(URL.unlinkservice).subscribe((res) => {
        resolve(res);
      });
    })
  }
}
