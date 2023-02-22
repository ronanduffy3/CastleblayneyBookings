import { Component, OnInit } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/compat/functions';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(public functions: AngularFireFunctions) { }

  ngOnInit(): void {
    this.createHost();
  }

  createHost(){
    const createNewHost = this.functions.httpsCallable('giveUserHost')
    const data = createNewHost({uid: 'xtFXerj2z2QL2q5SZvkHUDUBSaA2'}).subscribe((data) => console.log(data));
  }


}
