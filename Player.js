class Player {
  constructor(socket, nickname, isMovingFirst, isSpectator, isReady) {
    this.socket = socket;
    this.nickname = nickname;
    this.isMovingFirst = isMovingFirst;
    this.isSpectator = isSpectator;
    this.isReady = isReady;
  }
}

module.exports = Player;
