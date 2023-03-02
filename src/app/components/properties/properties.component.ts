import { Component, OnInit } from '@angular/core';
import { getDatabase } from '@firebase/database';
import { PropertiesService } from 'src/app/shared/services/properties.service';

@Component({
  selector: 'app-properties',
  templateUrl: './properties.component.html',
  styleUrls: ['./properties.component.css']
})
export class PropertiesComponent implements OnInit {

  properties: any[];
  displayStyle = "none";

  constructor(private propertyService: PropertiesService) { }

  ngOnInit(): void {
    this.propertyService.getProperties().subscribe(properties => {
      this.properties = properties
    });
    console.log(this.properties, "undefined error");
  }

  openPopup(){
    this.displayStyle = "block";

  }
  closePopup(){
    this.displayStyle = "none";

  }

  bookProperty(){
    const startDateInput = document.getElementById('startDate') as HTMLInputElement;
    const endDateInput = document.getElementById('endDate') as HTMLInputElement;
    const startDate = startDateInput.value;
    const endDate = endDateInput.value;

    console.log(startDate);
    console.log(endDate);


  }
}
