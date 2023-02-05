import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { map, Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Property } from 'src/app/property';

@Injectable({
  providedIn: 'root'
})
export class PropertiesService {

  currentUserId: string;
  properties: Observable<Property[]>;
  private propertiesCollection: AngularFirestoreCollection<Property>;


  constructor(private fireStore: AngularFirestore, private authService: AuthService) { 
    this.propertiesCollection = fireStore.collection<Property>('properties');
    this.properties = this.propertiesCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Property;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  getProperties(){
      return this.fireStore
      .collection<any>('properties')
      .snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );
  }

  getUserProperties(userID?: string): Observable<Property[]> {
    let properties = this.properties;
    if (userID) {
      console.log(userID);
      properties = this.fireStore.collection<Property>('properties', ref => ref.where('userID', '==', userID)).valueChanges();
    }
    return properties;
  }

}
