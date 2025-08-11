import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 9090 });
const queue = [];
const games = new Map();

console.log("WebSocket server is running on port 9090");

wss.on("connection", (ws) => {
  console.log("A player is connected", ws._socket.remoteAddress, ws._socket.remotePort);
  queue.push(ws);
  console.log("Players in queue", queue.length);

  // Add message listener for each connection
  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message);
      const game = games.get(ws.gameId);
      console.log("Message received:", data, "from player:", ws.symbol);
      
      if (data.type === "move" && game && game.board[data.index] === "") {
        if (ws.symbol !== game.currentPlayer) {
          console.log(`Player ${ws.symbol} tried to move on ${game.currentPlayer} turn`);
          return;
        }
        
        game.board[data.index] = ws.symbol;
        game.currentPlayer = game.currentPlayer === "X" ? "O" : "X";

        console.log(`Move made by ${ws.symbol} at position ${data.index}`);
        console.log("Board state", game.board);
        
        // Broadcast to players in this game
        wss.clients.forEach((client) => {
          if (client.gameId === ws.gameId && client.readyState === 1) {
            client.send(JSON.stringify({
              type: "update",
              board: game.board,
              currentPlayer: game.currentPlayer
            }));
          }
        });
      }

      if(data.type === "reset_request") {
        if(game) {
          console.log(`${ws.symbol} requested a game reset`);
          
          // Send confirmation request to the other player
          let confirmationSent = false;
          wss.clients.forEach((client) => {
            if (client.gameId === ws.gameId && client !== ws && client.readyState === 1) {
              console.log(`Sending reset confirmation to ${client.symbol}`);
              client.send(JSON.stringify({
                type: "reset_confirmation",
                requestedBy: ws.symbol
              }));
              confirmationSent = true;
            }
          });
          
          if (confirmationSent) {
            // Notify the requester that confirmation is pending
            ws.send(JSON.stringify({
              type: "reset_pending",
              message: "Waiting for opponent's confirmation..."
            }));
          } else {
            console.log("No other player found to send confirmation to");
            ws.send(JSON.stringify({
              type: "reset_denied",
              message: "No opponent available for confirmation."
            }));
          }
        }
      }

      if(data.type === "reset_response") {
        if(game) {
          console.log(`Reset response received: ${data.approved ? 'approved' : 'denied'} by ${ws.symbol}`);
          
          if(data.approved) {
            // Reset approved - reset the game
            game.board = Array(9).fill("");
            game.currentPlayer = "X";
            console.log("Game reset approved and executed:", game);
            
            // Broadcast reset to both players
            wss.clients.forEach((client) => {
              if (client.gameId === ws.gameId && client.readyState === 1) {
                console.log(`Sending reset confirmation to ${client.symbol}`);
                client.send(JSON.stringify({
                  type: "reset",
                  board: game.board,
                  currentPlayer: game.currentPlayer
                }));
              }
            });
          } else {
            // Reset denied - notify both players
            console.log("Reset denied, notifying both players");
            wss.clients.forEach((client) => {
              if (client.gameId === ws.gameId && client.readyState === 1) {
                client.send(JSON.stringify({
                  type: "reset_denied",
                  message: "Reset request was denied."
                }));
              }
            });
          }
        }
      }
    } catch (err) {
      console.error(`Error processing message: ${err}`);
    }
  });

  if (queue.length >= 2) {
    const player1 = queue.shift();
    const player2 = queue.shift();
    const gameId = Date.now();

    games.set(gameId, {
      board: Array(9).fill(""),
      currentPlayer: "X",
      players: [player1, player2],
    });

    player1.gameId = gameId;
    player2.gameId = gameId;

    player1.symbol = "X";
    player2.symbol = "O";

    console.log(`Game ${gameId} started: ${player1.symbol} vs ${player2.symbol}`);

    player1.send(JSON.stringify({ type: "start", symbol: "X" }));
    player2.send(JSON.stringify({ type: "start", symbol: "O" }));

    const handleClose = (player, opponent) => {
      console.log("A player disconnected");
      if (opponent && opponent.readyState === opponent.OPEN) {
        opponent.send(JSON.stringify({ type: "end" }));
      }
    };

    player1.on("close", () => handleClose(player1, player2));
    player2.on("close", () => handleClose(player2, player1));
  }
});
