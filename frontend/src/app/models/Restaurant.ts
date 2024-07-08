export interface Table {
    id: number;
    x: number;
    y: number;
    radius: number;
    maxPeople: number;
  }
  
  export interface Kitchen {
    id: number;
    x: number;
    y: number;
    width: number;
    height: number;
  }
  
  export interface Toilet {
    id: number;
    x: number;
    y: number;
    width: number;
    height: number;
  }
  
  export interface Layout {
    tables: Table[];
    kitchens: Kitchen[];
    toilets: Toilet[];
  }
  
  export interface WorkingHours {
    day: string;
    open: string;
    close: string;
  }

  export class MenuItem {
    name: string = "";
    price: number = 0;
    imageLink: any = null;
    ingredients: string = "";

    helperQuantity: number = 1;
  }
  
  export class Restaurant {
    constructor(
      public name: string,
      public type: string,
      public address: string,
      public description: string,
      public contactPerson: string,
      public layout: Layout,
      public workingHours: WorkingHours[],
      public menu: MenuItem[]
    ) {}
  }
  