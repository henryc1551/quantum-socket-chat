const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = process.env.PORT || 10000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'secureChatKey',
    resave: false,
    saveUninitialized: true
}));

const users = [{ username: 'henryk', password: 'LeonQ!2025' }];

function checkAuth(req, res, next) {
    if (req.session && req.session.user) return next();
    res.redirect('/login');
}

app.get('/', checkAuth, (req, res) => {
    res.render('chat');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        req.session.user = user;
        res.redirect('/');
    } else {
        res.redirect('/login');
    }
});

io.on('connection', socket => {
    console.log('Nowe połączenie użytkownika');
    socket.on('chat message', msg => {
        io.emit('chat message', msg);
    });
});

server.listen(PORT, () => {
    console.log(`Quantum Chat działa na porcie ${PORT}`);
});
