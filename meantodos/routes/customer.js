var express = require("express"); 
var app = express.Router();
var mssql = require("mssql"); 
var webRequest = require('request');




// for sending emails
var email = require("emailjs");
var server 	= email.server.connect({
   user:    "AliTaxi.no.reply@gmail.com", 
   password: "weboth951", 
   host:    "smtp.gmail.com", 
   ssl:     true
});

app.post('/sendemail', function (req, res, next) {

var EmailObj = req.body;
console.log(EmailObj.cusEmail)
console.log(EmailObj.subject)
console.log(EmailObj.content)

server.send({
   text:    EmailObj.content, //"i hope this works", 
   from:    "<AliTaxi@no-reply.com>", 
   to:      EmailObj.cusEmail,  //"myself <alishanuta2014@gmail.com>",
   //cc:      "",
   subject:  EmailObj.subject  //"testing emailjs"
}, function(err, message) { 
    console.log(err || message); 
    if(err)
        console.log(err);
    else
        res.json({success: true, msg: 'sent'});

    });
 });



// For local SQL SERVER DB
var dbConfig = {
    user: 'alishan92',
    password: 'allah1992',
    server: 'HP-DV7\\SQLEXPRESS',
    database: 'TestDb',
    port: 1433
}

// // For Azure Cloud SQL SERVER DB
// var dbConfig = {
//     user: 'alishan92',
//     password: 'Allah1992!',
//     server: 'alitaxi.database.windows.net',
//     database: 'AliTaxiDB',
//     port: 1433,
//     options: { encrypt: 'true', database: 'AliTaxiDB'}
// }

var connection = mssql.connect(dbConfig, function (err) {
    if (err)
        throw err; 
});

module.exports = connection; 

module.exports = app;

var request = new mssql.Request();

app.get('/customer', function (req, res, next) {
    
    request.query('SELECT LastName FROM [TestDb].[dbo].[Customer] WHERE CustID = 1', function (err, result) {
        if (err) 
            return next(err);

        //var data = {};
        //data["user"] = result.recordset;
        //res.send(data);   
        res.json(result.recordset);   
    }); 
}); 

app.get('/getsaveddata/:id', function (req, res, next) {
    
    var result = request.query("SELECT " +req.params.id+ " FROM [TestDb].[dbo].[Customer] WHERE CustID = 123", function (err, result) {
        if (err) 
            return next(err);

        res.json(result.recordset);   
        console.log('took data by the id from the DB');
        console.log(result);
    }); 
}); 


// app.get('/getgoogledistance/:id') {
    
//     var result = request('https://maps.googleapis.com/maps/api/distancematrix/json?origins=490+Clear+Creek+Lane+Coppell+Texas&destinations=5080+spectrum+drive+addsion+Texas &mode=driving&language=en-US&units=imperial&key=AIzaSyD3HOzxe15DyICCdTGLGHhkenAvi23lUuQ') 
//         if (result.err) 
//             return next(err);

//     };

app.get('/getgoogledistance/:id', function (req, res, next) {
    
   var result = webRequest('https://maps.googleapis.com/maps/api/distancematrix/json?origins='+req.params.id+'&mode=driving&language=en-US&units=imperial&key=AIzaSyD3HOzxe15DyICCdTGLGHhkenAvi23lUuQ', function (err, result) {
        if (err) 
            return next(err);

        console.log(result);

         res.json(result);
        
        console.log('Got Google Distance Data');
    }); 
}); 


app.get('/savedcustomer/:id', function (req, res, next) {

     //var DatOneCust = req.body;
    //'" + DatOneCust.custName + "')"
   var result = request.query("SELECT * FROM [TestDb].[dbo].[Customer] WHERE CustID = "+req.params.id, function (err, result) {
        if (err) 
            return next(err);

        //var data = {};
        //data["user"] = result.recordset;
        //res.send(data);   
        res.json(result.recordset); 
        console.log('took all the data by the id from the DB');
        console.log(result);  
    }); 
}); 

