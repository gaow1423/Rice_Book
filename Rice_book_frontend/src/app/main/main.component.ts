import { Component, OnInit } from '@angular/core';
import { User } from './user';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { URL } from '../helper';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  userAvatar: string = "";
  user: User = {
    name: '',
    status: ''
  };

  newStatus: string = '';

  constructor(private router: Router, private http: HttpClient) { }

  ngOnInit() {
    this.http
      .get<any>(URL.getheadline + '/' + "loggedinUser")
      .subscribe(result => {
        if (result) {

          if (result.headlines.length == 1) {
            this.user.name = result.headlines[0].username;
            this.user.status = result.headlines[0].headline;
          }
          else {
            //get headlines for followers
          }
        }
      });
    this.getAvatar();
  }


  update_status(): void {
    this.user.status = this.newStatus;
    this.http
      .put<any>(URL.putheadline, { headline: this.newStatus })
      .subscribe(result => {
        this.user.status = this.newStatus;
        this.newStatus = '';
      });
  }

  clearStorage(): void {
    this.http.put<any>(URL.putLogout, null).subscribe(result => {
      this.router.navigate(['/auth']);
    });
  }

  getAvatar(): void {
    this.http.get<any>(URL.getAvatar + "/" + "loggedinUser").subscribe((res) => {
      this.userAvatar = res.avatars[0].avatar;
    });
  }
}
