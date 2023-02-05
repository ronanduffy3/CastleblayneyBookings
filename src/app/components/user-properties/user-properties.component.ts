import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { PropertiesService } from 'src/app/shared/services/properties.service';

@Component({
  selector: 'app-user-properties',
  templateUrl: './user-properties.component.html',
  styleUrls: ['./user-properties.component.css']
})
export class UserPropertiesComponent implements OnInit {

  properties: any[];

  constructor(private propertyService: PropertiesService, private authService: AuthService) { 
  }

  async ngOnInit(){
    const userID = await this.authService.returnUserId();
    console.log(userID);
    await this.propertyService.getUserProperties(userID).subscribe(properties => {
      this.properties = properties
    });
    console.log(this.properties, "undefined error");
  }

}
