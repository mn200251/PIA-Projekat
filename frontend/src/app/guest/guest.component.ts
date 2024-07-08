import { Component, OnInit } from '@angular/core';
import { User } from '../models/User';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { Restaurant } from '../models/Restaurant';
import { RestaurantService } from '../services/restaurant.service';
import { Reservation } from '../models/Reservation';
import { Order } from '../models/Order';

@Component({
  selector: 'app-guest',
  templateUrl: './guest.component.html',
  styleUrls: ['./guest.component.css']
})
export class GuestComponent implements OnInit {

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

    this.restaurantService.getRestaurants().subscribe(data => {
      this.restaurants = data
    })


    this.restaurantService.getOrders().subscribe(data => {
      this.activeOrders = data.filter(elem => {
        if (elem.username == this.user.username && elem.status == "Active")
          return true
        return false
      }).sort((a, b) => {
        return new Date(a.orderTime) < new Date(b.orderTime) ? 1 : -1
      })

    })
    

    this.userService.getUsers().subscribe(data => {
      this.waiters = data.filter(elem => {
        if (elem.type == "waiter")
          return true
        return false
      })
    })

    this.userService.getReservations(this.user.username).subscribe(data => {
      for (let i = 0; i < data.length; i++)
      {
        data[i].startTime = new Date(data[i].startTime)
        data[i].endTime = new Date(data[i].endTime)
      }

      this.activeReservations = data.filter(elem => {
        if (new Date(elem.endTime) > new Date())
          return true
        return false
      }).sort((a, b) => {
        return new Date(a.startTime) < new Date(b.startTime) ? -1 : 1
      })
      this.expiredReservations = data.filter(elem => {
        if (new Date(elem.endTime) < new Date())
          return true
        return false
      }).sort((a, b) => {
        return new Date(a.startTime) < new Date(b.startTime) ? -1 : 1
      })
    })
  }

  restaurantDetails(restaurant: Restaurant)
  {
    localStorage.setItem("restaurant", JSON.stringify(restaurant))

    this.router.navigate(["restaurantInformation"]);
  }

  page: number = 1
  user: User = new User()
  error: string = ""

  restaurants: Restaurant[] = []
  waiters: User[] = []

  sortColumn: keyof Restaurant = 'name';
  sortOrder: 'asc' | 'desc' = 'asc';

  searchName: string = '';
  searchAddress: string = '';
  searchType: string = '';

  expiredReservations: Reservation[] = []
  activeReservations: Reservation[] = []

  activeOrders: Order[] = []
  temp: any = {}

  navigateTo(newPage: number)
  {
    this.page = newPage
    localStorage.setItem("page", newPage.toString())
    window.location.reload()
  }

  async setPicture(event: any) {
    if (event.target.files[0])
    {
        this.temp = event.target.files[0];
        const formData = new FormData();
        formData.append('profilePicture', this.temp, this.temp.name);

        if (this.user && this.user.profilePicture != null && this.user.profilePicture != "" && this.user.profilePicture != "default.jpg")
          {
            this.user.profilePicture = await this.userService.uploadPicture(formData).toPromise();
          }

    }
  }

  updateInfo()
  {
    if (!this.user.forename || !this.user.surname || !this.user.address || !this.user.contactPhone ||
      !this.user.email || !this.user.creditCardNumber) {
      this.error = "Fields can not be empty!";
      return;
    }

    this.userService.updateInfo(this.user.username, this.user.forename, this.user.surname, this.user.address, this.user.email, 
      this.user.contactPhone, this.user.profilePicture, this.user.creditCardNumber).subscribe((data:any) => {
        if (data.msg === "User information updated successfully!")
        {
          localStorage.setItem("user", JSON.stringify(this.user))
        }

        alert(data.msg)
        window.location.reload();
    })
  }

  get sortedAndFilteredRestaurants(): Restaurant[] {
    return this.restaurants
      .filter(restaurant => 
        restaurant.name.toLowerCase().includes(this.searchName.toLowerCase()) &&
        restaurant.address.toLowerCase().includes(this.searchAddress.toLowerCase()) &&
        restaurant.type.toLowerCase().includes(this.searchType.toLowerCase())
      )
      .sort((a, b) => {
        const valueA = a[this.sortColumn];
        const valueB = b[this.sortColumn];
        let comparison = 0;
        if (valueA > valueB) {
          comparison = 1;
        } else if (valueA < valueB) {
          comparison = -1;
        }
        return this.sortOrder === 'asc' ? comparison : -comparison;
      });
  }

  setSort(column: keyof Restaurant): void {
    if (this.sortColumn === column) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortOrder = 'asc';
    }
  }


  isCancelButtonDisabled(reservation: Reservation): boolean {
    
    const expirationTime = new Date(reservation.startTime.getTime() + (45 * 60000)); // Adding 45 minutes to the start time
    
    //return expirationTime < new Date() || reservation.cancelledByUser == true || reservation.cancelledByWaiter == true;
    return expirationTime < new Date() || reservation.cancelledByWaiter == true;
  }

  tooCloseToCancel(reservation: Reservation): boolean {
    const expirationTime = new Date(reservation.startTime.getTime() + (45 * 60000)); // Adding 45 minutes to the start time
    return expirationTime < new Date();
  }

  alreadyCancelled(reservation: Reservation): boolean {
    // return reservation.cancelledByUser == true || reservation.cancelledByWaiter == true;
    return reservation.cancelledByWaiter == true
  }

  findRestaurantAddress(restaurantName: string): string {
    const restaurant = this.restaurants.find(restaurant => restaurant.name === restaurantName);
    return restaurant?.address ?? '';
  }

  /*
  cancelReservation(reservation: Reservation)
  {
    if (this.isCancelButtonDisabled(reservation)) {
      alert("You can't cancel reservation 45 minutes before it starts!")
      return;
    }

    if(reservation.cancelledByUser == true)
    {
        alert("This reservation has already been cancelled!")
        return;
    }

    if (confirm("Are you sure you want to cancel this reservation?"))
    {
      this.userService.cancelReservation(reservation).subscribe((data:any) => {
        alert(data.msg)
        window.location.reload();
      })
    }

  }
  */

  logout()
  {
    localStorage.removeItem("page")
    localStorage.removeItem("user")
    this.router.navigate([""])
  }
}
