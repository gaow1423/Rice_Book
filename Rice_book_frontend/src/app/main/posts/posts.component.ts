import { Component, OnInit } from '@angular/core';
import { MainService } from '../main.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {
  author: string = 'weigao';
  posts: any[];
  comments: any[];
  searchTarget: string = '';
  postContent: string = '';
  newArticle: string = '';
  newComment: string = '';
  comment_error: string = "";
  postImage: string = "https://www.publicdomainpictures.net/pictures/30000/nahled/plain-white-background.jpg";
  addComment: string = "";
  constructor(private mainService: MainService) { }

  ngOnInit() {
    this.mainService.getAllPost();
    this.getarticles();
  }

  getarticles(): void {
    this.mainService.getBSP().subscribe(post => {

      if (post != undefined) {
        this.posts = post;
      }

    });
  }

  postArticle(postContent: string, postImage: string): void {
    this.mainService.postArticle(postContent, postImage);
    this.postContent = '';
    this.postImage = "https://www.publicdomainpictures.net/pictures/30000/nahled/plain-white-background.jpg";
  }

  Cancel(postContent: string): void {
    this.postContent = '';
  }

  updateSearchWord(keyword: string): void {
    this.mainService.updateSearchWord(keyword);
  }

  changePost(content: string, id: string): void {
    this.mainService.changePost(content, id).then(res => {
      this.ngOnInit();
      this.newArticle = '';
    });
  }

  changeComment(content: string, commentId: string, id: string): any {
    if (content == undefined || !content) {
      this.comment_error = "The comment can not be empty!"
    }
    else {
      this.mainService.changeComment(content, commentId, id).then((res) => {
        this.addComment = "";
        this.ngOnInit();
      });
    }
  }

  handleImageChange(event: any): void {
    var file = event.srcElement.files[0];
    var form = new FormData();
    form.append("image", file);
    form.append("title", file.name);
    this.mainService.handleImageChange(event, form).then((res) => {
      this.postImage = res.url;
    });
  }
}