app.get('/getemail/:id', function (req, res, next) {

    //var DatOneCust = req.body

   var result = request.query("SELECT EmailAddr FROM [TestDb].[dbo].[Customer] WHERE EmailAddr = '"+req.params.id+"' AND CusAccepted = 'true' AND (DriverDeclineReq is NULL AND RideAccepted is NULL AND PastRequest is NULL)", function (err, result) {
        if (err) 
            return next(err);

            res.json(result.recordset); 
            console.log('found the email in the DB!');
            console.log(result); 
            console.log(+req.params.id+ + " this is the email in the service"); 
          
    }); 
});

app.get('/allcustomers', function (req, res, next) {

   var result = request.query("SELECT * FROM [TestDb].[dbo].[Customer] where CusAccepted = 'true' and (DriverDeclineReq is NULL and PastRequest is NULL) ORDER BY PickUpDate ASC", function (err, result) {
        if (err) 
            return next(err);
        else 
            {
                 res.json(result.recordset); 
                console.log('Here is the list of customers from DB!');

            }
    }); 
}); 


app.get('/checkcustid/:id', function (req, res, next) {

     //var DatOneCust = req.body;
    //'" + DatOneCust.custName + "')"
   var result = request.query("SELECT CASE WHEN EXISTS (SELECT TOP 1 * FROM [TestDb].[dbo].[Customer] WHERE CustID = "+req.params.id+") THEN CAST (1 AS BIT) ELSE CAST (0 AS BIT) END", function (err, result) {
        if (err) 
            return next(err);

        //var data = {};
        //data["user"] = result.recordset;
        //res.send(data);   
       var newResponse = res.json(result.recordset); 
        console.log('Checking DB for duplicate CustID');
        console.log(newResponse + ' This is the response from DB usinf json string');  
    }); 
}); 

app.post('/getadmin', function (req, res, next) {

    var adminCred = req.body;
    console.log(req.Username + ' - Admin made it to API call!');
    console.log(adminCred.Username + ' - Admin made it to API call!');
    console.log(adminCred.Password + ' - Admin made it to API call!');



   var result = request.query("SELECT Username,Password FROM [TestDb].[dbo].[AdminUser] Where Username = '" +adminCred.Username+ "' and Password = '" +adminCred.Password+ "'", function (err, result) {
        if (err) 
            return next(err);
   
       res.json(result.recordset); 
        console.log('Admin made it to API call!');
        //console.log(newResponse + ' This is the response from DB using json string');  
    }); 
}); 


app.post('/addnewreview', function (req, res, next) {

    var CusReview = req.body;
    console.log(CusReview.comment + ' - review made it to API call!');


   var result = request.query("INSERT INTO [TestDb].[dbo].[CustomerReviews] (Reviews, CommentDate, FullCusName) VALUES ('" +CusReview.comment+ "', '"+CusReview.CommentDate+"', '" +CusReview.FullCustomerName+ "');", function (err, result) {
        if (err) 
            return next(err);
   
       res.json(result.rowsAffected); // if no value is returning, meaning you are not "select from to get values", then use "rows affected" because if you are not getting anything and using "recordset" then you will get error: "Unexpected end of JSON input" 
    }); 
}); 


app.post('/deletereview', function (req, res, next) {

    var ExistingComment = req.body;
    console.log(ExistingComment.Review + ' made it to API call!');
    
     //var deleteComment = getRequestString(ExistingComment.Review);

   var result = request.query("DELETE FROM [TestDb].[dbo].[CustomerReviews] WHERE CONVERT(VARCHAR, Reviews) = '"+ExistingComment.Review+"'", function (err, result) {
        if (err) 
            return next(err);
   
       res.json(result.rowsAffected); 
    }); 
}); 




