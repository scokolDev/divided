var numOfPlayers = 0
var playerData = new Map()
var hasUsedTimeout = new Map()

async function clearAnswers(){
    await fetch(BASEURL + "clearAnswers")
}

function updateSpeaking(playerNumber){
    if(playerData.get(playerNumber).isSpeaking == true){
        playerManagerElement.getPlayerBox(playerNumber).borderColor = "green"
    }else{
        playerManagerElement.getPlayerBox(playerNumber).borderColor = "black"
    }
}

async function updatePlayerData(){
    const res = await fetch(BASEURL + "playerData")
    let data = await res.json()
    data = new Map(JSON.parse(data))

    data.forEach((player, playerNum) => {
        //console.log(key + " === " + value)
        if(!playerData.has(playerNum)){
            playerManagerElement.addPlayer(player.playerNumber, player.name, player.avatar)
            hasUsedTimeout.set(playerNum, false)
        }
        playerData.set(player.playerNumber, player)
        //console.log(player.name + " " + player.answer)
        updateSpeaking(player.playerNumber)
    })
    
}
setInterval(updatePlayerData, 50)













// async function pollForNames(){
//     console.log("playerInterval set:" + !playerInterval)
//     activePlayers = []
//     const res = await fetch(baseURL + "displaynames")
//     const data = await res.json()

//     const names = [data.player1, data.player2, data.player3, data.player4]

//     const imgRes = await fetch(baseURL + "avatars")
//     const imgData = await imgRes.json()

//     const avatars = [imgData.player1, imgData.player2, imgData.player3, imgData.player4]

//     for(i=0; i<4; i++){
//         if(names[i] != undefined){
//             playerNameElements[i].innerHTML = names[i]
//             let bgImageStr = "url(" + avatars[i] +")"
//             playerBoxElements[i].style.backgroundImage = bgImageStr
//             adjustTextToFillCon(playerNameElements[i], 55, false)
//             console.log(i + ":  " + playerNameElements[i].style.fontSize)
//             activePlayers.push(names[i])
//         }
//     }
//     if(activePlayers.length == _MAX_PLAYERS){//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////start looking for question when n people join the game 
//         clearInterval(playerInterval)
//         console.log("playerInterval cleared:" + !playerInterval)
//         listenForQuestion()
//     }
//     console.log("-=---------" + activePlayers)
    
// };