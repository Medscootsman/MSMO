const express = require('express');
var path = require('path');
const app = express();


app.use(express.static('public'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.get('/test', function(req, res) {
    res.send("<iframe width=\"560\" height=\"315\" src=\"https://www.youtube.com/embed/62pcXHTHGy8\" frameborder=\"0\" allow=\"autoplay; encrypted-media\" allowfullscreen></iframe>")
});

app.use('/user/:id', function (req, res, next) {
    console.log('Request Type:', req.method)
    next()
});

app.get('/user/*', function(req, res) {
    res.send('hi');
});
app.post('/test/hi', function (req, res) {
    res.send('Got a POST request')
});

app.get('/login', function(req, rest) {
  res.sendFile(__dirname + "/login.html")
});


app.listen(3000, () => console.log('MSMO v0.1 Online'));
