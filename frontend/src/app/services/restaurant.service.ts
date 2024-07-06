import { Injectable } from '@angular/core';
import { MenuItem, Restaurant } from '../models/Restaurant';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/User';
import { Reservation } from '../models/Reservation';
import { Order } from '../models/Order';

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

  addMenuItem(restaurantName: string, menuItem: MenuItem)
  {
    /*
    const data = {
      restaurantName,
      name: menuItem.name,
      price: menuItem.price,
      ingredients: menuItem.ingredients,
      imageLink: menuItem.imageLink,
    }
    */

    return this.http.post<string>('http://localhost:4000/restaurants/addMenuItem', {restaurantName, menuItem});
  }

  getOrders()
  {
    return this.http.get<Order[]>('http://localhost:4000/restaurants/getOrders/');
  }

  addOrder(order: Order)
  {
    const data = {
      username: order.username,
      restaurantName: order.restaurantName,
      status: order.status,
      items: order.items,
      totalPrice: order.totalPrice,
      orderTime: order.orderTime,
    }

    return this.http.post<string>('http://localhost:4000/restaurants/addOrder', order);
  }

  updateDelivery(order: Order)
  {
    const data = {
      id: order.id,
      estimatedTime: order.estimatedTime,
      status: order.status,
    }

    return this.http.post<string>('http://localhost:4000/restaurants/updateDelivery', data);
  }
}
