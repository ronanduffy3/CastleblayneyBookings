import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, TitleStrategy } from '@angular/router';
import { PropertiesService } from 'src/app/shared/services/properties.service';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Property } from 'src/app/models/property';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { ConstantPool } from '@angular/compiler';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Form, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-properties',
  templateUrl: './edit-properties.component.html',
  styleUrls: ['./edit-properties.component.css']
})
export class EditPropertiesComponent implements OnInit {

  id: string;
  form: FormGroup;
  property: Property;
  xuserid: string;
  months: { month: string, checked: boolean }[];
  propertyDoc: AngularFirestoreDocument<Property>;

  constructor(public propService: PropertiesService, private afs: AngularFirestore, private route: ActivatedRoute, private authService: AuthService) {
    this.route.queryParams.subscribe(params => {
      this.id = params['id'];
    })
  }

  async ngOnInit() {
    this.propertyDoc = this.afs.doc(`properties/${this.id}`);
    console.log(this.propertyDoc);
    this.propService.getPropertyById(this.id).subscribe((property: Property) => {
      this.property = property;
      console.log(property);
      this.setFormValues();
    });


    this.form = new FormGroup({
      propName: new FormControl(),
      address: new FormControl(),
      sleeps: new FormControl(),
      ratePerNight: new FormControl(),
      shortDescription: new FormControl(),
      uid: new FormControl(),
      availableMonths: new FormControl([], Validators.required)
    });

    const userID = await this.authService.returnUserId();
    this.xuserid = userID;


  }

  setFormValues() {
    this.form.controls['uid'].setValue(this.xuserid);
    this.form.controls['propName'].setValue(this.property.name);
    this.form.controls['address'].setValue(this.property.address);
    this.form.controls['sleeps'].setValue(this.property.sleeps);
    this.form.controls['ratePerNight'].setValue(this.property.ratePerNight);
    this.form.controls['shortDescription'].setValue(this.property.shortDescription);

    const availability = this.property.availability;
    const months = Object.keys(availability);
    this.months = months.map((month) => {
      return {
        month: month,
        checked: availability[month]
      };
    });
    
  }

  updateProperty() {

    const monthsAvailable = this.months.reduce((acc, { month, checked }) => {
      if (checked) {
        acc.push(month);
      }
      return acc;
    }, []);

    const availability = {
      'January': false,
      'February': false,
      'March': false,
      'April': false,
      'May': false,
      'June': false,
      'July': false,
      'August': false,
      'September': false,
      'October': false,
      'November': false,
      'December': false
    };

    for (const month of monthsAvailable) {
      availability[month] = true;
    }

    const updatedProperty: Property = {
      name: this.form.get('propName').value,
      address: this.form.get('address').value,
      sleeps: this.form.get('sleeps').value,
      ratePerNight: this.form.get('ratePerNight').value,
      uid: this.form.get('uid').value,
      shortDescription: this.form.get('shortDescription').value,
      availability: availability,
      images: this.property.images
    };

    this.propertyDoc.set(updatedProperty);
  }

}
