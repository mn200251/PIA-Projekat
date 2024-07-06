import { Component } from '@angular/core';
import { User } from '../models/User';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { Reservation } from '../models/Reservation';
import { RestaurantService } from '../services/restaurant.service';
import { Restaurant } from '../models/Restaurant';
import { Order } from '../models/Order';

@Component({
  selector: 'app-waiter',
  templateUrl: './waiter.component.html',
  styleUrls: ['./waiter.component.css']
})
export class WaiterComponent {
  constructor(private router:Router, private userService: UserService, private restaurantService: RestaurantService)
  {

  }

  ngOnInit(): void {
    let p = localStorage.getItem("page")
    if (p)
      this.page = parseInt(p)

    let temp = localStorage.getItem("user")
    if(temp)
    {
      this.user = JSON.parse(temp);

      if (this.user.type != "waiter")
      {
        localStorage.removeItem("user")
        this.router.navigate([""]);
      }

      if (this.user.accountStatus != 1)
      {
        this.error = "This account is not active!"
        localStorage.removeItem("user")
        this.router.navigate([""]);
      }

    }
    else
    {
      this.router.navigate([""]);
    }

    this.restaurantService.getReservations().subscribe(data => {
      this.reservations = data
      .filter((reservation: Reservation) => 
        reservation.restaurantName === this.user.worksAt)
      .filter((reservation: Reservation) =>
        {
          return reservation.cancelledByWaiter == false
        })
      .sort((a: Reservation, b: Reservation) => {
          return a.startTime < b.startTime ? 1 : -1;
        })

      this.reservations.forEach((reservation: Reservation) => {
        reservation.startTime = new Date(reservation.startTime)
        reservation.endTime = new Date(reservation.endTime)

        this.restaurantService.getAvailableTables(reservation.restaurantName, reservation.startTime, 
          reservation.endTime, reservation.numberOfPeople).subscribe((data: number[]) => {
            reservation.availableTables = data
          })
      })

      this.pendingReservations = this.reservations.filter((reservation: Reservation) => 
        reservation.confirmedByWaiter === "")
          

      this.acceptedReservations = this.reservations.filter((reservation: Reservation) => 
        reservation.confirmedByWaiter == this.user.username)
    })

    this.restaurantService.getOrders().subscribe(data => {
      this.orders = data.filter((order: Order) => order.restaurantName === this.user.worksAt)
      .filter((order: Order) => order.status === "Pending").sort((a: Order, b: Order) => {
        return a.orderTime < b.orderTime ? -1 : 1;
      })

      this.orders.forEach((order: Order) => {
        order.orderTime = new Date(order.orderTime)
      })
    })

  }

  page: number = 1
  user: User = new User()
  error: string = ""

  reservations: Reservation[] = []
  pendingReservations: Reservation[] = []
  acceptedReservations: Reservation[] = []
  orders: Order[] = []

  navigateTo(newPage: number)
  {
    this.page = newPage
    localStorage.setItem("page", newPage.toString())
    window.location.reload()
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

  confirmReservation(reservation: Reservation)
  {
    if (reservation.tableId == null)
    {
      alert("Please select a table!");
      return;
    }

    reservation.confirmedByWaiter = this.user.username
    this.restaurantService.confirmReservation(reservation).subscribe((data:any) => {
      alert(data.msg)

      if (data.msg == "Success!")
      {
          window.location.reload();
      }
    })
  }

  rejectReservation(reservation: Reservation)
  {
    this.restaurantService.rejectReservation(reservation).subscribe((data:any) => {
      alert(data.msg)
      window.location.reload();
    })
  }

  showedUp(reservation: Reservation, showedUp: number)
  {
   if (new Date() < new Date(reservation.endTime.getTime() + 30 * 60000))
   {
     alert("You cant confirm guest attendance yet!")
     return;
   }

   if (showedUp == 1)
    reservation.showedUp = 1;
   else
    reservation.showedUp = -1;

    this.restaurantService.showedUp(reservation).subscribe((data:any) => {
      alert(data.msg)

      if (data.msg == "Success!")
        window.location.reload();
    })

  }

  extendTime(reservation: Reservation)
  {
    // reservation.endTime = new Date(reservation.endTime)
    // reservation.endTime.setHours(reservation.endTime.getHours() + 1)
  }

  setDeliveryTime(order: Order)
  {
    if (order.estimatedTime == "")
    {
      alert("Please enter estimated delivery time!")
      return;
    }
    order.status = "Active"

    this.restaurantService.updateDelivery(order).subscribe((data:any) => {
      alert(data.msg)
      window.location.reload();
    })
  }

  cancelDelivery(order: Order)
  {
    order.status = "Cancelled"
    order.estimatedTime = ""

    this.restaurantService.updateDelivery(order).subscribe((data:any) => {
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
