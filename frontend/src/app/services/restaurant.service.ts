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
}
