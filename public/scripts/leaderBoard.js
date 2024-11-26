const LBWrapper = document.getElementById("winningScreen")

const LBPlayer1 = document.getElementById("LBPlayer1")
const LBPlayer1Name = document.getElementById("LBPlayer1Name")
const LBPlayer1Amount = document.getElementById("LBPlayer1Amount")

const LBPlayer2 = document.getElementById("LBPlayer2")
const LBPlayer2Name = document.getElementById("LBPlayer2Name")
const LBPlayer2Amount = document.getElementById("LBPlayer2Amount")

const LBPlayer3 = document.getElementById("LBPlayer3")
const LBPlayer3Name = document.getElementById("LBPlayer3Name")
const LBPlayer3Amount = document.getElementById("LBPlayer3Amount")

const LBPlayer4 = document.getElementById("LBPlayer4")
const LBPlayer4Name = document.getElementById("LBPlayer4Name")
const LBPlayer4Amount = document.getElementById("LBPlayer4Amount")

const LBPlayers = [LBPlayer1, LBPlayer2, LBPlayer3, LBPlayer4]
const LBNames = [LBPlayer1Name, LBPlayer2Name, LBPlayer3Name, LBPlayer4Name]
const LBAmounts = [LBPlayer1Amount, LBPlayer2Amount, LBPlayer3Amount, LBPlayer4Amount]

async function revealLeaderBoard(){
    let endAudio = await importRandSong()
    let results = await getEndData()
    //{
    //     first: ["scokol", 2006900.69],
    //     second: ["bobfilligen", 12],
    //     third: ["grungus", 0.01],
    //     fourth: ["schtinky", 0]
    // }
    let playerStandings = [
        results.first,
        results.second,
        results.third,
        results.fourth
    ]
    endAudio.play()

    for(let i = 3; i >= 0; i--){
        LBNames[i].innerHTML = playerStandings[i][0]
        LBAmounts[i].innerHTML = formatCash(playerStandings[i][1])
        let LBEmojis = LBPlayers[i].getElementsByClassName("LBemoji")
        let emojiType = playerStandings[i][1] < 0.01 ? PLACE_EMOJIS[3] : PLACE_EMOJIS[i]
        LBEmojis[0].innerHTML = emojiType
        LBEmojis[1].innerHTML = emojiType

        await waitForContinue()
        LBPlayers[i].style.animation = "revealLBPlayer 3s"
        LBPlayers[i].style.opacity = "1"
    }
}


async function importRandSong(){
    let endMusicRes = await fetch(BASEURL + "endsong")
    let endMusicFileName = await endMusicRes.json()

    let endAudio = document.createElement('audio');
    audioSource = document.createElement('source');
    audioSource.setAttribute("type", "audio/mpeg")
    audioSource.setAttribute("src", "assets/music/" + endMusicFileName)
    endAudio.append(audioSource)
    document.getElementsByTagName('body')[0].appendChild(endAudio); 
    return endAudio
}
async function getEndData(){
    const res = await fetch(BASEURL + "leaderBoardData")
    console.log(res)
    let data = await res.json()
    data = JSON.parse(data)
    return data
}



revealLeaderBoard()