import { Component } from '@angular/core';
import { User } from '../models/User';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-waiter',
  templateUrl: './waiter.component.html',
  styleUrls: ['./waiter.component.css']
})
export class WaiterComponent {
  constructor(private router:Router, private userService: UserService)
  {

  }

  ngOnInit(): void {
    let temp = localStorage.getItem("user")
    if(temp)
    {
      this.user = JSON.parse(temp);
    }
    else
    {
      this.router.navigate([""]);
    }


  }

  page: number = 1
  user: User = new User()
  error: string = ""

  navigateTo(newPage: number)
  {
    this.page = newPage
  }

  updateInfo()
  {
    if (!this.user.forename || !this.user.surname || !this.user.address || !this.user.contactPhone ||
      !this.user.email || !this.user.creditCardNumber) {
      this.error = "Fields can not be empty!";
      return;
    }

    this.userService.updateInfo(this.user.username, this.user.forename, this.user.surname, this.user.address, this.user.email, 
      this.user.contactPhone, this.user.creditCardNumber).subscribe((data:any) => {
        if (data.msg === "User information updated successfully!")
        {
          localStorage.setItem("user", JSON.stringify(this.user))
        }

        alert(data.msg)
        window.location.reload();
    })
  }
  
}
