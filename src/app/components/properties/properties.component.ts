import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { getDatabase } from '@firebase/database';
import { PropertiesService } from 'src/app/shared/services/properties.service';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-properties',
  templateUrl: './properties.component.html',
  styleUrls: ['./properties.component.css']
})
export class PropertiesComponent implements OnInit {

  properties: any[];
  displayStyle = "none";

  constructor(private propertyService: PropertiesService, private router: Router, public auth: AuthService) { }

  ngOnInit(): void {
    this.propertyService.getProperties().subscribe(properties => {
      this.properties = properties
    });
    console.log(this.properties, "undefined error");
  }

  navigateToFullPropertyDetails(propertyId: number) {
    this.router.navigate(['/properties', propertyId]);
  }
}
