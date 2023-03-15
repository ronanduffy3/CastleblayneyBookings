import { Component, OnInit } from '@angular/core';
import { BookingService } from 'src/app/shared/services/bookings.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Booking } from 'src/app/models/booking';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs'

@Component({
  selector: 'app-host-bookings',
  templateUrl: './host-bookings.component.html',
  styleUrls: ['./host-bookings.component.css']
})
export class HostBookingsComponent implements OnInit {
  xuserId: string;
  bookings: Booking[];

  constructor(private bookingService: BookingService, private authService: AuthService, public router: Router, private firestore: AngularFirestore) {
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
}
