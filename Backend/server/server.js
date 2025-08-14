import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 9090 });
const queue = [];
const games = new Map();

console.log("WebSocket server is running on port 9090");

// Message handlers
const handleMove = (ws, data, game) => {
  if (!game || game.board[data.index] !== "") return;
  
  if (ws.symbol !== game.currentPlayer) {
    console.log(`Player ${ws.symbol} tried to move on ${game.currentPlayer} turn`);
    return;
  }

  const newBoard = [...game.board];
  newBoard[data.index] = ws.symbol;
  
  game.board = newBoard;
  game.currentPlayer = game.currentPlayer === "X" ? "O" : "X";

  console.log(`Move made by ${ws.symbol} at position ${data.index}`);
  console.log("Board state", game.board);

  // Broadcast update to all players in this game
  broadcastToGame(ws.gameId, {
    type: "update",
    board: [...game.board],
    currentPlayer: game.currentPlayer
  });
};

const handleResetRequest = (ws, game) => {
  if (!game) return;
  
  console.log(`${ws.symbol} requested a game reset`);
  game.resetRequester = ws.symbol;

  let confirmationSent = false;
  
  wss.clients.forEach((client) => {
    if (client.gameId === ws.gameId && client.symbol !== ws.symbol && client.readyState === 1) {
      console.log(`Sending reset confirmation to ${client.symbol}`);
      client.send(JSON.stringify({
        type: "reset_confirmation",
        requestedBy: ws.symbol
      }));
      confirmationSent = true;
    }
  });

  if (confirmationSent) {
    ws.send(JSON.stringify({
      type: "reset_pending",
      message: "Waiting for opponent's confirmation..."
    }));
  } else {
    ws.send(JSON.stringify({
      type: "reset_denied",
      message: "No opponent available for confirmation."
    }));
  }
};

const handleResetResponse = (ws, data, game) => {
  if (!game) return;
  
  console.log(`Reset response: ${data.approved} by ${ws.symbol}`);

  if (data.approved) {
    // Reset the game
    game.board = Array(9).fill("");
    game.currentPlayer = "X";

    console.log("Game reset executed");
    broadcastToGame(ws.gameId, {
      type: "reset",
      board: [...game.board],
      currentPlayer: game.currentPlayer
    });
  } else {
    // Notify both players that reset was denied
    broadcastToGame(ws.gameId, {
      type: "reset_denied",
      message: "Reset request was denied."
    });
  }
};

// Utility functions
const broadcastToGame = (gameId, message) => {
  wss.clients.forEach((client) => {
    if (client.gameId === gameId && client.readyState === 1) {
      client.send(JSON.stringify(message));
    }
  });
};

const createGame = (player1, player2) => {
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

  // Handle player disconnections
  const handleDisconnection = (disconnectedPlayer, otherPlayer) => {
    console.log("A player disconnected");
    if (otherPlayer && otherPlayer.readyState === otherPlayer.OPEN) {
      otherPlayer.send(JSON.stringify({ type: "end" }));
    }
  };

  player1.on("close", () => handleDisconnection(player1, player2));
  player2.on("close", () => handleDisconnection(player2, player1));
};

// WebSocket connection handler
wss.on("connection", (ws) => {
  console.log("A player is connected", ws._socket.remoteAddress, ws._socket.remotePort);
  queue.push(ws);
  console.log("Players in queue", queue.length);

  // Message handler
  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message);
      const game = games.get(ws.gameId);
      console.log("Message received:", data, "from player:", ws.symbol);

      switch (data.type) {
        case "move":
          handleMove(ws, data, game);
          break;
        case "reset_request":
          handleResetRequest(ws, game);
          break;
        case "reset_response":
          handleResetResponse(ws, data, game);
          break;
        default:
          console.log("Unknown message type:", data.type);
      }
    } catch (err) {
      console.error(`Error processing message: ${err}`);
    }
  });

  // Pair players when we have at least 2 in queue
  if (queue.length >= 2) {
    const player1 = queue.shift();
    const player2 = queue.shift();
    createGame(player1, player2);
  }
});
