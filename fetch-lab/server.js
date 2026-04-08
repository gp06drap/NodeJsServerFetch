"use strict";

const express = require('express');
const app = express();
let messages = [
  { id: 1, text: "Welcome to the message board!", author: "Admin" },
];
let nextId = 2;


// Serve static files from the 'public' folder
app.use(express.static('public'));

// Parse JSON request bodies (needed for POST)
app.use(express.json());

// ---- Your endpoints go below this line ----



// ---- Your endpoints go above this line ----

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.get('/hello', (req, res) => {
    res.type('text').send('Hello from the server!');
});

app.get('/api/time', (req, res) => {
    let curDate = new Date();
    res.set("Content-Type", "application/json");
    res.json({
        "currentTime": curDate,
        "message": "Current server time"
    });
});

app.get('/api/greet/:name', (req, res) => {
    let name = req.params.name;
    res.json({
        "greeting": "Hello, " + name + "! Welcome to the API."
    });
});

app.get('/api/math', (req, res) => {
    let aValue = parseFloat(req.query.a);


    let bValue = parseFloat(req.query.b);
    let operate = req.query.operation;
    let result;

    if (operate === "add") {
        result = aValue + bValue;
    }
    else if (operate === "subtract") {
        result = aValue - bValue;
    }
    else if (operate === "multiply") {
        result = aValue * bValue;
    }
    else if (operate === "divide") {
        if (bValue === 0) {
            res.status(400).json({ "error": "Cannot divide by zero" });
        }
        result = aValue / bValue;
    } else {
        res.status(400).json({ "error": "Invalid or missing operation. Use: add, subtract, multiply, divide" });
    }

    res.json({
        "a": aValue,
        "b": bValue,
        "operation": operate,
        "result": result
    })
});

app.get('/api/slow', (req, res) => {
  setTimeout(() => {
    res.json({
      message: "Sorry for the wait!",
      delayMs: 3000
    });
  }, 3000);
});

app.get('/api/unreliable', (req, res) => {
  const rand = Math.random();
  if (rand < 0.5) {
    res.status(500).json({
      error: "Server had a bad day. Try again!"
    });
  } else {
    res.json({
      message: "Lucky! It worked this time.",
      luckyNumber: Math.floor(Math.random() * 100)
    });
  }
});

app.get('/api/messages', (req, res) => {
    res.json({"messages": messages});
});

app.post('/api/messages', (req,res) => {

    console.log(req.body);

    if (req.body.text != null && req.body.author != null){
        let newResp = {id: nextId,
        text: req.body.text,
        author: req.body.author};
        nextId++;    

        messages.push(newResp);

        res.status(201).json(newResp);
    }
    else {
        res.status(400).json({ "error": "Include text and author in body" });
    }
});