import { Booking } from "./booking";

export interface HostBookings extends Booking {
    ratePerNight: string;
    propertyName: string;
    bookerDisplayName: string;
    bookerId: string;
}

