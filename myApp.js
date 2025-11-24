let express = require('express');
let app = express();
require('dotenv').config()

app.use(function (req, res, next) {
    console.log(req.method + " " + req.path + " - " + req.ip);
    next();
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


app.get('/now', function (req, res, next) {
    req.time = new Date().toString();
    next();
}, function (req, res) {
    res.json({ time: req.time });
});

module.exports = app;




































module.exports = app;
