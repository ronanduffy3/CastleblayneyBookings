import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Property } from 'src/app/models/property';
import { PropertiesService } from 'src/app/shared/services/properties.service';
import { DatepickerModule } from 'ng2-datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModel } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Booking } from 'src/app/models/booking';
import { MailItem } from '../../models/mail-item';


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
  availableMonths: string[] | undefined;
  xuserid: string;
  xdisplayName: string;
  xemail: string;
  hemail: string;

  constructor(private propService: PropertiesService, private route: ActivatedRoute, private auth: AuthService, private afs: AngularFirestore, private router: Router) { }

  async ngOnInit() {
    // go to the correct route of the selected property
    const id = this.route.snapshot.paramMap.get('id');
    this.propertyDoc = this.afs.doc(`properties/${id}`);
    this.propService.getPropertyById(id).subscribe((property: Property) => {
      this.property = property;
      const availability = property.availability;
      const months = Object.keys(availability);
      const availableMonths = months.filter(month => availability[month]);

      if (availableMonths.length > 0) {
        this.availableMonths = availableMonths;
      } else {
        this.availableMonths = undefined;
      }
      console.log(this.availableMonths)
    });

    // load information of user to stay in the DB
    const uID = await this.auth.returnUserId();
    const displayName = await this.auth.returnDisplayname();
    const email = await this.auth.returnEmail();
    this.xuserid = uID;
    this.xdisplayName = displayName;
    this.xemail = email;
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

    if (this.property.uid == this.xuserid){
      alert('You can not book your own property')
      this.router.navigate['properties'];
      return;
    }

    const startMonth = startDate.toLocaleString('default', { month: 'long' }); 
    console.log(startMonth)// get the month of the start date as a string, e.g. 'January'
    if (this.property.availability[startMonth] === false) { // check if the month is marked as unavailable in the availability map
      alert('Sorry, this property is not available for the selected start month.');
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
            propertyName: this.property.name,
            bookerName: this.xdisplayName,
            propertyId: upropertyId,
            ownerId: this.property.uid,
            startDate: startDate,
            endDate: endDate,
            days: days,
            bookerEmail: this.xemail,
            value: value
          };

          const bookerMailItem: MailItem = {
            to: booking.bookerEmail,
            message: {
              subject: 'Your in, you are booked for ' + booking.propertyName,
              html: 'test email'
            } 
          }

          const hostMailItem: MailItem = {
            to: this.property.hostEmail,
            message: {
              subject: 'You have a new booking for ' + booking.propertyName,
              html: 'test email'
            }
          }

          const bookingDetails = `Booking Details:\n\n` +
            `Property: ${this.property.name}\n` +
            `Start Date: ${booking.startDate.toDateString()}\n` +
            `End Date: ${booking.endDate.toDateString()}\n` +
            `Number of Days: ${booking.days}\n` +
            `Total Cost: ${booking.value}`;

          if (confirm(bookingDetails)) {
            this.afs.collection('bookings').add(booking).then(() => {
              alert('Booking successfully created!');
            this.afs.collection('mail').add(bookerMailItem);
            this.afs.collection('mail').add(hostMailItem);
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