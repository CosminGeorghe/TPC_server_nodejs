class Room {
    constructor(playersList, code, lastMove) {
      this.playersList = playersList;
      this.code = code;
      this.lastMove = lastMove;
    }
  
    addPlayer(player) {
      this.playersList.push(player);
    }
  
    getPlayer(socket) {
      for (let i = 0; i < this.playersList.length; i++)
        if (this.playersList[i].socket == socket) return this.playersList[i];
    }
  
    setPlayerAsPlayer(socket) {
      //set player as player and see if it is the first player that join, so it moves first
      let playerIndex;
      let isFirstPlayer = true;
      for (let i = 0; i < this.playersList.length; i++) {
        if (this.playersList[i].socket == socket) {
          playerIndex = i;
          this.playersList[i].isSpectator = false;
        } else if (this.playersList[i].isSpectator == false) {
          //is not first player
          isFirstPlayer = false;
        }
      }
      //if it's first player make him move first
      if (isFirstPlayer) this.playersList[playerIndex].isMovingFirst = true;
      else this.playersList[playerIndex].isMovingFirst = false;
    }
  
    //check if it's the first player that joined the room
  
    setPlayerAsSpectator(socket) {
      let currentPlayer = this.getPlayer(socket);
  
      currentPlayer.isSpectator = true;
      currentPlayer.isMovingFirst = false;
    }
  
    getPlayersNicknames() {
      let nicknamesList = [];
      for (let i = 0; i < this.playersList.length; i++) {
        if (this.playersList[i].isSpectator == false)
          nicknamesList.push(this.playersList[i].nickname);
      }
      return nicknamesList;
    }
  
    getSpectatorsNicknames() {
      let nicknamesList = [];
      for (let i = 0; i < this.playersList.length; i++) {
        if (this.playersList[i].isSpectator == true)
          nicknamesList.push(this.playersList[i].nickname);
      }
      return nicknamesList;
    }
  
    setPlayerReadyState(socket, state) {
      //set current player state to ready
      let currentPlayer = this.getPlayer(socket);
      if (state != null) {
        currentPlayer.isReady = state;
        console.log("if");
      } else {
        currentPlayer.isReady = !currentPlayer.isReady;
        console.log("else if");
      }
    }
  
    getPlayerReadyState(socket) {
      let currentPlayer = this.getPlayer(socket);
      return currentPlayer.isReady.toString();
    }
  
    BothPlayersAreReady() {
      let numberOfPlayersReady = 0;
      for (let i = 0; i < this.playersList.length; i++) {
        if (this.playersList[i].isReady == true) numberOfPlayersReady++;
      }
      if (numberOfPlayersReady >= 2) return true.toString();
      else return false.toString();
    }
  
    StartGame() {
      for (let i = 0; i < this.playersList.length; i++) {
        this.playersList[i].isReady = false;
      }
    }
  
    getPlayerRole(socket) {
      let currentPlayer = this.getPlayer(socket);
      if (currentPlayer.isSpectator) return "spectator";
      else if (currentPlayer.isMovingFirst) return "first_player";
      else return "second_player";
    }

    setLastMove(x, y) {
      this.lastMove = [x, y];
    }

    getLastMove(){
      return this.lastMove;
    }
  }

  module.exports = Room;