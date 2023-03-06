import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { BookingService } from 'src/app/shared/services/bookings.service';
import { Booking } from 'src/app/models/booking';

@Component({
  selector: 'app-user-bookings',
  templateUrl: './user-bookings.component.html',
  styleUrls: ['./user-bookings.component.css']
})
export class UserBookingsComponent implements OnInit {

  xuserId: string;
  bookings: Booking[];

  constructor(private bookingService: BookingService, private authService: AuthService) { }

  async ngOnInit(){
    const userId = await this.authService.returnUserId();
    this.xuserId = userId;
    console.log(this.xuserId);

    this.bookingService.getUserBookings(this.xuserId).subscribe(bookings => {
      this.bookings = bookings;
    })

  }


}
