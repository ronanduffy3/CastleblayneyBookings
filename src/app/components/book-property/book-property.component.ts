import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Property } from 'src/app/models/property';
import { PropertiesService } from 'src/app/shared/services/properties.service';
import { DatepickerModule } from 'ng2-datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModel } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Booking } from 'src/app/models/booking';


@Component({
  selector: 'app-book-property',
  templateUrl: './book-property.component.html',
  styleUrls: ['./book-property.component.css']
})
export class BookPropertyComponent implements OnInit {

  property: Property;
  propertyDoc: AngularFirestoreDocument<Property>;
  startDate = new Date();
  endDate = new Date();
  xuserid: String;

  constructor(private propService: PropertiesService, private route: ActivatedRoute, private auth: AuthService, private afs: AngularFirestore) { }

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.propertyDoc = this.afs.doc(`properties/${id}`);
    console.log(this.propertyDoc);
    this.propService.getPropertyById(id).subscribe((property: Property) => {
      this.property = property;
      console.log(property);
    });
    const uID = await this.auth.returnUserId();
    this.xuserid = uID;
  }

  isAvailable(month: string): boolean {
    console.log(month);
    return this.property.availability[month];
  }

  async bookProperty() {

    const upropertyId = this.propertyDoc.ref.id;
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1); // set tomorrow as the minimum start date
    const startDate = new Date(this.startDate);
    const endDate = new Date(this.endDate);

    if (startDate < tomorrow) {
      alert('Start date must be tomorrow at the earliest.');
      return;
    }

    if (startDate > endDate){
      alert('End date must be after start date');
      return;
    }

    const bookingsRef = this.afs.collection<Booking>('bookings', ref => {
      return ref.where('propertyId', '==', upropertyId);
    });

    const startBeforeRef = bookingsRef.ref.where('startDate', '<', endDate);
    const endAfterRef = bookingsRef.ref.where('endDate', '>', startDate);

    Promise.all([startBeforeRef.get(), endAfterRef.get()])
      .then(results => {
        const startBeforeDocs = results[0].docs;
        const endAfterDocs = results[1].docs;

        const conflictingDocs = startBeforeDocs.filter(doc => {
          const endDate = doc.data().endDate.toDate();
          return endDate > startDate;
        }).concat(endAfterDocs.filter(doc => {
          const startDate = doc.data().startDate.toDate();
          return startDate < endDate;
        }));

        if (conflictingDocs.length > 0) {
          alert('This property is not available for the selected period.');
          return;
        } else {
          const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)); // calculate number of days
          const accRatePerNight = Number(this.property.ratePerNight);
          const value = days * accRatePerNight; // calculate value


          if (!this.xuserid) {
            alert('Please log in to book this property.');
            return;
          }

          const booking = {
            userId: this.xuserid,
            propertyId: upropertyId,
            ownerId: this.property.uid,
            startDate: startDate,
            endDate: endDate,
            days: days,
            value: value
          };

          const bookingDetails = `Booking Details:\n\n` +
            `Property: ${this.property.name}\n` +
            `Start Date: ${booking.startDate.toDateString()}\n` +
            `End Date: ${booking.endDate.toDateString()}\n` +
            `Number of Days: ${booking.days}\n` +
            `Total Cost: ${booking.value}`;

          if (confirm(bookingDetails)) {
            this.afs.collection('bookings').add(booking).then(() => {
              alert('Booking successfully created!');
            }).catch(error => {
              console.error(error);
              alert('An error occurred while creating the booking.');
           });
          } else {
            window.alert('booking cancelled')
          }
        }
      })
      .catch(error => {
        console.error(error);
        alert('An error occurred while checking for conflicting bookings.');
      });
  }
}