const express = require("express");
const mailchimp = require("@mailchimp/mailchimp_marketing")
const bodyParser = require("body-parser");
const https = require('node:https');

const app = express();
const port = 3000;

mailchimp.setConfig({
    //API KEY
    apiKey: "774210a7562c1a8beeb7776f73b4b98d-us17 ",
    //API KEY PREFIX (THE SERVER)
    server: "us17"
})

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/signup.html");
});

app.post('/', (req, res) => {
    const firstName = req.body.fName
    const lastName = req.body.lName
    const email = req.body.email

    // res.send(firstName,lastName,email);

    const data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName,
            }
        }]
    }

    const jsonData = JSON.stringify(data);

    const url = "https://us17.api.mailchimp.com/3.0/lists/bc446623c4"

    const options = {
        method: "POST",
        auth: "terang:774210a7562c1a8beeb7776f73b4b98d-us17"
    }

    const request = https.request(url, options, function (response) {
        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
            response.on("data", function (data) {
                console.log(JSON.parse(data));
            })
        } else {
            res.sendFile(__dirname + "/failure.html");
        }


    })

    request.write(jsonData);
    request.end();

});

app.post('/failure', (req, res) => {
    res.redirect("/");
});

app.listen(process.env.PORT|| 3000,() => {
    console.log("Example app listening on port 3000")
})

// Api Keys 2 
// 774210a7562c1a8beeb7776f73b4b98d-us17

//Audience ID
// bc446623c4.