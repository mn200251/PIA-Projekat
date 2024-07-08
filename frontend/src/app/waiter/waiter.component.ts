import { Component } from '@angular/core';
import { User } from '../models/User';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { Reservation } from '../models/Reservation';
import { RestaurantService } from '../services/restaurant.service';
import { Layout, Restaurant } from '../models/Restaurant';
import { Order } from '../models/Order';

import * as Highcharts from 'highcharts';

import * as moment from 'moment';

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

    // barchart
    this.restaurantService.getReservations().subscribe(data => {
      this.barChartRes = data
      .filter((reservation: Reservation) => 
        reservation.restaurantName === this.user.worksAt)
      .filter((reservation: Reservation) =>
        {
          return reservation.cancelledByWaiter == false
        })
      .sort((a: Reservation, b: Reservation) => {
          return a.startTime < b.startTime ? 1 : -1;
        })

      this.barChartRes.forEach((reservation: Reservation) => {
          reservation.startTime = new Date(reservation.startTime)
          reservation.endTime = new Date(reservation.endTime)
        })

        let tempReservationsForUser = this.barChartRes.filter(reservation => {
          return reservation.confirmedByWaiter == this.user.username
        })

        let barchartData = [
          tempReservationsForUser.filter(reservation => reservation.startTime.getDay() == 0).length,
          tempReservationsForUser.filter(reservation => reservation.startTime.getDay() == 1).length,
          tempReservationsForUser.filter(reservation => reservation.startTime.getDay() == 2).length,
          tempReservationsForUser.filter(reservation => reservation.startTime.getDay() == 3).length,
          tempReservationsForUser.filter(reservation => reservation.startTime.getDay() == 4).length,
          tempReservationsForUser.filter(reservation => reservation.startTime.getDay() == 5).length,
          tempReservationsForUser.filter(reservation => reservation.startTime.getDay() == 6).length,
        ]
        

        this.barChartPromenljiva = barchartData

        this.summonBarChart()
        // use barchartData to create barchart
    })
    //barchart end

    
    // pita diagram
    this.userService.getUsers().subscribe((data:User[]) => {
      this.allPitaUsers = data.filter(user => user.worksAt == this.user.worksAt)
                .filter(user => user.type == "waiter")

      let pitaDiagramData:any = []

      this.allPitaUsers.forEach(pitaUser => {
        this.restaurantService.getReservations().subscribe(data => {
          let tempReservations = data.filter(reservation => reservation.confirmedByWaiter == pitaUser.username)
            .filter(reservation => reservation.restaurantName == this.user.worksAt)

            let userData = { name: pitaUser.username, y: tempReservations.length };
            pitaDiagramData.push(userData);

            if (pitaDiagramData.length === this.allPitaUsers.length) {
              this.summonPieChart(pitaDiagramData);
            }
        })
      });

      // this.pieChartPromenljiva = pitaDiagramData

      // this.summonPieChart(pitaDiagramData)
      
    })
    // pita diagram end

    this.loadReservations()

    this.restaurantService.getRestaurants().subscribe(data => {
    
      const restaurant = data.find(restaurant => restaurant.name === this.user.worksAt);
      if (restaurant) {
        this.drawLayout(restaurant.layout);
      }
    });
  }

  page: number = 1
  user: User = new User()
  error: string = ""

  reservations: Reservation[] = []
  pendingReservations: Reservation[] = []
  acceptedReservations: Reservation[] = []
  orders: Order[] = []

  barChartRes: Reservation[] = []
  allPitaUsers: User[] = []
  allHistogramReservations: Reservation[] = []

  barChartPromenljiva:number[] = []
  pieChartPromenljiva:number[] = []
  histogramData:any[] = []

  temp: any = {}

  ctx: CanvasRenderingContext2D | null = null;
  objectType: string = '';



  loadReservations(): void {
    this.restaurantService.getReservations().subscribe(data => {
      this.allHistogramReservations = data
        .filter(reservation => reservation.restaurantName === this.user.worksAt)
        .filter(reservation => reservation.showedUp === 1)
        .sort((a: Reservation, b: Reservation) => a.startTime < b.startTime ? -1 : 1);
  
      const twentyFourMonthsAgo = moment().subtract(24, 'months').toDate();
  
      this.allHistogramReservations = this.allHistogramReservations
        .filter(reservation => new Date(reservation.startTime) > twentyFourMonthsAgo);
  
      const dayOfWeekMap = new Map<number, { count: number, total: number }>();
  
      this.allHistogramReservations.forEach(reservation => {
        const dayOfWeek = new Date(reservation.startTime).getDay();
        if (!dayOfWeekMap.has(dayOfWeek)) {
          dayOfWeekMap.set(dayOfWeek, { count: 0, total: 0 });
        }
        const dayData = dayOfWeekMap.get(dayOfWeek)!;
        dayData.count += 1;
        dayData.total += 1;
      });
  
      this.histogramData = Array.from(dayOfWeekMap.entries()).map(([day, data]) => {
        return {
          day: moment().day(day).format('ddd'),
          average: data.count / (24 * 4) // 24 months * 4 weeks/month
        };
      });
  
      this.renderHistogram();
    });
  }
  
  renderHistogram(): void {
    const data = this.histogramData.map(data => data.average);
    const categories = this.histogramData.map(data => data.day);
  
    Highcharts.chart('histogram-chart', {
      chart: {
        type: 'column'
      },
      title: {
        text: 'Average Reservations per Day of the Week'
      },
      xAxis: {
        categories: categories,
        title: {
          text: 'Day of the Week'
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Average Reservations'
        }
      },
      series: [{
        type: 'column',
        name: 'Average Reservations',
        data: data
      }],
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0
        }
      }
    } as Highcharts.Options);
  }
  
  
  

  summonBarChart()
  {
    const data = this.barChartPromenljiva
    const kategorije = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

    const options: Highcharts.Options = {
        chart: {
          type: 'column',
        },
        title: {
          text: 'Number of guests per day for: ' + this.user.username,
        },
        xAxis: {
          categories: kategorije,
        },
        yAxis: {
          title: {
            text: 'Number of guests',
          },
        },
        series: [
          {
            type: 'column',
            name: 'Days',
            data: data,
          },
         
        ],
      };
  
      Highcharts.chart('guest-chart', options);
    
  }

  summonPieChart(data: any) {

    console.log(data)
    Highcharts.chart('pie-chart', {
      chart: {
        type: 'pie',
      },
      title: {
        text: 'Guest Distribution by Waiter',
      },
      series: [
        {
          type: 'pie',
          name: 'Guest Distribution',
          data: data,
        },
      ],
    });
  }

  drawLayout(layout: Layout) {
    const canvas = document.getElementById('layoutCanvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      return;
    }

    // Clear previous drawings
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    // Draw tables

    layout.tables.forEach(table => {
      ctx.fillStyle = 'red';
      ctx.beginPath();
      ctx.arc(table.x, table.y, table.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'black';
      ctx.fillText(`Table ${table.id}`, table.x - 20, table.y);
    });
  
    // Draw kitchens
    layout.kitchens.forEach(kitchen => {
      ctx.fillStyle = 'green';
      ctx.fillRect(kitchen.x, kitchen.y, kitchen.width, kitchen.height);
      ctx.fillStyle = 'black';
      ctx.fillText(`Kitchen ${kitchen.id}`, kitchen.x, kitchen.y - 10);
    });
  
    // Draw toilets
    layout.toilets.forEach(toilet => {
      ctx.fillStyle = 'purple';
      ctx.fillRect(toilet.x, toilet.y, toilet.width, toilet.height);
      ctx.fillStyle = 'black';
      ctx.fillText(`Toilet ${toilet.id}`, toilet.x, toilet.y - 10);
    });
  }

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
      this.user.contactPhone, this.user.profilePicture, this.user.creditCardNumber).subscribe((data:any) => {
        if (data.msg === "User information updated successfully!")
        {
          localStorage.setItem("user", JSON.stringify(this.user))
        }

        alert(data.msg)
        window.location.reload();
    })
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
