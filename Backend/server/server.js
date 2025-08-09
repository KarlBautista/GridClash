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
    const gameId = Date.now();

    games.set(gameId, {
      board: Array(9).fill(""),
      currentPlayer: "X",
      players: [player1, player2]
    })

    player1.gameId = gameId;
    player2.gameId = gameId;

    player1.symbol = "X";
    player2.symbol = "O";

    console.log(`Game ${gameId} started: ${player1.symbol} vs ${player2.symbol}`);

    player1.send(JSON.stringify({ type: "start", symbol: "X"}));
    player2.send(JSON.stringify({ type: "start", symbol: "O"}));

    ws.on("error", (error) => {
      console.log("Websocket Error", error)
    })


    ws.on("close", () => {
      console.log("A player disconnected");
      player1.send(JSON.stringify({ type: "end"}));
      player2.send(JSON.stringify({ type: "end" }));
    })

  }
});


