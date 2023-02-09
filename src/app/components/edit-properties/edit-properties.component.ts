import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PropertiesService } from 'src/app/shared/services/properties.service';

@Component({
  selector: 'app-edit-properties',
  templateUrl: './edit-properties.component.html',
  styleUrls: ['./edit-properties.component.css']
})
export class EditPropertiesComponent implements OnInit {

  id: string;

  constructor(public propertiesService: PropertiesService, private route: ActivatedRoute ) {
    this.route.queryParams.subscribe(params => {
      this.id = params['id'];
    })
   }

  ngOnInit(): void {
    console.log(this.id);
  }

  updateProperty(propertyId: string, name: string, address: string, ratePerNight: string, sleeps: string) {

  }

}
