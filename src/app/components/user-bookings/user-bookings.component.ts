import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { BookingService } from 'src/app/shared/services/bookings.service';
import { Booking } from 'src/app/models/booking';
import {MailItem} from 'src/app/models/mail-item';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { PropertiesService } from 'src/app/shared/services/properties.service';
import { tap } from 'rxjs';

@Component({
  selector: 'app-user-bookings',
  templateUrl: './user-bookings.component.html',
  styleUrls: ['./user-bookings.component.css']
})
export class UserBookingsComponent implements OnInit {

  xuserId: string;
  bookings: Booking[];
  hostEmail: string;
  propertyName: string;

  constructor(private bookingService: BookingService, private authService: AuthService, private afs: AngularFirestore ,private ps: PropertiesService) { }

  async ngOnInit(){
    const userId = await this.authService.returnUserId();
    this.xuserId = userId;
    console.log(this.xuserId);

    this.bookingService.getUserBookings(this.xuserId).subscribe(bookings => {
      this.bookings = bookings;
      this.bookings.forEach(booking => {
        const startDate = new Date(booking.startDate.seconds * 1000);
        const endDate = new Date(booking.endDate.seconds * 1000);
        booking.cStartDate = startDate.toDateString();
        booking.cEndDate = endDate.toDateString();
      });

    })

  }

  async cancelBooking(userBooking: Booking, propertyId: string){
    this.bookingService.cancelBooking(userBooking.id);

    let propertyName 
    let hostEmail
    let mStartDate: Date;
    let mEndDate: Date;
    let cStartDate;
    let cEndDate


    await this.ps.getPropertyById(propertyId).pipe(
      tap(data => console.log(data)),
    ).subscribe(data => {
      hostEmail = data.hostEmail,
      propertyName = data.name
        mStartDate = new Date(userBooking.startDate.seconds * 1000);
        mEndDate = new Date(userBooking.endDate.seconds * 1000);
        cStartDate = mStartDate.toDateString();
        cEndDate = mEndDate.toDateString();

      const hostMailItem: MailItem = {
        to: hostEmail,
        message: {
          subject: 'Booking for ' + propertyName + ' cancelled!',
          html: 'The booking for this property from ' + cStartDate + ' until ' + cEndDate + ' has been cancelled. The property has been marked available again.'
        }
      }

      this.afs.collection('mail').add(hostMailItem);
    });

    console.log(hostEmail, propertyName)
    
    
  }


}
