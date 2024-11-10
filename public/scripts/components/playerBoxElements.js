class playerBox {
    constructor(playerIndex, playerName, playerAvatarPath){
        this.boxWrapper = document.createElement('div')
        this.boxWrapper.setAttribute('class', 'answerBox')

        this.nameTag = document.createElement('div')
        this.nameTag.setAttribute('class', 'playerName')
        this.nameTag.innerHTML = playerName
        this.boxWrapper.appendChild(this.nameTag)
        

        this.answerBox = document.createElement('div')
        this.answerBox.setAttribute('class', 'playerAnswer')
        this.boxWrapper.appendChild(this.answerBox)

       
    }

    set borderColor(color = "black"){
        let newBorderColor = "rgb(0, 0, 0)"
        switch(color){
            case "green":
                newBorderColor = "rgb(0, 255, 0)"
                break
        }

        this.boxWrapper.style.border = "10px solid " + newBorderColor
    }

    set answer(ans) {
        this.answerBox.innerHTML = ans
    }
    get answer(){
        return this.answerBox.innerHTML
    }

}

class playerManager{
    constructor(){
        this.container = document.getElementById("answerBoxWrapper")
        this.playerMap = new Map()
    }

    addPlayer(playerIndex, playerName, playerAvatarPath){
        let newPlayer = new playerBox(playerIndex, playerName, playerAvatarPath)
        this.container.appendChild(newPlayer.boxWrapper)
        this.playerMap.set(playerIndex, newPlayer)
        adjustTextToFillCon(newPlayer.nameTag, 40, false)
    }
    getPlayerAnswer(playerIndex){
        return this.playerMap.get(playerIndex).innerHTML
    }
    setPlayerAnswer(playerIndex, answer){
        console.log(playerIndex)
        this.playerMap.get(playerIndex).answer = answer
    }
    removePlayer(playerIndex){
        //TODO: add removal of player
    }

    getPlayerBox(playerIndex){
        return this.playerMap.get(playerIndex)
    }
    setAnswer(playerIndex, answer){
        this.playerMap.get(playerIndex).answer = answer
    }

    getAnswer(playerIndex){
        return this.playerMap.get(playerIndex).answer
    }
}


// //////////
// let testPManager = new playerManager()
// testPManager.addPlayer(1, "jacob")
// testPManager.setAnswer(1, "hi")