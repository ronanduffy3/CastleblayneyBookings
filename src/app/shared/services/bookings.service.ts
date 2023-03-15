import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Booking } from 'src/app/models/booking';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  constructor(private afs: AngularFirestore) { }

  // Get all bookings for a specific user ID
  getUserBookings(userId: string): Observable<Booking[]> {
    return this.afs.collection<Booking>('bookings', ref => {
      return ref.where('userId', '==', userId);
    }).valueChanges({ idField: 'id' });
  }

  getHostBookings(userId: string): Observable<Booking[]>{
    return this.afs.collection<Booking>('bookings', ref => {
      return ref.where('ownerId', '==', userId);
    }).valueChanges({ idField: 'id' });
  }


  // Cancel a booking with the given booking ID
  cancelBooking(bookingId: string) {
    if(confirm("Are you sure you want to cancel booking with ID" + bookingId)){
      return this.afs.collection('bookings').doc(bookingId).delete().then(res => {
        window.alert(res+"booking cancelled")
      });
    }
    else{
      window.alert("Booking not cancelled");
      return false;
    }
    
  }
}