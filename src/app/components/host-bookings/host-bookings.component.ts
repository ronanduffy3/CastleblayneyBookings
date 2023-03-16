import { Component, OnInit } from '@angular/core';
import { BookingService } from 'src/app/shared/services/bookings.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Booking } from 'src/app/models/booking';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, tap } from 'rxjs'
import { PropertiesService } from 'src/app/shared/services/properties.service';
import { MailItem } from 'src/app/models/mail-item';

@Component({
  selector: 'app-host-bookings',
  templateUrl: './host-bookings.component.html',
  styleUrls: ['./host-bookings.component.css']
})
export class HostBookingsComponent implements OnInit {
  xuserId: string;
  bookings: Booking[];

  constructor(private bookingService: BookingService, private authService: AuthService, public router: Router, private firestore: AngularFirestore, private ps: PropertiesService) {
  }

  async ngOnInit() {
    const userid = await this.authService.returnUserId();
    this.xuserId = userid;

    this.bookingService.getHostBookings(this.xuserId).subscribe(bookings => {
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
        to: userBooking.bookerEmail,
        message: {
          subject: 'Booking for ' + propertyName + ' cancelled!',
          html: 'The booking for this property from ' + cStartDate + ' until ' + cEndDate + ' has been cancelled. The booking has been cancelled by the host.'
        }
      }

      this.firestore.collection('mail').add(hostMailItem);
    });

    console.log(hostEmail, propertyName)
    this.bookingService.cancelBooking(userBooking.id);
    
    
  }
}
