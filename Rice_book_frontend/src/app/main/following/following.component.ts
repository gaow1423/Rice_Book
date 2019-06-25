import { Component, OnInit } from '@angular/core';
import { Follower } from './follower';
import { FollowingService } from './following.service';
import { MainService } from '../main.service';
import { Profile } from '../../profile/profile';

@Component({
  selector: 'app-following',
  templateUrl: './following.component.html',
  styleUrls: ['./following.component.css']
})
export class FollowingComponent implements OnInit {
  newName: string = '';
  followers: Profile[];
  msg: string = '';
  constructor(
    // private followerService: FollowingService,
    private mainService: MainService
  ) { }

  ngOnInit() {
    this.getfollowers();
    this.mainService.showFollowers();
    this.mainService.getAllPost();
  }

  getfollowers() {
    this.mainService.getBS().subscribe(profile => (this.followers = profile));
  }

  addNewFollower(newName: string): void {
    if (!newName || newName == undefined) {
      this.msg = "The username can not be empty";
      return;
    }
    this.mainService
      .addnewFollower(newName)
      .then(msg => {
        this.msg = msg;
        this.newName = "";
        this.ngOnInit();
      })
      .catch(msg => {
        this.msg = msg;
      });
  }

  unfollow(follow: Profile): void {
    this.mainService.unfollow(follow.username).then(() => {
      this.ngOnInit();
    });
  }
}
