import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  login(username: string, password: string)
  {
    const data= {
      username: username,
      password: password,
    }

    return this.http.post<User>('http://localhost:4000/users/login', data);
  }
}
