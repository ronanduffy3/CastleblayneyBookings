import { Timestamp } from "@angular/fire/firestore";

export interface Booking {
    id?: string;
    userId: string;
    propertyId: string;
    ownerId: string;
    startDate: Timestamp;
    endDate: Timestamp;
    days: number;
    value: number;
}
