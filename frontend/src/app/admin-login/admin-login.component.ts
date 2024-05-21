import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent {

  constructor(private userService: UserService, private router: Router){

  }

  username: string = ""
  password: string = ""
  type: string = ""
  error: string = ""



  adminLogin()
  {
    if (this.username == "" || this.password == "")
    {
      this.error = "Unesite sve podatke!";
      return;
    }

    this.userService.login(this.username, this.password).subscribe(data =>{
      if (data)
      {
        if (data.type != "admin")
        {
          this.error = "User is not admin!"
          return
        }


        this.error = ""
        localStorage.setItem("user", JSON.stringify(data))
        this.router.navigate([data.type]);
      }
      else
      {
        this.error = "User with that password doesn't exist!"
      }
    })
  }
}
