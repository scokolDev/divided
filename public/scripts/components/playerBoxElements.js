class playerBox {
    constructor(playerIndex, playerName, playerAvatarPath){
        this.boxWrapper = document.createElement('div')
        this.boxWrapper.setAttribute('class', 'answerBox')
        this.boxWrapper.style.backgroundImage = "url(" + playerAvatarPath + ")"

        this.film = document.createElement('div')
        this.boxWrapper.appendChild(this.film)

        this.nameTag = document.createElement('div')
        this.nameTag.setAttribute('class', 'playerName')
        this.nameTag.innerHTML = playerName
        this.film.appendChild(this.nameTag)
        

        this.answerBox = document.createElement('div')
        this.answerBox.setAttribute('class', 'playerAnswer')
        this.film.appendChild(this.answerBox)

       
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

    set filmColor(color){
        this.film.style.backgroundColor = color
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
        return this.playerMap.get(playerIndex).answer
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

    clearPlayerAnswers(){
        this.playerMap.forEach((playerBox) =>{
            playerBox.answer = ""
        })
    }
    
    setPlayerColor(color){
        this.playerMap.forEach((playerBox) =>{
            playerBox.filmColor = color
        })
    }
}


// //////////
// let testPManager = new playerManager()
// testPManager.addPlayer(1, "jacob")
// testPManager.setAnswer(1, "hi")