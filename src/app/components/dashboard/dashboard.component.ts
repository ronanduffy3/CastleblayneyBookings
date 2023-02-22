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

  constructor(public functions: AngularFireFunctions) { }

  ngOnInit(): void {
    const getUsersWithUserClaim = this.functions.httpsCallable(
      "getUsersWithUserClaim"
    );
    this.users$ = getUsersWithUserClaim({}).pipe(
      map((response) => response)
    );

    this.users$.subscribe((data) => console.log(data));
  }

  promoteUser(){

  }
  


}
