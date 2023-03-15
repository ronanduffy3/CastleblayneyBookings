import { Timestamp } from "@angular/fire/firestore";

export interface Booking {
    id?: string;
    userId: string;
    bookerName?: string;
    propertyName?: string;
    bookerEmail: string;
    propertyId: string;
    ownerId: string;
    startDate: Timestamp;
    endDate: Timestamp;
    cStartDate?: string;
    cEndDate?: string;
    days: number;
    value: number;
}
