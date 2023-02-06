import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators} from '@angular/forms';
import { Property } from 'src/app/property';
import { AuthService } from 'src/app/shared/services/auth.service';
import { PropertiesService } from 'src/app/shared/services/properties.service';


@Component({
  selector: 'app-create-properties',
  templateUrl: './create-properties.component.html',
  styleUrls: ['./create-properties.component.css']
})
export class CreatePropertiesComponent implements OnInit {

  constructor(public authService: AuthService, public propertyService: PropertiesService) { }

  newProperty = new FormGroup({
    name: new FormControl('', Validators.required),
    address: new FormControl('', Validators.required),
    ratePerNight: new FormControl('', Validators.required),
    sleeps: new FormControl('', Validators.required),
    uid: new FormControl('', Validators.required)
  })

  async ngOnInit() {
    const userID = await this.authService.returnUserId();
    this.newProperty.controls['userID'].setValue(userID);
  }

  createProp(property: Property){
    this.propertyService.createProperty(property)
  }

}