app.get('/getreviews', function (req, res, next) {


   var result = request.query("SELECT * FROM [TestDb].[dbo].[CustomerReviews] ORDER BY CommentDate DESC", function (err, result) {
        if (err) 
            return next(err);
   
       res.json(result.recordset); 
       console.log(res);
    }); 
}); 

app.get('/ridepaymentinfo', function (req, res, next) {


   var result = request.query("SELECT * FROM [TestDb].[dbo].[RidePayment]", function (err, result) {
        if (err) 
            return next(err);
   
       res.json(result.recordset); 
       console.log(res);
    }); 
}); 




app.post('/updateridepaymentinfo', function (req, res, next) {

    var Pricing = req.body;
    console.log(Pricing.FeePerMile + ' - per mile made it to API call!');
    console.log(Pricing.FeePerPassenger+ " per passenger made it to API call!")
    console.log(Pricing.BaseFee+ " BaseFee made it to API call!")


   var result = request.query("UPDATE [TestDb].[dbo].[RidePayment] SET FeePerMile ="+Pricing.FeePerMile+", FeePerPassenger ="+Pricing.FeePerPassenger+", BaseFee ="+Pricing.BaseFee, function (err, result) {
        if (err) 
            return next(err);
   
       res.json(result.rowsAffected); 
        //console.log(newResponse + ' This is the response from DB using json string');  
    }); 
}); 






app.post('/modifycusrequest', function (req, res, next) {

    var emailObj = req.body;
    console.log(emailObj.email + "  modify cus request email made it into API Call")



   var result = request.query("UPDATE [TestDb].[dbo].[Customer] SET CusAccepted='false' WHERE EmailAddr = '"+emailObj.email+"' And (DriverDeclineReq is NULL AND RideAccepted is NULL AND CusAccepted = 'true')", function (err, result) {
        if (err) 
            return next(err);
   
       res.json(result.rowsAffected); 
        //console.log(newResponse + ' This is the response from DB using json string');  
    }); 
});










app.post('/updatepastrequest', function (req, res, next) {

    var TodayDate = req.body;


   var result = request.query("UPDATE [TestDb].[dbo].[Customer] SET PastRequest = 'true' where PickUpDate < '"+TodayDate.date+"'", function (err, result) {
        if (err) 
            return next(err);
   
       res.json(result.rowsAffected); 

    }); 
}); 




app.post('/cusacceptedamt', function (req, res, next) {

    var emailObj = req.body;
    console.log(emailObj.email + ' - cusacceptedamt made it to API call!');
    console.log(emailObj.acceptedAmt+ " acceptedAmt made it to API call!")


   var result = request.query("UPDATE [TestDb].[dbo].[Customer] SET CusAccepted = 'true', AcceptedAmt = "+emailObj.acceptedAmt+", OrignalAmt = " +emailObj.OrignalAmt+ " WHERE EmailAddr = '" +emailObj.email+ "'", function (err, result) {
        if (err) 
            return next(err);
   
       res.json(result.rowsAffected); 
        //console.log(newResponse + ' This is the response from DB using json string');  
    }); 
}); 

app.post('/cusdeclinedamt', function (req, res, next) {

    var emailObj = req.body;
    console.log(emailObj.email + ' - cusacceptedamt made it to API call!');
    console.log(emailObj.CusComment+ " CusComment made it to API call!")


   var result = request.query("UPDATE [TestDb].[dbo].[Customer] SET CusAccepted = 'false', CustComment = '"+emailObj.CusComment+"', OrignalAmt = " +emailObj.OrignalAmt+ " WHERE EmailAddr = '" +emailObj.email+ "'", function (err, result) {
        if (err) 
            return next(err);
   
       res.json(result.rowsAffected); 
        //console.log(newResponse + ' This is the response from DB using json string');  
    }); 
}); 


