import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule, FormsModule} from '@angular/forms';
import { Property } from 'src/app/models/property';
import { AuthService } from 'src/app/shared/services/auth.service';
import { PropertiesService } from 'src/app/shared/services/properties.service';


@Component({
  selector: 'app-create-properties',
  templateUrl: './create-properties.component.html',
  styleUrls: ['./create-properties.component.css']
})
export class CreatePropertiesComponent implements OnInit {

  xuserID: string;

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
    this.newProperty.controls['uid'].setValue(userID);
    this.xuserID = userID;
  }

  createProp(name: string, address: string, sleeps: string, ratePerNight: string, uid: string){
    const property: Property = {
      name: name,
      address: address,
      sleeps: sleeps,
      ratePerNight: ratePerNight,
      uid: uid
      
    }

    this.propertyService.createProperty(property)
  }

}
