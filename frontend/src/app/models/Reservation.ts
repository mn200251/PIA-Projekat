export interface Reservation {
    username: string;
    restaurantName: string;
    tableId: number;

    // date: Date;
    startTime: Date;
    endTime: Date;
    numberOfPeople: number;
    additionalRequests: string;
  }