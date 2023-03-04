import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { map, Observable, from } from 'rxjs';
import { AuthService } from './auth.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Property } from 'src/app/models/property';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PropertiesService {

  currentUserId: string;
  properties: Observable<Property[]>;
  private propertiesCollection: AngularFirestoreCollection<Property>;

  constructor(private fireStore: AngularFirestore, private authService: AuthService, public storage: AngularFireStorage) { 
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
            console.log(id + "id print");
            return { id, ...data };
          });
        })
      );
  }

  getUIDProperties(userID?: string) {
    return this.fireStore
    .collection<any>('properties', ref=> ref.where('uid', '==', userID))
    .snapshotChanges()
    .pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          console.log(id + "id print");
          return { id, ...data };
        });
      })
    );
}

  getUserProperties(userID?: string): Observable<Property[]> {
    let properties = this.properties;
    if (userID) {
      console.log(userID);
      properties = this.fireStore.collection<Property>('properties', ref => ref.where('uid', '==', userID)).valueChanges()
      ;
    }
    return properties;
  }

  createProperty(property: Property, filesOne: FileList) {
    
    const fileArray: File[] = Array.from(filesOne);

    // Create an array to hold the URLs of uploaded files
    const fileUrls: string[] = [];
  
    // Loop through each file and upload it to Firebase Storage
    for (const file of fileArray) {
      // Generate a random ID for the file name
      const randomId = Math.random().toString(36).substring(2);
      const filePath = `properties/${randomId}`;
  
      // Create a storage reference to the file path
      const storageRef = this.storage.ref(filePath);
  
      // Upload the file to Firebase Storage
      const task = this.storage.upload(filePath, file);
  
      // Listen for the upload progress and console log the percentage
      task.percentageChanges().subscribe(percent => console.log(percent));
  
      // Get the download URL of the uploaded file and add it to the fileUrls array
      task.snapshotChanges().pipe(
        finalize(() => {
          storageRef.getDownloadURL().subscribe(url => {
            console.log(url);
            fileUrls.push(url);
            property.images.push(url)
            if (property.images.length === fileArray.length) {
              // Add the property to the Firestore collection and get the document reference
              const documentRef = this.fireStore.collection(`properties`).add(property);
              // Get the ID of the newly created document and log it to the console
              documentRef.then(docRef => console.log(`Property added with ID: ${docRef.id}`));
            }
          });
        })
      ).subscribe();
    }

    
  }

  getPropertyById(id: string): Observable<Property> {
    return this.fireStore.collection<Property>('properties').doc(id).valueChanges();
  }

  private uploadFiles(files: File[]) {
    
  }

  deleteProperty(id: string) {
    console.log(id);
    var answer = window.confirm("You want to delete, you can not reverse this decision" + id)
    if(answer){ 
      const propertiesDoc = this.fireStore.collection('properties').doc(id);
      propertiesDoc.delete()
      .then(res => {
        console.log("Propertiy with ID" + id + " has been delete successfully ")
        this.refreshProperties();
      }).catch((error) => {
        console.log("error removing document: " + error);
      })
      }  
      else{ 
        window.alert("Property Not Deleted")
      }
  }
}
