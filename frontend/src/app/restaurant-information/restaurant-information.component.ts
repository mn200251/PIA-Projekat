import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/User';
import { Restaurant, Table, WorkingHours } from '../models/Restaurant';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RestaurantService } from '../services/restaurant.service';

@Component({
  selector: 'app-restaurant-information',
  templateUrl: './restaurant-information.component.html',
  styleUrls: ['./restaurant-information.component.css']
})
export class RestaurantInformationComponent implements OnInit {

  constructor(private router: Router, private fb: FormBuilder, private resturantService: RestaurantService)
  {

  }

  ngOnInit(): void {
    this.reservationForm = this.fb.group({
      date: ['', Validators.required],
      time: ['', Validators.required],
      numberOfPeople: ['', [Validators.required, Validators.min(1)]],
      additionalRequests: ['']
    });

    let temp = localStorage.getItem("user")
    if(temp)
    {
      this.user = JSON.parse(temp);

      if (this.user.type != "guest")
      {
        localStorage.removeItem("user")
        this.router.navigate([""]);
      }
      if (this.user.accountStatus != 1)
      {
        alert("This account is not active!")
        localStorage.removeItem("user")
        this.router.navigate([""]);
      }
    }
    else
    {
      this.router.navigate([""]);
    }

    let temp2 = localStorage.getItem("restaurant")
    if (temp2)
    {
        this.restaurant = JSON.parse(temp2);
    }
    else
    {
      alert("Error retrieving restaurant information! Returning to Home...");
      this.router.navigate([""]);
    }
  }

  user: User = new User()
  restaurant: any = null

  reservationForm: FormGroup = this.fb.group({
    date: ['', Validators.required],
    time: ['', Validators.required],
    numberOfPeople: ['', [Validators.required, Validators.min(1)]],
    additionalRequests: ['']
  });

  feedbackMessage: string = '';

  onSubmit(): void {
    if (this.reservationForm && this.reservationForm.valid) {
      const reservation = this.reservationForm.value;
      this.validateReservation(reservation);
    } else {
      this.feedbackMessage = 'Please fill in all required fields.';
    }
  }

  validateReservation(reservation: any): void {
    const selectedDate = new Date(reservation.date);

    const currDate = new Date();
    if (selectedDate < currDate) {
      alert("The selected date is in the past.")
      this.feedbackMessage = 'The selected date is in the past.';
      return;
    }

    console.log(selectedDate)
    const dayOfWeek = selectedDate.toLocaleString('en-US', { weekday: 'long' }).toLowerCase();
    console.log(dayOfWeek)
    const workingHours = this.restaurant.workingHours.find((hours:WorkingHours) => hours.day.toLowerCase() === dayOfWeek);

    if (!workingHours) {
      alert("The restaurant is closed on the selected day.")
      this.feedbackMessage = 'The restaurant is closed on the selected day.';
      return;
    }
    
    const [hours, minutes] = reservation.time.split(':').map(Number);
    selectedDate.setHours(hours, minutes);
    console.log("startTime:", selectedDate);

    const endTime = new Date(selectedDate.getTime() + 3 * 60 * 60 * 1000);
    console.log("endTime:", endTime);

    const openTime = this.convertToMinutes(workingHours.open);
    const closeTime = this.convertToMinutes(workingHours.close);
    const reservationTime = this.convertToMinutes(reservation.time);
    const reservationEndTime = reservationTime + 3 * 60;

    if (reservationTime < openTime || reservationEndTime > closeTime) {
        alert("The restaurant is not open for 3 hours from the selected time.")
        this.feedbackMessage = 'The restaurant is not open for 3 hours from the selected time.';
        return;
    }

    const availableTable = this.restaurant.layout.tables.find((table:Table) => table.maxPeople >= reservation.numberOfPeople);

    if (!availableTable) {
      alert("No available table for the selected number of people.")
      this.feedbackMessage = 'No available table for the selected number of people.';
      return;
    }

    this.feedbackMessage = '';

    reservation.username = this.user.username
    reservation.restaurantName = this.restaurant.name
    reservation.startTime = selectedDate
    reservation.endTime = endTime
    // reservation.table.id ???

    this.resturantService.addReservation(reservation).subscribe((data:any) => {

      if(data.msg == "Success!")
      {
          alert(data.msg)
          this.router.navigate(["guest"])
          return;
      }
      alert(data.msg)
      this.feedbackMessage = data.msg
    })

  }

  convertToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }


  navigateTo(newPage: number)
  {
    localStorage.setItem("page", newPage.toString())
    this.router.navigate(["guest"]) 
  }

  logout()
  {
    localStorage.removeItem("page")
    localStorage.removeItem("user")
    this.router.navigate([""])
  }
}
