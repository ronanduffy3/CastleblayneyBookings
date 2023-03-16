import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule, FormsModule, FormArray } from '@angular/forms';
import { Property } from 'src/app/models/property';
import { AuthService } from 'src/app/shared/services/auth.service';
import { PropertiesService } from 'src/app/shared/services/properties.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { combineLatest, finalize, map, Observable } from 'rxjs';
import { Router } from '@angular/router';


@Component({
  selector: 'app-create-properties',
  templateUrl: './create-properties.component.html',
  styleUrls: ['./create-properties.component.css']
})
export class CreatePropertiesComponent implements OnInit {

  options: any = {
    componentRestrictions: { country: 'IE' }
  }

  form: FormGroup;
  xuserID: string;
  xhostEmail: string;
  months: { month: string, checked: boolean }[];
  userAddress: string = ''
  userLatitude: string = ''
  userLongitude: string = ''
  selectedFiles: any[] = [];

  constructor(public authService: AuthService, public propertyService: PropertiesService, public storage: AngularFireStorage, private router: Router) { }

  async ngOnInit() {

    this.months = [
      { month: 'January', checked: false },
      { month: 'February', checked: false },
      { month: 'March', checked: false },
      { month: 'April', checked: false },
      { month: 'May', checked: false },
      { month: 'June', checked: false },
      { month: 'July', checked: false },
      { month: 'August', checked: false },
      { month: 'September', checked: false },
      { month: 'October', checked: false },
      { month: 'November', checked: false },
      { month: 'December', checked: false }
    ];

    this.form = new FormGroup({
      name: new FormControl(),
      address: new FormControl(),
      sleeps: new FormControl(),
      ratePerNight: new FormControl(),
      shortDescription: new FormControl(),
      uid: new FormControl(),
      availableMonths: new FormControl([], Validators.required)
    });

    const userID = await this.authService.returnUserId();
    const userEmail = await this.authService.returnEmail();
    this.form.controls['uid'].setValue(userID);
    this.xuserID = userID;
    this.xhostEmail = userEmail;
    
  }

  handleAddressChange(address: any) {
    this.userAddress = address.formatted_address
    this.userLatitude = address.geometry.location.lat()
    this.userLongitude = address.geometry.location.lng()
    console.log(this.userLatitude + " " + this.userLongitude);
  }


  createProperty() {
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
    const property: Property = {
      name: this.form.get('name').value,
      address: this.userAddress,
      sleeps: this.form.get('sleeps').value,
      ratePerNight: this.form.get('ratePerNight').value,
      uid: this.form.get('uid').value,
      shortDescription: this.form.get('shortDescription').value,
      availability: availability,
      hostEmail: this.xhostEmail,
      images: []
    };

    const files: File[] = Array.from(this.selectedFiles);
    const fileDataTransfer = new DataTransfer();
    files.forEach((file: File) => {
      fileDataTransfer.items.add(file);
    });
    const fileList: FileList = fileDataTransfer.files;


    this.propertyService.createProperty(property, fileList)

  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      for (let i = 0; i < input.files.length; i++) {
        this.selectedFiles.push(input.files[i]);
      }
    }
  }

}
