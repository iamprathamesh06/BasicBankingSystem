const express = require("express");
const fs = require("fs");
var PORT  = 80;
const bodyParser = require("body-parser");
const app = express();
htmlFile = fs.readFileSync("./app/pages/index.html", "utf-8");
customerFile = fs.readFileSync("./app/pages/customers.html", "utf-8");
tranferMoney = fs.readFileSync("./app/pages/transfer.html", "utf-8");
transactionFile = fs.readFileSync("./app/pages/transactions.html","utf-8");
app.use("/css", express.static("./app/css"));
app.use("/assets", express.static("./app/assets"));
app.use("/js", express.static("./app/js"));
app.use(bodyParser.urlencoded({ extended: true }));

const { MongoClient } = require("mongodb");
const uri =
  "mongodb+srv://<account ID>:<password>@onlinebanking.8a31p.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect().then((client) => {
  const db = client.db("Customers");
  const customerCollection = db.collection("customerData");
  const transactionHistory = db.collection("transactionHistory");
  app.get("/", (req, res) => {
    res.status(200);
    res.send(htmlFile);
  });

  app.get("/customers", (req, res) => {
    res.status(200);
    res.send(customerFile);
  });

  app.get("/transfer", (req, res) => {
    res.status(200);
    res.send(tranferMoney);
  });

  app.get("/customer-data", (req, res) => {
    db.collection("customerData")
      .find()
      .toArray()
      .then((customerData) => {
        res.send(customerData);
      })
      .catch((err) => console.log(err));
  });

  app.post("/addCustomer", (req, res) => {
    res.status(200);
    res.setHeader("Content-Type", "text/html");
    // console.log(req.body);
    customerCollection
      .insertOne({
        customerName:
          req.body.newCustomerFirstName + " " +req.body.newCustomerLastName,
        customerBal: parseInt(req.body.newCustomerBalance),
        accountNumber: parseInt(req.body.newAccountNumber),
        customerID: parseInt(req.body.newCustomerID),
      })
      .catch((err) => console.log(err));

    res.write(`
    <!DOCTYPE html>
    <html lang="en">
    
    <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="refresh" content="6; url='http://localhost/customers'" />
    <title>New User Confirmation</title>
    </head>
    
    <body>
    <img style="width: 80px;
    margin: auto auto;
    display: block;" src="./assets/tick.png" alt="">
    <h1 style="text-align:center"> New User Added Succesfully.</h1>
    <h4 style="text-align:center; color:blue ">You shortly redirect to Customers Page..</h4>
    </body>
    
    </html>
    `);
    res.end();
    // console.log("New customer joined");
  });

  app.post("/deleteCustomer", (req, res) => {
    res.status(200);
    res.setHeader("Content-Type", "text/html");
    // console.log(req.body);
    customerCollection.deleteOne({
      customerName: req.body.nameList,
    });
    res.write(`
    <!DOCTYPE html>
    <html lang="en">
    
    <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="refresh" content="6; url='http://localhost/'" />
    <title>Customer Deleted</title>
    </head>
    
    <body>
    <img style="width: 80px;
    margin: auto auto;
    display: block;" src="./assets/tick.png" alt="">
    <h1 style="text-align:center">Customer account is deleted succesfully</h1>
    <h4 style="text-align:center; color:blue ">You shortly redirect to Customers Page..</h4>
    </body>
    
    </html>
    `);
    res.end();
    // console.log("Customer Deleted");
  });

  app.post("/transfer", (req, res) => {
    res.status(200);
    res.setHeader("Content-Type", "text/html");
    // console.log("We have got INFO: ", req.body);
    transfererName = req.body.transfererName;
    receiverName = req.body.nameList;
    let transfererPreviousBal = 0,
      receiverPreviousBal = 0;

    //   Getting transfererPrevious Balance from DataBase
    customerCollection
      .find({ customerName: transfererName })
      .toArray()
      .then((customerData) => {
        customerData.forEach((customer) => {
          setTimeout(() => {
            transfererPreviousBal = customer.customerBal;
            // console.log(transfererPreviousBal);
          }, 1000);
        });
      })
      .catch((err) => console.log(err));

    //   Getting Receiver Previous Balance from DataBase
    customerCollection
      .find({ customerName: receiverName })
      .toArray()
      .then((customerData) => {
        customerData.forEach((customer) => {
          setTimeout(() => {
            receiverPreviousBal = customer.customerBal;
            // console.log(receiverPreviousBal);
          }, 1000);
        });
      })
      .catch((err) => console.log(err));

    setTimeout(() => {
      // console.log(transfererPreviousBal, "After 7 s", receiverPreviousBal);
      if (parseInt(req.body.Amount) > transfererPreviousBal) {
        let rejectedHtml = `
        <!DOCTYPE html>
        <html lang="en">
        
        <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="refresh" content="3; url='http://localhost/'" />
        <title>Payment Rejected</title>
        </head>
        
        <body>
        <img style="width: 80px;
        margin: auto auto;
        display: block;" src="./assets/cancel.jpg" alt="">
        <h1 style="text-align:center">Transaction Failed</h1>
        <h3 style="text-align:center">Enter amount lesser than ${transfererPreviousBal}</h3>
        <h4 style="text-align:center; color:blue ">You shortly redirect to Home Page..</h4>
        </body>
        
        </html>
        `;
        res.write(rejectedHtml);
        res.end();
      } else 
      {

        let ConfirmationHtml = `
        <!DOCTYPE html>
        <html lang="en">
        
        <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="refresh" content="3; url='http://localhost/'" />
        <title>Payment Confirmation</title>
        </head>
        
        <body>
        <img style="width: 80px;
        margin: auto auto;
        display: block;" src="./assets/tick.png" alt="">
        <h1 style="text-align:center"> Your Payment Done Succesfully </h1>
        <h4 style="text-align:center; color:blue ">You shortly redirect to Home Page..</h4>
        </body>
        
        </html>
        `;
        res.write(ConfirmationHtml);
        res.end();
        // Subtracting Amount from sender's Account No.
        customerCollection.updateOne(
          {
            customerName: transfererName,
          },
          {
            $set: {
              customerBal: transfererPreviousBal - parseInt(req.body.Amount),
            },
          }
        );

        // Adding Amount to Receiver's Account No
        customerCollection.updateOne(
          {
            customerName: receiverName,
          },
          {
            $set: {
              customerBal: receiverPreviousBal + parseInt(req.body.Amount),
            },
          }
        );
        let transaction = {
          transName : transfererName ,
          receName : receiverName,
          amount : parseInt(req.body.Amount)
        }
        transactionHistory.insertOne(transaction);
      }


    }, 7000);
    // console.log(findPrevious(req.body.nameList));
  });


  app.get('/transaction-data',(req,res)=>{
    transactionHistory.find().toArray()
    .then(transacionData => {
      res.send(transacionData);
    })
    .catch(err => console.log(err));
  })

  app.get('/transactions',(req,res)=>{
    res.status(200);
    res.send(transactionFile);
  })
  app.listen(PORT, () => {
    console.log("Server is started at port 80.");
  });
});
