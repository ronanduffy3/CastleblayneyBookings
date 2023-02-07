import { Component, OnInit } from '@angular/core';
import { Property } from 'src/app/models/property';
import { AuthService } from 'src/app/shared/services/auth.service';
import { PropertiesService } from 'src/app/shared/services/properties.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-properties',
  templateUrl: './user-properties.component.html',
  styleUrls: ['./user-properties.component.css']
})
export class UserPropertiesComponent implements OnInit {

  properties: Property[];

  constructor(private propertyService: PropertiesService, private authService: AuthService, public router: Router) { 
  }

  // fill properties item with properties relevant to current user

  async ngOnInit(){
    const userID = await this.authService.returnUserId();
    //debug
    console.log(userID);
    // subscribe to the items and cast it to the list 
    await this.propertyService.getUserProperties(userID).subscribe(properties => {
      this.properties = properties
    });
  }

}
