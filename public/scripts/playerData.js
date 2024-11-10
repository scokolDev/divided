var numOfPlayers = 0
var playerData = new Map()
var hasUsedTimeout = new Map()

async function clearAnswers(){
    const res = await fetch(BASEURL + "clearAnswers")
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
    //console.log(res)
    let data = await res.json()
    data = new Map(JSON.parse(data))
    //console.log(data.get(1).name)

    data.forEach((value, key) => {
        //console.log(key + " === " + value)
        if(!playerData.has(key)){
            playerManagerElement.addPlayer(value.playerNumber, value.name)
            hasUsedTimeout.set(key, false)
        }
        playerData.set(value.playerNumber, value)
        updateSpeaking(value.playerNumber)
    })
}
//updatePlayerData()
//console.log(playerData)
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