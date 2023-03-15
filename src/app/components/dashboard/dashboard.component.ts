import { Component, OnInit } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/compat/functions';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  users$: Observable<any[]>;
  hosts$: Observable<any[]>;

  constructor(public functions: AngularFireFunctions) { }

  ngOnInit(): void {
    const getUsersWithUserClaim = this.functions.httpsCallable(
      "getUsersWithUserClaim"
    );
    this.users$ = getUsersWithUserClaim({}).pipe(
      map((response) => response)
    );
    this.users$.subscribe((data) => console.log(data));
    const getHostUsers = this.functions.httpsCallable(
      "getHostUsers"
    );
    this.hosts$ = getHostUsers({}).pipe(
      map((response) => response)
    );

    this.hosts$.subscribe((date) => console.log(date))
  }

  promoteUser(userId: string) {
    console.log(userId);  
    const setHostCustomClaim = this.functions.httpsCallable('giveUserHost');
   setHostCustomClaim({ userId })
    .subscribe((result) => {
      alert('Custom claim added successfully');
    }, (error) => {
      alert('Error adding custom claim' + error);
    });
  }

  demoteUser(){


  }
  


}
