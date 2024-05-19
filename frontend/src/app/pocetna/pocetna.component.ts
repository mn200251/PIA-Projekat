import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-pocetna',
  templateUrl: './pocetna.component.html',
  styleUrls: ['./pocetna.component.css']
})
export class PocetnaComponent {

  constructor(private userService: UserService, private router: Router)
  {

  }
  page: number = 0

  username: string = ""
  password: string = ""
  type: string = ""
  error: string = ""

  navigateTo(newPage: number)
  {
    this.clear()

    this.page = newPage
  }

  // clear all fields that are shared with login/register when switching
  clear()
  {
    this.username = ""
    this.password = ""
    this.type = ""
    this.error = ""

    this.forename = ""
    this.surname = ""
    this.securityQuestion = ""
    this.securityAnswer = ""
    this.sex = ""
    this.address = ""
    this.contactPhone = 0
    this.email = ""
    this.profilePicure = null
    this.creditCardNumber = 0
  }


  login()
  {
    if (this.username == "" || this.password == "")
    {
      this.error = "Unesite sve podatke!";
      return;
    }

    this.userService.login(this.username, this.password).subscribe(data =>{
      if (data)
      {
        this.error = ""
        localStorage.setItem("user", JSON.stringify(data))
        this.router.navigate([data.type]);
      }
      else
      {
        this.error = "Nepostojeci korisnik!"
      }
    })
  }

  forename = ""
  surname = ""
  securityQuestion = ""
  securityAnswer = ""
  sex = ""
  address = ""
  contactPhone = 0
  email = ""
  profilePicure: File | null = null
  creditCardNumber = 0


  register()
  {

  }
}
