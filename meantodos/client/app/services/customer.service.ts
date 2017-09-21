import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()   // this is the middleware layer to connect Rest API to Components. Component calls the service and service calls the API.
export class CustomerService{

    constructor(private _http:Http){
        
    }

    getSavedCustomerById(id){
        return this._http.get('/api/v2/getsaveddata/'+id)
            .map(res => res.json());
    }
    
    getCustomer(){
        return this._http.get('/api/v2/customer')
            .map(res => res.json());
            
    }

    getAllCustomers(){
        return this._http.get('/api/v2/allcustomers')
            .map(res => res.json());
            
    }

    CheckCustId(id){
        return this._http.get('/api/v2/checkcustid/'+id)
            .map(res => res.json());
            
    }


    AddReview(ReviewObj){
        console.log(ReviewObj.comment)
        return this._http.post('/api/v2/addnewreview', ReviewObj)
            .map(res => res.json());
    }
    
    DeleteReview(ExistingComment){
                console.log(ExistingComment.Review)
        return this._http.post('/api/v2/deletereview', ExistingComment)
            .map(res => res.json());
    }

    getAllReviews(){
        return this._http.get('/api/v2/getreviews')
            .map(res => res.json());
            
    }

    // get current ride payment info
    getRidePaymentDetails(){
        return this._http.get('/api/v2/ridepaymentinfo')
            .map(res => res.json());
            
    }



    UpdateRequestToDeclined(emailObj) {

         return this._http.post('/api/v2/modifycusrequest', emailObj)
            .map(res => res.json());

    }

     sendemail(EmailObj) {

        console.log(EmailObj.cusEmail)
        console.log(EmailObj.subject)
        console.log(EmailObj.content)

         return this._http.post('/api/v2/sendemail', EmailObj)
            .map(res => res.json());

    }

    
    CusAcceptedAmt(email){
        console.log(email + ' inside customer service dot ts Customer Accepted Amount')
        console.log(email.acceptedAmt+ " acceptedAmt")
        return this._http.post('/api/v2/cusacceptedamt', email)
            .map(res => res.json());
    }

    // update payment info
    UpdateRidePricing(Pricing){

        console.log(Pricing.FeePerMile + " -FeePerMile")

        return this._http.post('/api/v2/updateridepaymentinfo', Pricing)
            .map(res => res.json());
    }

    UpdateToPastRequest(TodayDate){
        
        return this._http.post('/api/v2/updatepastrequest', TodayDate)
            .map(res => res.json());
    }
    
    
    CusDeclinedAmt(email){
        console.log(email + ' inside customer service dot ts Customer Accepted Amount')
        console.log(email.acceptedAmt+ " acceptedAmt")
        return this._http.post('/api/v2/cusdeclinedamt', email)
            .map(res => res.json());
    }

    DeclineCusReq(DeclineCustReqObj){
        return this._http.post('/api/v2/driverdeclined', DeclineCustReqObj)
            .map(res => res.json());
    }
    

    getSavedCustomer(id){
        return this._http.get('/api/v2/savedcustomer/'+id)
            .map(res => res.json());
            
    }


    getExisitingEmail(id){
        console.log(id + ' inside customer service dot ts')
        return this._http.get('/api/v2/getemail/'+id)
            .map(res => res.json());
            
    }

    getGoogleDist(id){
        console.log(id + ' inside customer service dot ts GOOGLE DISTANCE')
        return this._http.get('/api/v2/getgoogledistance/'+id)
            .map(res => res.json());
            
    }

    getAdminUser(cust){
        console.log(cust)
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this._http.post('/api/v2/getadmin', JSON.stringify(cust), {headers: headers}) 
            .map(res => res.json());              
    }

    saveCustomer(cust){

        console.log(cust + ' inside customer service dot ts correctly')
        return this._http.post('/api/v2/addcust', cust) 
            .map(res => res.json());            
    }

     saveOneCus(cust){
         console.log(cust + 'inside customer service dot ts')
        return this._http.post('/api/v2/addonecust', cust)
            .map(res => res.json());
    }

    UpdateOneCusField(value, id)
    {
        console.log(value + ' reached update value method inside customer service dot ts')
        return this._http.put('/api/v2/updatecustfield/'+id, value)
            .map(res => res.json());
    }
    
     UpdateRequestAccepted(value)
    {
        console.log(value + ' reached update value method inside customer service dot ts')
        return this._http.put('/api/v2/updaterequestaccept', value)
            .map(res => res.json());
    }

     DeleteCustomer(value)
    {
        console.log(value.custID + ' reached update value method inside customer service dot ts')
        return this._http.put('/api/v2/deletecustomer', value)
            .map(res => res.json());
    }

}