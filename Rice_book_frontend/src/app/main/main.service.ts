import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Profile } from '../profile/profile';
import { Post } from './posts/post';
import { BehaviorSubject } from 'rxjs';
import { URL } from '../helper';
@Injectable({
  providedIn: 'root'
})
export class MainService {
  login_followers: Profile[];
  original_Users: Profile[];
  posts: any[];
  original_Posts: Post[];

  private dataSource = new BehaviorSubject<Profile[]>(undefined);
  private dataPosts = new BehaviorSubject<Post[]>(undefined);
  // private datalogin = new BehaviorSubject<Profile>(undefined);

  constructor(public http: HttpClient) { }

  showFollowers(): void {
    this.http
      .get<any>(URL.getfollowers + '/' + "loggedinUser")
      .subscribe(result => {
        var followers_name = ',';
        // console.log(result.following);
        result.following.forEach(elem => {
          var single = elem + ', ';
          followers_name = followers_name + single;
        });
        if (followers_name == ', ') {
          this.login_followers = [];
          this.dataSource.next(this.login_followers);
        } else {
          this.http
            .get<any>(URL.getprofiles + '/' + followers_name)
            .subscribe(res => {
              this.login_followers = res.result;
              this.dataSource.next(this.login_followers);
            });
        }
      });
  }

  getAllPost(): void {
    this.http.get<any>(URL.getAllPosts).subscribe(result => {
      this.posts = result.article;
      this.dataPosts.next(this.posts);
    });
  }

  helper(): void {
    this.dataPosts.next(this.posts);
  }

  send_profiles(): void {
    this.dataSource.next(this.login_followers);
  }

  getBSP(): BehaviorSubject<Post[]> {
    return this.dataPosts;
  }

  getBS(): BehaviorSubject<Profile[]> {
    return this.dataSource;
  }

  postArticle(postContent: string, postImage: string): void {
    this.http.post<any>(URL.postPost, { text: postContent, image: postImage }).subscribe((res) => {
      this.getAllPost();
    });
  }

  contains_current(arr: Profile[], name: string): boolean {
    for (let i = 0; (i = arr.length); i++) {
      if (arr[i].display_name === name) return true;
    }
    return false;
  }

  addnewFollower(username: string): any {
    return new Promise((resolve, reject) => {
      this.http
        .put<any>(URL.putfollower + '/' + username, undefined)
        .subscribe(result => {
          if (result.error == '1') {
            reject(result.msg);
          } else {
            resolve(result.msg);
          }
        });
    });
  }

  unfollow(delete_user: string): any {
    return new Promise((resolve, reject) => {
      this.http
        .delete<any>(URL.deleteFollower + '/' + delete_user, undefined)
        .subscribe((res) => {
          if (res)
            resolve();
          else
            reject();
        });
    });
  }

  updateSearchWord(keyword: string): void {
    let posts_copy = this.posts;
    posts_copy = posts_copy.filter(elem => {
      if (elem.author.includes(keyword) || elem.text.includes(keyword))
        return true;
      else return false;
    });
    this.dataPosts.next(posts_copy);
  }

  changePost(content: string, id: string): any {
    return new Promise((resolve, reject) => {
      this.http
        .put<any>(URL.putArticle + '/' + id, { text: content, commentId: '' })
        .subscribe(res => {
          if (res.msg == 'success') {
            this.posts = res.articles;
            resolve();
          } else {
            reject();
          }
        });
    });
  }

  changeComment(content: string, commentId: string, id: string): any {
    return new Promise((resolve, reject) => {
      this.http.put<any>(URL.putArticle + "/" + id, { text: content, commentId: commentId }).subscribe((res) => {
        if (res) {
          this.posts = res.articles;
          resolve();
        }
        else
          reject();
      })
    });
  }

  handleImageChange(event: any, formdata: any): any {
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
}
