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
    let p = localStorage.getItem("page")
    if (p)
      this.page = parseInt(p)

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
        // filter out deactivated or requested accounts
        this.users = data.filter(user => {
          return user.accountStatus !== -1 && user.accountStatus !== 0
        });
        this.requestedUsers = data.filter(user => user.accountStatus == 0)
      }

    })
  }

  page: number = 1
  users: User[] = []
  requestedUsers: User[] = []
  admin: User = new User()

  navigateTo(newPage: number)
  {
    this.page = newPage
    localStorage.setItem("page", newPage.toString())
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

  setStatus(user: User)
  {
    
    let newStatus = 0

    if (user.accountStatus == -2)
      newStatus = 1
    else if (user.accountStatus == 1)
      newStatus = -2

    this.userService.setStatus(user.username, newStatus).subscribe((data:any) => {
      alert(data.msg)
      window.location.reload();
    })
  }

  acceptUser(user: User)
  {
    this.userService.setStatus(user.username, 1).subscribe((data:any) => {
      alert(data.msg)
      window.location.reload();
    })
  }

  rejectUser(user:User)
  {
    this.userService.setStatus(user.username, -1).subscribe((data:any) => {
      alert(data.msg)
      window.location.reload();
    })
  }

  logout()
  {
    localStorage.removeItem("page")
    localStorage.removeItem("user")
    this.router.navigate([""])
  }
}
