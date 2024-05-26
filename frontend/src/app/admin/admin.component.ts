import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/User';
import { UserService } from '../services/user.service';
import { Kitchen, Layout, Restaurant, Table, Toilet, WorkingHours } from '../models/Restaurant';
import { RestaurantService } from '../services/restaurant.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit{


  constructor(private router: Router, private userService: UserService, private restaurantService: RestaurantService)
  {

  }


  ngOnInit(): void {
    let p = localStorage.getItem("page")
    if (p)
      this.page = parseInt(p)

    let temp = localStorage.getItem("user")
    if(temp)
    {
      this.admin = JSON.parse(temp);

      if (this.admin.type != "admin")
      {
        localStorage.removeItem("user")
        this.router.navigate([""]);
      }
    }
    else
    {
      this.router.navigate([""]);
    }

    // page 1 - list all users
    this.userService.getUsers().subscribe(data => {
      if (data)
      {
        // filter out deactivated or requested accounts
        this.users = data.filter(user => {
          return user.accountStatus !== -1 && user.accountStatus !== 0
        });
        this.requestedUsers = data.filter(user => user.accountStatus == 0)
      }

    })
  }

  page: number = 1
  users: User[] = []
  requestedUsers: User[] = []
  admin: User = new User()

  navigateTo(newPage: number)
  {
    this.page = newPage
    localStorage.setItem("page", newPage.toString())
  }

  updateInfo(user:User)
  {
    if (!user.forename || !user.surname || !user.address || !user.contactPhone ||
      !user.email || !user.creditCardNumber) {
      alert("Fields can not be empty!");
      return;
    }

    this.userService.updateInfo(user.username, user.forename, user.surname, user.address, user.email, 
      user.contactPhone, user.creditCardNumber).subscribe((data:any) => {
        alert(data.msg)
        window.location.reload();
    })
  }

  setStatus(user: User)
  {
    
    let newStatus = 0

    if (user.accountStatus == -2)
      newStatus = 1
    else if (user.accountStatus == 1)
      newStatus = -2

    this.userService.setStatus(user.username, newStatus).subscribe((data:any) => {
      alert(data.msg)
      window.location.reload();
    })
  }

  acceptUser(user: User)
  {
    this.userService.setStatus(user.username, 1).subscribe((data:any) => {
      alert(data.msg)
      window.location.reload();
    })
  }

  rejectUser(user:User)
  {
    this.userService.setStatus(user.username, -1).subscribe((data:any) => {
      alert(data.msg)
      window.location.reload();
    })
  }


  name: string = "";
  type: string = "";
  address: string = "";
  description: string = "";
  contactPerson: string = "";
  tables: Table[] = [];
  kitchens: Kitchen[] = [];
  toilets: Toilet[] = [];
  workingHours: WorkingHours[] = [];
  layoutFile: File | null = null
  error: string = ""

  DaysOfWeek: string[] = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
]

  workingHoursText: string = ""

  addTable(x: number, y: number, radius: number, maxPeople: number): void {
    const id = this.tables.length + 1;
    this.tables.push({ id, x, y, radius, maxPeople });
  }

  addKitchen(x: number, y: number, width: number, height: number): void {
    const id = this.kitchens.length + 1;
    this.kitchens.push({ id, x, y, width, height});
  }

  addToilet(x: number, y: number, width: number, height: number): void {
    const id = this.toilets.length + 1;
    this.toilets.push({ id, x, y, width, height});
  }



  addWorkingHours() : boolean
  {
    this.error = ""

    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

    let status = true
    try
    {
      let trimmedWorkingHoursText = this.workingHoursText.trim().slice(0, -1) // remove last ;
      let workingHourLines = trimmedWorkingHoursText.split(";")

      workingHourLines.forEach(workingHour => {
        let line = workingHour.trim().split(",")
        let day = line[0].trim()
        let open = line[1].trim()
        let close = line[2].trim()

        if (!this.DaysOfWeek.includes(day))
        {
          this.error = "Incorrect format for day!"
          this.resetLayout()
          status = false
          return
        }

        // Test the time string against the regex
        if (!timeRegex.test(open) || !timeRegex.test(close)) {
          this.error = "Incorrect format for working hours!"
          this.resetLayout()
          status = false
          return
        }

        this.addWorkingHour(day, open, close)
      });
    }
    catch(e)
    {
      this.error = "Incorrect format for working hours!"
      this.resetLayout()
      return false
    }
    
    return status
  }

  addWorkingHour(day: string, open: string, close: string): void {
    this.workingHours.push({ day, open, close });
  }

  async saveRestaurant(): Promise<void> {
    this.error = ""

    if (!this.layoutFile)
    {
      this.error = "No layout provided!"
      return
    }

    await this.loadLayoutFromJson(this.layoutFile)

    const layout: Layout = {
      tables: this.tables,
      kitchens: this.kitchens,
      toilets: this.toilets
    };

    console.log(this.tables.length)
    console.log(layout.tables.length)

    if (this.kitchens.length < 1 || this.toilets.length < 1 || this.tables.length < 3)
    {
      this.error = "At least 3 tables, 1 toilet and 1 kitchen must be in restaurant!"
      this.resetLayout()
      return
    }

    this.checkLayout()
 
    const newRestaurant = new Restaurant(
      this.name,
      this.type,
      this.address,
      this.description,
      this.contactPerson,
      layout,
      this.workingHours
    );

    if(!this.addWorkingHours())
      return

    if (this.error == "")
    {
      this.restaurantService.addRestaurant(newRestaurant).subscribe((data:any) => {
        alert(data.msg)
        window.location.reload()
      });
    }
  }


  onFileSelected(event: any): void {
    const files = event.target.files;
    if (files && files.length > 0) {
      this.layoutFile = files[0];
    }
  }
  

  loadLayoutFromJson(file: File): Promise<void> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          if (e.target) {
            const jsonContent = e.target.result as string;
            const layout = JSON.parse(jsonContent) as Layout;
            this.tables = layout.tables;
            this.kitchens = layout.kitchens;
            this.toilets = layout.toilets;
            resolve();
          } else {
            reject(new Error("Failed to read the file."));
          }
        } catch (error) {
          reject(new Error("Invalid JSON format."));
        }
      };
      reader.onerror = () => {
        reject(new Error("Error reading the file."));
      };
      reader.readAsText(file);
    });
  }
  

  circlesOverlap(circle1: Table, circle2: Table) {
    const distance = Math.sqrt(
      (circle1.x - circle2.x) ** 2 + (circle1.y - circle2.y) ** 2
    );
    return distance < circle1.radius + circle2.radius;
  }
  
  rectanglesOverlap(rect1:any, rect2:any) {
    return !(
      rect1.x + rect1.width <= rect2.x ||
      rect2.x + rect2.width <= rect1.x ||
      rect1.y + rect1.height <= rect2.y ||
      rect2.y + rect2.height <= rect1.y
    );
  }

  circleRectOverlap(circle: Table, rect:any) {
    const distX = Math.abs(circle.x - rect.x - rect.width / 2);
    const distY = Math.abs(circle.y - rect.y - rect.height / 2);
  
    if (distX > (rect.width / 2 + circle.radius) || distY > (rect.height / 2 + circle.radius)) {
      return false;
    }
  
    if (distX <= (rect.width / 2) || distY <= (rect.height / 2)) {
      return true;
    }
  
    const dx = distX - rect.width / 2;
    const dy = distY - rect.height / 2;
    return (dx * dx + dy * dy <= (circle.radius * circle.radius));
  }
  

  checkLayout() {
    this.error = "";
  
    this.tables.forEach(table => {
      if (table.maxPeople <= 0) {
        this.error = "Table can't have negative max people!";
        this.resetLayout();
        return;
      }
  
      if (table.radius <= 0) {
        this.error = "Table can't have negative radius!";
        this.resetLayout();
        return;
      }
  
      // Check table overlapping with other tables
      this.tables.forEach(table2 => {
        if (table.id !== table2.id && this.circlesOverlap(table, table2)) {
          this.error = "Tables are overlapping!";
          this.resetLayout();
          return;
        }
      });
  
      // Check table overlapping with kitchens
      this.kitchens.forEach(kitchen => {
        if (this.circleRectOverlap(table, kitchen)) {
          this.error = "Table is overlapping with kitchen!";
          this.resetLayout();
          return;
        }
      });
  
      // Check table overlapping with toilets
      this.toilets.forEach(toilet => {
        if (this.circleRectOverlap(table, toilet)) {
          this.error = "Table is overlapping with toilet!";
          this.resetLayout();
          return;
        }
      });
    });
  
    // Check kitchens overlapping with each other
    this.kitchens.forEach((kitchen1, index) => {
      for (let i = index + 1; i < this.kitchens.length; i++) {
        const kitchen2 = this.kitchens[i];
        if (this.rectanglesOverlap(kitchen1, kitchen2)) {
          this.error = "Kitchens are overlapping!";
          this.resetLayout();
          return;
        }
      }
  
      // Check kitchens overlapping with toilets
      this.toilets.forEach(toilet => {
        if (this.rectanglesOverlap(kitchen1, toilet)) {
          this.error = "Kitchen is overlapping with toilet!";
          this.resetLayout();
          return;
        }
      });
    });
  
    // Check toilets overlapping with each other
    this.toilets.forEach((toilet1, index) => {
      for (let i = index + 1; i < this.toilets.length; i++) {
        const toilet2 = this.toilets[i];
        if (this.rectanglesOverlap(toilet1, toilet2)) {
          this.error = "Toilets are overlapping!";
          this.resetLayout();
          return;
        }
      }
    });
  }

  resetLayout()
  {
    this.kitchens = []
    this.toilets = []
    this.tables = []
    this.workingHours = []
    this.workingHoursText = ""
  }

  logout()
  {
    localStorage.removeItem("page")
    localStorage.removeItem("user")
    this.router.navigate([""])
  }
}
