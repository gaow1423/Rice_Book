import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FollowingService {
  constructor(private http: HttpClient) {}

  getfollowers() {
    return this.http.get('../../assets/followers.json');
  }
}
