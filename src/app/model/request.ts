import { User } from "./user";

export class Request {
    id: number;
    user: User;  //join to user table, foreign key
    requestNumber: string;
    description: string;
    justification: string;
    dateNeeded: Date;
    deliveryMode: string;
    status: string; //calculated internally, NEW, REVIEW, APPROVED, REJECTED
    total: number; //calculated internally
    submittedDate: Date; //calculated internally
    reasonForRejection: string;

    constructor(id: number=0,
        user: User = new User(),
        requestNumber: string='',
        description: string='',
        justification: string='',
        dateNeeded: Date = new Date(),
        deliveryMode: string='',
        status: string='NEW',
        total: number=0,
        submittedDate: Date = new Date(),
        reasonForRejection: string=''
    )
    {
        this.id = id;
        this.user = user;
        this.requestNumber = requestNumber;
        this.description = description;
        this.justification = justification;
        this.dateNeeded = dateNeeded;
        this.deliveryMode = deliveryMode;
        this.status = status;
        this.total = total;
        this.submittedDate = submittedDate;
        this.reasonForRejection = reasonForRejection;
    }
}