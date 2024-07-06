import { Injectable } from '@angular/core';
import { Restaurant } from '../models/Restaurant';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/User';
import { Reservation } from '../models/Reservation';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {

  constructor(private http: HttpClient) { }

  addRestaurant(restaurant: Restaurant)
  {
    return this.http.post<Restaurant>('http://localhost:4000/restaurants/addRestaurant', restaurant);
  }

  getRestaurants()
  {
    return this.http.get<Restaurant[]>('http://localhost:4000/restaurants/getRestaurants');
  }

  addWaiter(waiter: User)
  {
    return this.http.post<string>('http://localhost:4000/restaurants/addWaiter', waiter);
  }

  addReservation(reservation: Reservation)
  {
    return this.http.post<string>('http://localhost:4000/restaurants/addReservation', reservation);
  }

  getReservations()
  {
    return this.http.get<Reservation[]>('http://localhost:4000/restaurants/getReservations');
  }

  getAvailableTables(restaurantName: string, startTime: Date, endTime: Date, numberOfPeople: number)
  {
    return this.http.post<number[]>('http://localhost:4000/restaurants/getAvailableTables', 
      {restaurantName, startTime, endTime, numberOfPeople});
  }

  confirmReservation(reservation: Reservation)
  {
    const data = {
      username: reservation.username,
      restaurantName: reservation.restaurantName,
      startTime: reservation.startTime,
      endTime: reservation.endTime,
      numberOfPeople: reservation.numberOfPeople,
      additionalRequests: reservation.additionalRequests,
      tableId: reservation.tableId,
      confirmedByWaiter: reservation.confirmedByWaiter,
    }

    return this.http.post<string>('http://localhost:4000/restaurants/confirmReservation', data);
  }

  rejectReservation(reservation: Reservation)
  {
    const data = {
      username: reservation.username,
      restaurantName: reservation.restaurantName,
      startTime: reservation.startTime,
      endTime: reservation.endTime,
      numberOfPeople: reservation.numberOfPeople,
      additionalRequests: reservation.additionalRequests,
      tableId: reservation.tableId,
      confirmedByWaiter: reservation.confirmedByWaiter,
      showedUp: reservation.showedUp,
    }

    return this.http.post<string>('http://localhost:4000/restaurants/rejectReservation', data);
  }

  showedUp(reservation: Reservation)
  {
    const data = {
      username: reservation.username,
      restaurantName: reservation.restaurantName,
      startTime: reservation.startTime,
      endTime: reservation.endTime,
      numberOfPeople: reservation.numberOfPeople,
      additionalRequests: reservation.additionalRequests,
      tableId: reservation.tableId,
      confirmedByWaiter: reservation.confirmedByWaiter,
      showedUp: reservation.showedUp,
    }

    return this.http.post<string>('http://localhost:4000/restaurants/showedUp', data);
  }
}
