import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MainService } from '../main.service';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  constructor(private http: HttpClient, private mainService: MainService) {}

  getarticles() {
    return this.http.get('../../assets/articles.json');
  }
}
