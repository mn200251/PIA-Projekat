import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/User';
import { Reservation } from '../models/Reservation';

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

  setStatus(username: string, accountStatus: number)
  {
    const data= {
      username: username,
      accountStatus: accountStatus
    }

    return this.http.post<string>('http://localhost:4000/users/setStatus', data);
  }

  resetPasswordKnow(username: string, oldPassword: string, newPassword: string)
  {
    const data= {
      username: username,
      oldPassword: oldPassword,
      newPassword: newPassword
    }

    return this.http.post<string>('http://localhost:4000/users/resetPasswordKnow', data);
  }

  getSecurityDetails(username: string)
  {
    const data= {
      username: username,
    }

    return this.http.post<User>('http://localhost:4000/users/getSecurityDetails', data);
  }

  resetPasswordDontKnow(username: string, newPassword: string)
  {
    const data= {
      username: username,
      newPassword: newPassword
    }

    return this.http.post<string>('http://localhost:4000/users/resetPasswordDontKnow', data);
  }

  getReservations(username: string)
  {
    const data= {
      username: username,
    }

    return this.http.post<Reservation[]>('http://localhost:4000/users/getReservations', data);
  }
}
