class Player {
    constructor(playerNum, playerName, playerID, avatarPath) {
      this.number = playerNum
      this.name = playerName
      this.PID = playerID
      this.avatar = avatarPath

      this.answer = undefined
      this.isSpeaking = false
    }
}

export default {Player}