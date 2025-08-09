import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 9090 });
const queue = [];
const games = new Map();

console.log("WebSocket server is running on port 9090");
wss.on("connection", (ws) => {
  console.log("A player is connected", ws._socket.remoteAddress, ws._socket.remotePort);
  queue.push(ws);
  console.log("Players in queue", queue.length);

  if(queue.length >= 2) {
    const player1 = queue.shift();
    const player2 = queue.shift();

    console.log("player1:", player1._socket.remoteAddress, player1._socket.remotePort);
    console.log("player2:", player2._socket.remoteAddress, player2._socket.remotePort);

    player1.send("You are player 1, The game begins");
    player2.send("You are player 2, The game begins");

   player1.on("close", () => {
  console.log("Player 1 disconnected");
    player2.send("Player 1 disconnected, the game ends")
});

player2.on("close", () => {
  console.log("Player 2 disconnected");
    player1.send("Player 2 disconnected, the game ends");
});

  }
});


