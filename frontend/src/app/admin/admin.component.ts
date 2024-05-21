import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/User';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit{

  constructor(private router: Router, private userService: UserService)
  {

  }

  ngOnInit(): void {
    let temp = localStorage.getItem("user")
    if(temp)
    {
      this.admin = JSON.parse(temp);

      if (this.admin.type != "admin")
      {
        localStorage.removeItem("user")
        this.router.navigate([""]);
      }
    }
    else
    {
      this.router.navigate([""]);
    }

    // page 1 - list all users
    this.userService.getUsers().subscribe(data => {
      if (data)
      {
        this.users = data
      }

    })
  }

  page: number = 1
  users: User[] = []
  admin: User = new User()

  navigateTo(newPage: number)
  {
    this.page = newPage
  }

  updateInfo(user:User)
  {
    if (!user.forename || !user.surname || !user.address || !user.contactPhone ||
      !user.email || !user.creditCardNumber) {
      alert("Fields can not be empty!");
      return;
    }

    this.userService.updateInfo(user.username, user.forename, user.surname, user.address, user.email, 
      user.contactPhone, user.creditCardNumber).subscribe((data:any) => {
        alert(data.msg)
        window.location.reload();
    })
  }

  setBan(user: User)
  {
    this.userService.setBan(user.username, !user.banned).subscribe((data:any) => {
      alert(data.msg)
      window.location.reload();
    })
  }

  logout()
  {
    localStorage.removeItem("user")
    this.router.navigate([""])
  }
}
