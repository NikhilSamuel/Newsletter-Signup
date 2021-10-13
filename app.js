const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();


app.use(express.static("public"));

app.use(bodyParser.urlencoded({extension : true}));

app.get("/", function(req,res) {
  res.sendFile(__dirname + "/signup.html");
})

app.post("/", function(req, res) {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email ;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  const jsonData = JSON.stringify(data); // converting the data into string as key-value pairs
  const url = "https://us5.api.mailchimp.com/3.0/lists/80e60c0695";

  const options = {
    method: "POST",
    auth:"Nikhil:f201c8254479ea5c3dd372a1cf3e2300-us5" // authentication for the api
  };

  const request = https.request(url,options,function(response) { // http request method to post data from our app to an external server

    if(response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    }else {
      res.sendFile(__dirname + "/failure.html");
    }
    response.on("data", function(data) {
      console.log(JSON.parse(data)); //logging the data that we got back from the server
    })
  });

  request.write(jsonData); //write method of request used for executing the request for post
  request.end(); //ending the request
});

app.post("/failure.html", function(req,res) {
  res.redirect("/");
})

app.listen(process.env.PORT || 3000, function() {  //listening to local server at 3000 using listen
  console.log("server is running on port 3000");
});


//f201c8254479ea5c3dd372a1cf3e2300-us5
//80e60c0695
