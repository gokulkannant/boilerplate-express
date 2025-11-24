let express = require('express');
let app = express();
require('dotenv').config()
let bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//middleware to log requests
app.use(function (req, res, next) {
    console.log(req.method + " " + req.path + " - " + req.ip);
    next();
});

//task 5

let users = [];
let exercises = {};

// generate unique IDs
const uid = () => Math.random().toString(16).slice(2);


//create user
app.post("/api/users", (req, res) => {
    const username = req.body.username;

    const _id = uid();

    const newUser = { username, _id };
    users.push(newUser);

    exercises[_id] = [];

    res.json(newUser);
});


//get all users
app.get("/api/users", (req, res) => {
    res.json(users);
});


//add exercise
app.post("/api/users/:_id/exercises", (req, res) => {
    const userId = req.params._id;
    const user = users.find(u => u._id === userId);

    if (!user) return res.json({ error: "User not found" });

    let { description, duration, date } = req.body;

    duration = Number(duration);

    if (!date || date === "") {
        date = new Date();
    } else {
        date = new Date(date);
    }

    const exerciseObj = {
        description,
        duration,
        date: date.toDateString()
    };

    // save to db
    exercises[userId].push(exerciseObj);

    res.json({
        username: user.username,
        description,
        duration,
        date: exerciseObj.date,
        _id: user._id
    });
});


//get full logs
app.get("/api/users/:_id/logs", (req, res) => {
    const userId = req.params._id;
    const user = users.find(u => u._id === userId);

    if (!user) return res.json({ error: "User not found" });

    let userLogs = exercises[userId];

    let { from, to, limit } = req.query;

    if (from) {
        const fromDate = new Date(from);
        userLogs = userLogs.filter(log => new Date(log.date) >= fromDate);
    }

    if (to) {
        const toDate = new Date(to);
        userLogs = userLogs.filter(log => new Date(log.date) <= toDate);
    }

    if (limit) {
        userLogs = userLogs.slice(0, Number(limit));
    }

    res.json({
        username: user.username,
        count: userLogs.length,
        _id: user._id,
        log: userLogs
    });
});
// task 5



//ip address, language, software 
app.get("/api/whoami", function (req, res) {
    res.json({
        ipaddress: req.ip,
        language: req.headers["accept-language"],
        software: req.headers["user-agent"]
    });
});

//url shortener 
let urlDatabase = [];
let id = 1;


const validUrl = urlString => {
    try {
        const urlObj = new URL(urlString);
        return urlObj.protocol === "http:" || urlObj.protocol === "https:";
    } catch (e) {
        return false;
    }
};


app.post("/api/shorturl", function (req, res) {
    const originalUrl = req.body.url;


    if (!validUrl(originalUrl)) {
        return res.json({ error: "invalid url" });
    }


    const shortUrl = id++;
    urlDatabase.push({ original_url: originalUrl, short_url: shortUrl });

    res.json({
        original_url: originalUrl,
        short_url: shortUrl
    });
});


app.get("/api/shorturl/:short_url", function (req, res) {
    const shortUrl = Number(req.params.short_url);

    const record = urlDatabase.find(obj => obj.short_url === shortUrl);

    if (!record) {
        return res.json({ error: "No short URL found" });
    }

    res.redirect(record.original_url);
});

//return date
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


// serve the homepage
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/views/index.html");
});

//static files
app.use("/public", express.static(__dirname + "/public"));

//hello
app.get("/json", function (req, res) {
    var caseStyle = process.env.MESSAGE_STYLE
    if (caseStyle === "uppercase") {
        res.json({ message: "HELLO JSON" });
    } else {
        res.json({ message: "Hello json" });
    }
});


//echo
app.get("/:word/echo", function (req, res) {
    res.json({ echo: req.params.word });
});

//name get and post
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

//time server
app.get('/now', function (req, res, next) {
    req.time = new Date().toString();
    next();
}, function (req, res) {
    res.json({ time: req.time });
});

module.exports = app;




































module.exports = app;
