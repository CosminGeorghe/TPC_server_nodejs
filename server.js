var net = require("net");
const Player = require("./Player");
const Room = require("./Room");

let roomArray = [];

function getRoomBasedOnCode(roomArray, code) {
  for (let i = 0; i < roomArray.length; i++) {
    if (roomArray[i].code == Number(code)) {
      return roomArray[i];
    }
  }
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

//reveice rooms array as parameter and generate a code that is not prezent inside of it
function getUniqueCode(roomArray) {
  let isUnique = false;
  let code;
  while (!isUnique) {
    let isNotInArray = true;
    code = getRandomInt(9999);
    for (let i = 0; i < roomArray.length; i++) {
      if (roomArray[i].code == code) isNotInArray = false;
    }
    if (isNotInArray) isUnique = true;
  }
  return code;
}

var server = net.createServer();

server.on("connection", function (socket) {
  var remoteAddress = socket.remoteAddress + ":" + socket.remotePort;
  console.log("new client connection is made %s", remoteAddress);

  socket.on("data", function (d) {
    const data = JSON.parse(d);
    let currentRoom;

    let code;
    switch (data.action) {
      case "create_room":
        console.log("create room from %s", remoteAddress);
        code = getUniqueCode(roomArray);
        socket.write(code.toString());
        let playersList = [];
        playersList.push(new Player(socket, data.nickname, false, true, false));
        let room = new Room(playersList, code, [-1, -1]);
        roomArray.push(room);
        console.log(roomArray);
        break;
      case "join_room":
        console.log("join room from %s", remoteAddress);
        socket.write("join room command received");

        code = data.code;
        console.log(code);
        currentRoom = getRoomBasedOnCode(roomArray, Number(code));
        currentRoom.addPlayer(
          new Player(socket, data.nickname, false, true, false)
        );
        break;

      case "join_as_player":
        console.log("join as player from %s", remoteAddress);
        socket.write("join as Player command received");

        code = data.code;
        console.log(code);

        currentRoom = getRoomBasedOnCode(roomArray, Number(code));
        currentRoom.setPlayerAsPlayer(socket);
        break;

      case "join_as_spectator":
        console.log("join as spectator from %s", remoteAddress);
        socket.write("join as spectator command received");

        code = data.code;
        console.log(code);

        currentRoom = getRoomBasedOnCode(roomArray, Number(code));
        currentRoom.setPlayerAsSpectator(socket);
        currentRoom.setPlayerReadyState(socket, false);
        break;

      case "get_players_list":
        console.log("get players list from %s", remoteAddress);
        //socket.write("get players list command received");

        code = data.code;
        console.log(code);

        currentRoom = getRoomBasedOnCode(roomArray, Number(code));
        let playersNicknames = currentRoom.getPlayersNicknames();

        socket.write(JSON.stringify(playersNicknames));

        console.log(roomArray);
        break;

      case "get_spectators_list":
        console.log("get spectators list from %s", remoteAddress);
        //socket.write("get spectators list command receiver");

        code = data.code;
        console.log(code);

        currentRoom = getRoomBasedOnCode(roomArray, Number(code));
        let spectatorsNicknames = currentRoom.getSpectatorsNicknames();

        socket.write(JSON.stringify(spectatorsNicknames));
        console.log(spectatorsNicknames);

        break;

      case "set_ready_state":
        console.log("set ready state from %s", remoteAddress);
        //socket.write("set ready state command received");

        code = data.code;
        console.log(code);

        currentRoom = getRoomBasedOnCode(roomArray, Number(code));
        currentRoom.setPlayerReadyState(socket, null);
        socket.write("set_ready_state_received");

        break;

      case "get_ready_state":
        console.log("get ready state from  %s", remoteAddress);
        //socket.write("get ready state command received");

        code = data.code;
        console.log(code);

        currentRoom = getRoomBasedOnCode(roomArray, Number(code));
        socket.write(currentRoom.getPlayerReadyState(socket));
        break;

      case "can_game_start":
        console.log("get can_game_start state from %s", remoteAddress);
        //socket.write("get ready state command received");

        code = data.code;
        console.log(code);

        currentRoom = getRoomBasedOnCode(roomArray, Number(code));
        socket.write(currentRoom.BothPlayersAreReady());
        break;

      case "get_player_role":
        console.log("get player role from %s", remoteAddress);
        code = data.code;
        currentRoom = getRoomBasedOnCode(roomArray, Number(code));
        role = currentRoom.getPlayerRole(socket);
        console.log("role is:", role);
        socket.write(role);
        break;

      case "send_piece_position":
        console.log("send piece position from %s", remoteAddress);
        socket.write("send piece position command received");
        code = data.code;
        currentRoom = getRoomBasedOnCode(roomArray, Number(code));
        currentRoom.setLastMove(data.x, data.y);
        break;

      case "get_last_moved_piece":
        console.log("get last moved_piece from %s", remoteAddress);
        code = data.code;
        currentRoom = getRoomBasedOnCode(roomArray, Number(code));
        console.log(currentRoom.getLastMove());
        socket.write(JSON.stringify(currentRoom.getLastMove()));
        break;

      default:
        console.log("default");
    }

    // console.log("Data from %s %s", remoteAddress, d);
    // socket.write("Hello " + d);
  });

  socket.once("close", function () {
    console.log("Connection from %s closed", remoteAddress);
  });

  server.on("error", function (err) {
    console.log("Connection % error : %s", remoteAddress, err.message);
  });
});

server.listen(3000, () => {
  console.log("server listening to %j", server.address());
});
