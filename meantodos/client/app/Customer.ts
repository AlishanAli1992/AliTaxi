export class Customer {
    CustID: number;
    FirstName: string;
    LastName: string;
    CustAddress: string;
    DropOffLoc: string;
    PhoneNum: number;
    EmailAddr: string;
    RideAccepted: boolean;
    PickUpDate: string;
    CustComment: string;
    AcceptedAmt: number;
    OrignalAmt: number;
    PickUpTime: string; // newly added

    constructor(){
        this.PickUpDate.slice(0,10);
    }

}