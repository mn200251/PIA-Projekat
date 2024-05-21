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

  register(
    username: string,
    password: string,
    forename: string,
    surname: string,
    sex: string,
    type: string,
    address: string,
    email: string,
    contactPhone: number,
    securityQuestion: string,
    securityAnswer: string,
    // profilePicure: any,
    creditCardNumber: number)
  {
    const data= {
      username: username,
      password: password,
      forename: forename,
      surname: surname,
      sex: sex,
      type: type,
      address: address,
      email: email,
      contactPhone: contactPhone,
      securityQuestion: securityQuestion,
      securityAnswer: securityAnswer,
      // profilePicure: profilePicure,
      creditCardNumber: creditCardNumber,
    }

    return this.http.post<string>('http://localhost:4000/users/register', data);
  }

  updateInfo(
    username: string,
    forename: string,
    surname: string,
    address: string,
    email: string,
    contactPhone: number,
    // profilePicure: any,
    creditCardNumber: number)
  {
    const data= {
      username: username,
      forename: forename,
      surname: surname,
      address: address,
      email: email,
      contactPhone: contactPhone,
      // profilePicure: profilePicure,
      creditCardNumber: creditCardNumber,
    }

    return this.http.post<string>('http://localhost:4000/users/updateInfo', data);
  }

  getUsers()
  {
    return this.http.get<User[]>('http://localhost:4000/users/getUsers');
  }

  setBan(username: string, banned: boolean)
  {
    const data= {
      username: username,
      banned: banned
    }

    return this.http.post<string>('http://localhost:4000/users/setBan', data);
  }
}
