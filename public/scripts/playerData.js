var numOfPlayers = 0
var kickedPlayer = undefined
var playerData = new Map()
var hasUsedTimeout = new Map()

async function clearAnswers(){
    await fetch(BASEURL + "clearAnswers")
    playerData.forEach((player) => {
        player.answer = undefined
    })
}

function updateSpeaking(playerNumber){
    if(playerData.get(playerNumber).isSpeaking == true){
        playerManagerElement.getPlayerBox(playerNumber).borderColor = "green"
    }else{
        playerManagerElement.getPlayerBox(playerNumber).borderColor = "black"
    }
}

async function deletePlayerData(playerNum){
    kickedPlayer = playerData.get(playerNum)
    playerData.delete(playerNum)
    await fetch(BASEURL + "kickPlayer/" + playerNum)
}

async function updatePlayerData(){
    const res = await fetch(BASEURL + "playerData")
    let data = await res.json()
    data = new Map(JSON.parse(data))

    data.forEach((player, playerNum) => {
        if(!playerData.has(playerNum) && (kickedPlayer == undefined || playerNum != kickedPlayer.playerNum)){
                playerManagerElement.addPlayer(player.playerNumber, player.name, player.avatar)
                hasUsedTimeout.set(playerNum, false)
                playerData.set(player.playerNumber, player)
        }else if(playerData.has(playerNum)){
            playerData.set(player.playerNumber, player)
            updateSpeaking(player.playerNumber)
        }
    })
    
}
setInterval(updatePlayerData, 50)