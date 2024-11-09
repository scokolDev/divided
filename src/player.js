class Player {
    constructor(playerNumber, playerName, UserId, avatarPath) {
      this.playerNumber = playerNumber
      this.name = playerName
      this.UID = UserId
      this.avatar = avatarPath

      this.answer = undefined
      this.isSpeaking = false
    }
}

export default {Player}