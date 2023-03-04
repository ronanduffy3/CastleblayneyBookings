import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Property } from 'src/app/models/property';
import { PropertiesService } from 'src/app/shared/services/properties.service';
import { DatepickerModule } from 'ng2-datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModel } from '@angular/forms';


@Component({
  selector: 'app-book-property',
  templateUrl: './book-property.component.html',
  styleUrls: ['./book-property.component.css']
})
export class BookPropertyComponent implements OnInit {

  property: Property;
  startDate = new Date();
  endDate = new Date();

  constructor(private propService: PropertiesService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.propService.getPropertyById(id).subscribe((property: Property) => {
      this.property = property;
    });
  }

  bookProperty(){

  }

}
