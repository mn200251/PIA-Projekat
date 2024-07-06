export class Order{
    id: number = 0;
    username: string = "";
    restaurantName: string = "";
    status: string = "";
    estimatedTime: string = "";
    items: OrderItem[] = [];
    totalPrice: number = 0;
    orderTime: Date = new Date();
}

export class OrderItem{
    name: string = "";
    price: number = 0;
    quantity: number = 0;
}