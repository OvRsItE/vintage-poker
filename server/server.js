const path = require('path');
const express = require('express');
const config = require('./config');
const configureMiddleware = require('./middleware');
const configureRoutes = require('./routes');
const socketio = require('socket.io');
const gameSocket = require('./socket/index');

// Init express app
const app = express();

// Config Express-Middleware
configureMiddleware(app);

// Set-up static asset path
app.use(express.static(path.join(__dirname, 'public')));

// Set-up Routes
configureRoutes(app);

// Start server and listen for connections
const server = app.listen(config.PORT, () => {
  console.log(
    `Server is running in ${config.NODE_ENV} mode and is listening on port ${config.PORT}...`,
  );
});

// Handle real-time poker game logic with socket.io
const io = socketio(server);

io.on('connection', (socket) => gameSocket.init(socket, io));

// Optional: clean exit
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled error: ${err.message}`);
  server.close(() => process.exit(1));
});
