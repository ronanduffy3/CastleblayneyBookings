import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideDatabase,getDatabase } from '@angular/fire/database';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { PropertiesComponent } from './components/properties/properties.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AppHeaderComponent } from './components/app-header/app-header.component';
import { AuthService } from './shared/services/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireFunctionsModule } from '@angular/fire/compat/functions';
import { ProfileComponent } from './components/profile/profile.component';
import { HomeComponent } from './components/home/home.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';
import { UserPropertiesComponent } from './components/user-properties/user-properties.component';
import { CreatePropertiesComponent } from './components/create-properties/create-properties.component';
import { ReactiveFormsModule } from "@angular/forms";
import { EditPropertiesComponent } from './components/edit-properties/edit-properties.component';
import { AngularFireStorageModule, BUCKET } from '@angular/fire/compat/storage';
import { FormsModule } from '@angular/forms';
import { BookPropertyComponent } from './components/book-property/book-property.component';
import { UserBookingsComponent } from './components/user-bookings/user-bookings.component';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { HostBookingsComponent } from './components/host-bookings/host-bookings.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    PropertiesComponent,
    DashboardComponent,
    AppHeaderComponent,
    ProfileComponent,
    HomeComponent,
    VerifyEmailComponent,
    BookPropertyComponent,
    UserPropertiesComponent,
    CreatePropertiesComponent,
    EditPropertiesComponent,
    UserBookingsComponent,
    HostBookingsComponent,
  ],
  exports: [ LoginComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    CommonModule,
    GooglePlaceModule,
    AngularFireFunctionsModule,
    AngularFireStorageModule,

    FormsModule,
    ReactiveFormsModule

  ],
  providers: [AuthService, AngularFirestore, {provide: BUCKET, useValue: 'castleblayney-bookings-images'}],
  bootstrap: [AppComponent]
})
export class AppModule { }
