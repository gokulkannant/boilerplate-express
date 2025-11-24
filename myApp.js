let express = require('express');
let app = express();

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/views/index.html");
});

app.use("/public", express.static(__dirname + "/public"));

app.get("/json", function (req, res) {
    res.json({ message: "Hello json" });
});


module.exports = app;




































module.exports = app;
