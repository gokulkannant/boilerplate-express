let express = require('express');
let app = express();
require('dotenv').config()
let bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

app.use(function (req, res, next) {
    console.log(req.method + " " + req.path + " - " + req.ip);
    next();
});

app.get("/api/whoami", function (req, res) {
    res.json({
        ipaddress: req.ip,
        language: req.headers["accept-language"],
        software: req.headers["user-agent"]
    });
});


app.get("/api/:date?", function (req, res) {
    let dateString = req.params.date;


    if (!dateString) {
        let now = new Date();
        return res.json({
            unix: now.getTime(),
            utc: now.toUTCString()
        });
    }


    if (!isNaN(dateString)) {
        dateString = Number(dateString);
    }


    let date = new Date(dateString);


    if (date.toString() === "Invalid Date") {
        return res.json({ error: "Invalid Date" });
    }


    res.json({
        unix: date.getTime(),
        utc: date.toUTCString()
    });
});


app.get("/", function (req, res) {
    res.sendFile(__dirname + "/views/index.html");
});

app.use("/public", express.static(__dirname + "/public"));


app.get("/json", function (req, res) {
    var caseStyle = process.env.MESSAGE_STYLE
    if (caseStyle === "uppercase") {
        res.json({ message: "HELLO JSON" });
    } else {
        res.json({ message: "Hello json" });
    }
});

app.get("/:word/echo", function (req, res) {
    res.json({ echo: req.params.word });
});


app.get("/name", function (req, res) {
    const first = req.query.first;
    const last = req.query.last;

    res.json({ name: first + " " + last });
});

app.post("/name", function (req, res) {
    const first = req.body.first;
    const last = req.body.last;

    res.json({ name: first + " " + last });
});

app.get('/now', function (req, res, next) {
    req.time = new Date().toString();
    next();
}, function (req, res) {
    res.json({ time: req.time });
});

module.exports = app;




































module.exports = app;
