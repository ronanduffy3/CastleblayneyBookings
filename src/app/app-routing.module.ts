import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreatePropertiesComponent } from './components/create-properties/create-properties.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EditPropertiesComponent } from './components/edit-properties/edit-properties.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { PropertiesComponent } from './components/properties/properties.component';
import { RegisterComponent } from './components/register/register.component';
import { UserPropertiesComponent } from './components/user-properties/user-properties.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';
import { AuthGuard } from './shared/guard/auth.guard';
import { AdminGuard } from './shared/guard/admin.guard';
import { FormsModule } from '@angular/forms';
import { BookPropertyComponent } from './components/book-property/book-property.component';
import { UserBookingsComponent } from './components/user-bookings/user-bookings.component'
import { HostBookingsComponent } from './components/host-bookings/host-bookings.component';

const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'forgot-password', component: ForgotPasswordComponent},
  {path: 'app-dashboard', component: DashboardComponent, canActivate: [AdminGuard]},
  {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
  {path: 'verify-email-address', component: VerifyEmailComponent},
  {path: 'properties', component: PropertiesComponent},
  {path: 'user-properties', component: UserPropertiesComponent},
  {path: 'create-property', component: CreatePropertiesComponent},
  {path: 'edit-properties', component: EditPropertiesComponent},
  {path: 'properties/:id', component: BookPropertyComponent },
  {path: 'user-bookings', component: UserBookingsComponent },
  {path: 'host-bookings', component: HostBookingsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes), FormsModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
