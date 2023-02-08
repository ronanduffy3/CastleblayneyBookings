import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { map, Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Property } from 'src/app/models/property';

@Injectable({
  providedIn: 'root'
})
export class PropertiesService {

  currentUserId: string;
  properties: Observable<Property[]>;
  private propertiesCollection: AngularFirestoreCollection<Property>;


  constructor(private fireStore: AngularFirestore, private authService: AuthService) { 
    this.refreshProperties();
  }

  refreshProperties(): void { 
    this.propertiesCollection = this.fireStore.collection<Property>('properties');
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
      properties = this.fireStore.collection<Property>('properties', ref => ref.where('uid', '==', userID)).valueChanges();
    }
    return properties;
  }

  createProperty(property: Property) {
    return this.fireStore.collection(`properties`).add(property);
    
  }

  deletePropertyTwo(data){
    console.log(data);
    return this.fireStore.collection('properties')
      .doc(data.payload.doc.id)
        .delete();
  }

  deleteProperty(id: string) {
    console.log(id);
    var answer = window.confirm("You want to delete, you can not reverse this decision" + id)
    if(answer){ 
      const propertiesDoc = this.fireStore.collection('properties').doc(id);
      propertiesDoc.delete()
      .then(res => {
        console.log("Propertiy with ID" + id + " has been delete successfully ")
        //this.refreshProperties();
        //location.reload();
      }).catch((error) => {
        console.log("error removing document: " + error);
      })
      }  
      else{ 
        window.alert("Property Not Deleted")
      }
    
  }
}
