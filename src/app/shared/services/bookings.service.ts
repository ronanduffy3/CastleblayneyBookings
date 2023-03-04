import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { AuthService } from './auth.service';
import { PropertiesService } from './properties.service';

@Injectable({
  providedIn: 'root'
})
export class BookingsService {

  constructor(private authService: AuthService, private propertiesServices: PropertiesService) { }

  

}
