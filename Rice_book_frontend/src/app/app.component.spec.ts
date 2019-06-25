import {
  TestBed,
  async,
  ComponentFixture,
  fakeAsync,
  tick
} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { routes } from 'src/app/app-routing.module';
import { routerNgProbeToken } from '@angular/router/src/router_module';
import { Location } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { ProfileComponent } from 'src/app/profile/profile.component';
import { AppComponent } from 'src/app/app.component';
import { MainComponent } from 'src/app/main/main.component';
import { AuthComponent } from 'src/app/auth/auth.component';
import { LoginComponent } from 'src/app/auth/login/login.component';
import { RegisterationComponent } from './auth/registeration/registeration.component';

import { Profile } from 'src/app/profile/profile';
import { Error_msg } from 'src/app/profile/error_msg';
import { FollowingComponent } from './main/following/following.component';
import { PostsComponent } from './main/posts/posts.component';
import { LoginService } from './auth/login/login.service';
import { PostsService } from './main/posts/posts.service';
import { MainService } from './main/main.service';
import { DebugHelper } from 'protractor/built/debugger';
import { ProfileService } from './profile/profile.service';

const profiles = require('src/assets/profile.json');
const posts = require('src/assets/articles.json');

describe('Ricebook Tests', () => {
  let location: Location;
  let router: Router;

  let loginService: LoginService;
  let postsService: PostsService;
  let mainService: MainService;
  let profileService: ProfileService;

  let loginComponent: LoginComponent;
  let login_fixture: ComponentFixture<LoginComponent>;
  let profileComponent: ProfileComponent;
  let profile_fixture: ComponentFixture<ProfileComponent>;
  let mainComponent: MainComponent;
  let main_fixture: ComponentFixture<MainComponent>;
  let postsComponent: PostsComponent;
  let posts_fixture: ComponentFixture<PostsComponent>;
  let followingComponent: FollowingComponent;
  let following_fixture: ComponentFixture<FollowingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        LoginComponent,
        AuthComponent,
        MainComponent,
        ProfileComponent,
        RegisterationComponent,
        FollowingComponent,
        PostsComponent
      ],
      imports: [
        RouterModule,
        FormsModule,
        HttpClientModule,
        RouterTestingModule.withRoutes(routes)
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    router = TestBed.get(Router);
    location = TestBed.get(Location);
    router.initialNavigation();

    login_fixture = TestBed.createComponent(LoginComponent);
    main_fixture = TestBed.createComponent(MainComponent);
    posts_fixture = TestBed.createComponent(PostsComponent);
    profile_fixture = TestBed.createComponent(ProfileComponent);
    following_fixture = TestBed.createComponent(FollowingComponent);

    loginComponent = login_fixture.componentInstance;
    mainComponent = main_fixture.componentInstance;
    postsComponent = posts_fixture.componentInstance;
    profileComponent = profile_fixture.componentInstance;
    followingComponent = following_fixture.componentInstance;

    login_fixture.detectChanges();
    main_fixture.detectChanges();
    posts_fixture.detectChanges();
    profile_fixture.detectChanges();
    following_fixture.detectChanges();

    loginService = TestBed.get(LoginService);
    postsService = TestBed.get(PostsService);
    mainService = TestBed.get(MainService);
    profileService = TestBed.get(ProfileService);

    loginService.registered_Users = profiles;
    profileService.registered_Users = profiles;
    mainService.posts = posts;
    mainService.original_Posts = posts;
    mainService.registered_Users = profiles;
    mainService.original_Users = profiles;
  });

  it('Test1: should log in a previously registered user (not new users)', fakeAsync(() => {
    //should log in a previously registered user (not new users)
    let newuser = new Profile();
    newuser.username = profiles[0].username;
    newuser.password = profiles[0].password;
    loginComponent.validation_login(newuser);
    tick();
    expect(location.path()).toBe('/main');
  }));

  it('Test2: should not log in an invalid user', fakeAsync(() => {
    //should not log in an invalid user
    let invalid_User = new Profile();
    //Unregistered User
    invalid_User.username = 'invalid_user';

    loginComponent.validation_login(invalid_User);
    tick();
    expect(location.path()).not.toBe('/main');

    //registered User with wrong password
    invalid_User.username = profiles[0].username;
    invalid_User.password = 'jfiejfie';
    loginComponent.validation_login(invalid_User);
    tick();
    expect(location.path()).not.toBe('/main');
  }));

  it('Test3: should update error message (for displaying login error mesage to user)', fakeAsync(() => {
    //user login with wrong password
    let invalid_User = new Profile();
    invalid_User.username = profiles[0].username;
    invalid_User.password = 'wrong password';
    loginComponent.validation_login(invalid_User);
    tick();
    expect(loginService.error_login['username']).toBeDefined();

    //user login with unfilled fields
    invalid_User = new Profile();
    invalid_User.username = undefined;
    invalid_User.password = undefined;
    loginComponent.validation_login(invalid_User);
    tick();
    expect(loginService.error_login['username']).toBeDefined();
    expect(loginService.error_login['password']).toBeDefined();
  }));

  it('Test4: should log out a user (login state should be cleared)', fakeAsync(() => {
    let newuser = new Profile();
    newuser.username = profiles[0].username;
    newuser.password = profiles[0].password;
    loginComponent.validation_login(newuser);
    mainComponent.clearStorage();
    tick();
    expect(localStorage.getItem('current_user')).toBeNull();
  }));

  it('Test5: should fetch articles for current logged in user', fakeAsync(() => {
    let newuser = new Profile();
    newuser.username = profiles[0].username;
    newuser.password = profiles[0].password;
    loginComponent.validation_login(newuser);

    tick();
    expect(location.path()).toBe('/main');
    mainService.helper();
    expect(postsComponent.posts.length > 0).toBeTruthy;
  }));

  it('Test6 && Test 7: should update the search keyword, should filter displayed articles by the search keyword', fakeAsync(() => {
    let newuser = new Profile();
    newuser.username = profiles[0].username;
    newuser.password = profiles[0].password;
    loginComponent.validation_login(newuser);

    tick();
    expect(location.path()).toBe('/main');
    postsComponent.updateSearchWord(profiles[0].username);
    tick();
    for (let i = 0; i < postsComponent.posts.length; i++) {
      expect(
        postsComponent.posts[i].name.includes(profiles[0].username) ||
          postsComponent.posts[i].text.includes(profiles[0].username)
      ).toBeTruthy;
    }
  }));

  it('Test 8: should add articles when adding a follower', fakeAsync(() => {
    let newuser = new Profile();
    newuser.username = profiles[0].username;
    newuser.password = profiles[0].password;
    loginComponent.validation_login(newuser);
    tick();
    expect(location.path()).toBe('/main');
    let unfollow = new Profile();
    unfollow.username = profiles[1].username;
    unfollow.password = profiles[1].password;
    followingComponent.unfollow(unfollow);

    //unfollow followers
    for (let i = 0; i < postsComponent.posts.length; i++) {
      expect(
        !postsComponent.posts[i].name.includes(profiles[1].username) &&
          !postsComponent.posts[i].text.includes(profiles[1].username)
      ).toBeTruthy;
    }

    //add new followers
    let newUser = unfollow;
    followingComponent.addNewFollower(newUser.username);

    let exist = false;
    for (let i = 0; i < postsComponent.posts.length; i++) {
      if (postsComponent.posts[i].name.includes(newUser.username)) exist = true;
    }
    expect(exist).toBeTruthy;
  }));

  it('Test 9: should remove articles when removing a follower', fakeAsync(() => {
    let newuser = new Profile();
    newuser.username = profiles[0].username;
    newuser.password = profiles[0].password;
    loginComponent.validation_login(newuser);
    tick();
    expect(location.path()).toBe('/main');

    //unfollow followers
    let unfollow = new Profile();
    unfollow.username = profiles[1].username;
    unfollow.password = profiles[1].password;
    followingComponent.unfollow(unfollow);

    for (let i = 0; i < postsComponent.posts.length; i++) {
      expect(
        !postsComponent.posts[i].name.includes(profiles[1].username) &&
          !postsComponent.posts[i].text.includes(profiles[1].username)
      ).toBeTruthy;
    }
  }));

  it('Test 10: should fetch the logged in users profile information', fakeAsync(() => {
    let newuser = new Profile();
    newuser.username = profiles[0].username;
    newuser.password = profiles[0].password;
    loginComponent.validation_login(newuser);
    tick();
    expect(location.path()).toBe('/main');

    profileComponent.Gotoprofile();
    tick();
    profileService.send_info();

    let newprofile = new Profile();
    for (let i = 0; i < profiles.length; i++) {
      if (profiles[i].username == localStorage.getItem('current_user')) {
        newprofile = profiles[i];
        break;
      }
    }
    expect(profileComponent.profile.username).toBe(newprofile.username);
    expect(profileComponent.profile.password).toBe(newprofile.password);
    expect(profileComponent.profile.display_name).toBe(newprofile.display_name);
    expect(profileComponent.profile.email_address).toBe(
      newprofile.email_address
    );
    expect(profileComponent.profile.phone_number).toBe(newprofile.phone_number);
    expect(profileComponent.profile.DOB).toBe(newprofile.DOB);
    expect(profileComponent.profile.zipcode).toBe(newprofile.zipcode);
  }));
});