app.post('/driverdeclined', function (req, res, next) {

    var DeclineCustReqObj = req.body;
    console.log(DeclineCustReqObj.cusEmail + ' - cusacceptedamt made it to API call!');
    console.log(DeclineCustReqObj.driverComment+ " CusComment made it to API call!")


   var result = request.query("UPDATE [TestDb].[dbo].[Customer] SET DriverDeclineReq = 'true', DriverComment= '"+DeclineCustReqObj.driverComment+"' WHERE EmailAddr = '"+DeclineCustReqObj.cusEmail+"';", function (err, result) {
        if (err) 
            return next(err);
   
       res.json(result.rowsAffected); 
        //console.log(newResponse + ' This is the response from DB using json string');  
    }); 
}); 


// app.get('/adduser', function (req, res) {

//     request.query("INSERT INTO [TestDb].[dbo].[Customer] (CustID,LastName,FirstName,CustAddress, City) VALUES (2, 'some', 'dummy', 'ok street','LA')", function (err, result) {
//         if (err) 
//             return next(err);

//         res.json(result);
//     });
// }); 


// Save Customer
app.post('/addcust', function(req, res, next){
    var cust = req.body;

    console.log(cust.LastName + " - add cust last name value")
    // if(!cus.FirstName || !cust.LastName){
    //     res.status(400);
    //     res.json({
    //         "error": "Empty Data" 
    //     });
    // } else {
        request.query("INSERT INTO [TestDb].[dbo].[Customer] (CustID, LastName, FirstName, CustAddress, DropOffLoc, PhoneNum, EmailAddr, PickUpDate, NumOfPassengers, PickUpTime) VALUES (" +cust.CustID+ ",'" +cust.LastName+ "','" +cust.FirstName+ "','" +cust.CustAddress+ "','" +cust.DropOffLoc+ "'," +cust.PhoneNum+ ",'" +cust.EmailAddr + "','" +cust.PickUpDate+ "','" +cust.NumOfPassengers+ "','" +cust.PickUpTime+ "')", function (err, result) {
            if(err){
                console.log(err);
                console.log('did not make it into DB');
                res.send(err); 
            } else {
                res.json(result);
                console.log('FULL customer made it into the database - ' + cust.PickUpDate);
            }
        });
    //}
});

app.post('/addonecust', function(req, res, next){
    
    var DatOneCust = req.body;
    console.log(DatOneCust.custName + " dat one cust")

    request.query("INSERT INTO [TestDb].[dbo].[Customer] (FirstName) VALUES ('" + DatOneCust.custName + "')", function (err, result) {
        if (err) 
            return next(err);

        res.json(result.recordset);   

        console.log('customer made it into the database');

        });
});

app.put('/updatecustfield/:id', function(req, res, next){
    
    var fieldValue = req.body;
    console.log(fieldValue.CustField + " THIS IS THE FieldValue"); 
    console.log(req.params.id + " THIS IS THE Customer ID used in the update service");

    var result = request.query("UPDATE [TestDb].[dbo].[Customer] SET " +fieldValue.FieldName+ " = '" +fieldValue.CustField+ "' Where CustID = " +req.params.id, function (err, result) {
        if (err) 
            return next(err);

        res.json(result.rowsAffected);   

        console.log('Customer UPDATED in the database');
        console.log(result); 

        });
});


app.put('/updaterequestaccept', function(req, res, next){
    
    var fieldValue = req.body;

    var result = request.query("UPDATE [TestDb].[dbo].[Customer] SET RideAccepted = '" +fieldValue.obj+ "' Where EmailAddr = '"+fieldValue.email+"'", function (err, result) {
        if (err) 
            return next(err);

        res.json(result.rowsAffected);   

        console.log('Customer UPDATED in the database to TRUE');
        console.log(result); 

        });
});


app.put('/deletecustomer', function(req, res, next){
    
    var fieldValue = req.body;

    var result = request.query("DELETE FROM [TestDb].[dbo].[Customer] Where CustID = "+fieldValue.custID, function (err, result) {
        if (err) 
            return next(err);

        res.json(result.rowsAffected);   

        console.log('Customer DELETED from the database');
        console.log(fieldValue.custID); 

        });
});