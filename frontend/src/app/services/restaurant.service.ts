import { Injectable } from '@angular/core';
import { Restaurant } from '../models/Restaurant';
import { HttpClient } from '@angular/common/http';

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
}
