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

  oldPassword: string = ""
  newPassword: string = ""
  confirmNewPassword: string = ""

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
    this.contactPhone = null
    this.email = ""
    this.profilePicure = null
    this.creditCardNumber = null

    this.oldPassword = ""
    this.newPassword = ""
    this.confirmNewPassword = ""
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
        this.error = "User with that password doesn't exist!"
      }
    })
  }

  forename = ""
  surname = ""
  securityQuestion = ""
  securityAnswer = ""
  sex = ""
  address = ""
  contactPhone: number | null = null
  email = ""
  profilePicure: any | null = null
  creditCardNumber: number | null = null


  register()
  {
    if (!this.username || !this.password || !this.securityQuestion || !this.securityAnswer ||
      !this.forename || !this.surname || !this.sex || !this.address || !this.contactPhone ||
      !this.email || !this.creditCardNumber) {
      this.error = "Please fill in all the required fields.";
      return;
    }

    // check if password is correct format
    const passwordPattern = /^(?=[A-Za-z])(?=.*[A-Z])(?=(?:.*[a-z]){3,})(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,10}$/
    ;

    if (passwordPattern.test(this.password)) {
      this.error = "Password must be 6-10 characters long, start with a letter, contain at least 1 capital letter, at least 3 small letters, 1 number, and 1 special character.";
      return;
    }

    // check if picture is correct format
    if (this.profilePicure && this.profilePicure.files.length > 0) {
      const file = this.profilePicure.files[0];
      const validImageTypes = ['image/jpeg', 'image/png'];
      if (!validImageTypes.includes(file.type)) {
        this.error = "Profile picture must be in JPG or PNG format.";
        return;
      }
      const img = new Image();
      img.onload = () => {
        if (img.width < 100 || img.height < 100 || img.width > 300 || img.height > 300) {
          this.error = "Profile picture dimensions must be between 100x100px and 300x300px.";
          return;
        } else {
          this.error = ""; // Clear error if all checks pass
          // this.completeRegistration();
        }
      };
    

      // ???
      const reader = new FileReader();
        reader.onload = (e: any) => {
          img.src = e.target.result;
        };
        reader.readAsDataURL(file);
      } 
      // no picture provided
      else {
        this.userService.register(this.username,
          this.password,
          this.forename,
          this.surname,
          this.sex,
          this.type,
          this.address,
          this.email,
          this.contactPhone,
          this.securityQuestion,
          this.securityAnswer,
          // this.profilePicure,
          this.creditCardNumber)
          .subscribe((data:any) => {
            this.clear()
            alert(data.msg)
        })
      }



  }

  resetKnow()
  {

  }

  resetDontKnow(step: number)
  {

  }
}
