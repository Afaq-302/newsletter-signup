const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

//Providing path for our static files.
app.use(express.static(__dirname + "public"));


app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html")
});

app.post("/", function(req, res) {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.emailInput;

    //created object for the new member
    const data = {
        members: [{
            email_address: email, //This will get email from the body of the post request on line:16
            status: "subscribed",
            merge_fields: {
                FNAME: firstName, //This will get the first name from the body of the post request on line:16
                LNAME: lastName //This will get the last name from the body of the post request on line:16
            }
        }]
    };

    //stringify that new made member object
    var jsonData = JSON.stringify(data);
    const url = "https://us21.api.mailchimp.com/3.0/lists/1856cbc1a7";

    const options = {
        method: "POST",
        auth: "afaq1:2eb35a85015e26816533eace8c78202b-us21"
    };

    const request = https.request(url, options, function(response) {

        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html")
        } else {
            res.sendFile(__dirname + "/failure.html")
        }

        response.on("data", function(data) {
            console.log(JSON.parse(data));
        });
    });
    console.log(request.status);
    request.write(jsonData);
    request.end();
});

//This will redirect to the home page when the try again button in clicked on failure Page
app.post("/failure", function(req, res) {
    res.redirect("/")
})

app.listen(process.env.PORT || 3000, function() {
    console.log("Server Port: 3000");
});

// API Key
//2eb35a85015e26816533eace8c78202b-us21 
//List ID: 1856cbc1a7