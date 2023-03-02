import { Component, OnInit } from '@angular/core';
import { Property } from 'src/app/models/property';
import { AuthService } from 'src/app/shared/services/auth.service';
import { PropertiesService } from 'src/app/shared/services/properties.service';
import { DatepickerOptions } from 'ng2-datepicker';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-properties',
  templateUrl: './user-properties.component.html',
  styleUrls: ['./user-properties.component.css']
})
export class UserPropertiesComponent implements OnInit {

  properties: any[] = [];

  constructor(public propertyService: PropertiesService, private authService: AuthService, public router: Router) { 
  }

  // fill properties item with properties relevant to current user

  async ngOnInit(){
    const userID = await this.authService.returnUserId();
    // subscribe to the items and cast it to the list 
    this.propertyService.getUIDProperties(userID).subscribe(properties => {
      this.properties = properties
    });
    console.log(this.properties, "undefined error");
    this.properties.forEach(property => console.log(property));
  }

  async deleteProperty(propertyId: string) {
    (await this.propertyService.deleteProperty(propertyId));
  }

  editProperty(id: string) {
    this.router.navigate(['edit-properties'], { queryParams: { id } });
  }
  

}
