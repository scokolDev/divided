//-----------------------------------------------
const playerManagerElement = new playerManager()
const timerElement = new timer() 
const timeBarElement = new timeBar()
const bankElement = new bank(STARTING_BANK_AMOUNT)
const winningsTableElement = new winningsTable()
const questionElement = new QuestionDisplay()
const takeoverDisplayElement = new takeoverDisplay()



function setQuestionData(question){

    //set question display
    let qPrompt
    let qAnswers = new Map()

    switch(question.answerType){
        case "kick":
            qPrompt = KICK_ROUND_PROMPT
            playerData.forEach((player, playerNum) =>{
                qAnswers.set(playerNum.toString(), player.name)
            })

            //set timer
            timerElement.time = KICK_ROUND_LENGTH

            //set time bar
            timeBarElement.updateBar(1, bankElement.intAmount)
            break

        case "final":
            qPrompt = FINAL_ROUND_PROMPT
            qAnswers = calcFinalAnswers(bankElement.intAmount)

            //set timer
            timerElement.time = FINAL_ROUND_LENGTH

            //set time bar
            timeBarElement.updateBar(1, bankElement.intAmount)
            break
        
        default:
            qPrompt = question.prompt
            qAnswers.set('a', question.a)
            qAnswers.set('b', question.b)
            qAnswers.set('c', question.c)

            //set timer
            timerElement.time = question.time

            //set time bar
            timeBarElement.updateBar(1, question.award)
            break
    }
    console.log(qAnswers)
    questionElement.setQuestionData(qPrompt, qAnswers)

}
async function getNextQuestion(){
    let res = await fetch(BASEURL + "getNextQuestion")
    let data = await res.json()
    console.log(data)
    return data
}
function roundTakeover(ans, takeoverPlayerNum){
    numberOfTakeovers++
    takeoverDisplayElement.remainingTakeovers = TAKEOVERS_PER_GAME - numberOfTakeovers
    consensusAnswer = ans

    playerData.forEach((player, playerNum) => {
        playerManagerElement.setPlayerAnswer(playerNum, ans)
    })

    playerManagerElement.setPlayerAnswer(takeoverPlayerNum, "🙋‍♂️")
    takeoverBoardCSS()
}
//updates answers on global vars and on screen
function updateAnswersNormal(questionType){
    let answerOccurrence = new Map()
    

    playerData.forEach((player, playerNum) =>{
        console.log(player)
        let ans = getAnswer(questionType, player.answer) //getAcceptableAnswers(questionType).has(player.answer) ? player.answer : undefined
        if(ans == undefined){
            ans = getAnswer(questionType, playerManagerElement.getPlayerAnswer(playerNum)) //getAcceptableAnswers(questionType).has(playerManagerElement.getPlayerAnswer(playerNum)) ? playerManagerElement.getPlayerAnswer(playerNum) : undefined
        }
        //playerManagerElement.setPlayerAnswer(playerNum, ans)
        if(ans != undefined){
            if(ans === "takeover"){
                let takeoverAns = playerManagerElement.getPlayerAnswer(playerNum)
                if(kickedPlayer == undefined && numberOfTakeovers < TAKEOVERS_PER_GAME){
                    if(getAnswer(questionType, takeoverAns)){
                        roundTakeover(takeoverAns, playerNum)
                        return
                    }
                }else{
                    ans = takeoverAns
                }
            }
            let newAnswerAmount = (answerOccurrence.get(ans) ? answerOccurrence.get(ans) + 1 : 1)
            if(newAnswerAmount >= playerData.size){
                consensusAnswer = ans //consensus reached
            }else{
                answerOccurrence.set(ans, newAnswerAmount)
            }
            playerManagerElement.setPlayerAnswer(playerNum, ans)
            
        }
    })
}

//updates answers on global vars and on screen
function updateAnswersKick(){
    let answerOccurrence = new Map()
    
    //TODO: assign ans to previous answer in html

    playerData.forEach((player, playerNum) =>{
        
        let ans = getAnswer("kick", player.answer) //getAcceptableAnswers("kick").has(player.answer) && player.answer != playerNum.toString() ? player.answer : undefined
        if(ans == undefined){
            ans = getAnswer("kick", playerManagerElement.getPlayerAnswer(playerNum)) //getAcceptableAnswers("kick").has(playerManagerElement.getPlayerAnswer(playerNum)) ? playerManagerElement.getPlayerAnswer(playerNum) : undefined
        }
        //playerManagerElement.setPlayerAnswer(playerNum, ans)
        if(ans === "timeout"){
            ans = getAnswer("kick", playerManagerElement.getPlayerAnswer(playerNum)) //getAcceptableAnswers("kick").has(playerManagerElement.getPlayerAnswer(playerNum)) ? playerManagerElement.getPlayerAnswer(playerNum) : undefined
            if(!hasUsedTimeout.get(playerNum)){
                hasUsedTimeout.set(playerNum, true)
                timeoutQueue.push(playerNum)
            }
        }
        if(ans != undefined){
            //check for timeout
            
            let newAnswerAmount = (answerOccurrence.get(ans) ? answerOccurrence.get(ans) + 1 : 1)
            if(newAnswerAmount >= playerData.size-1){
                consensusAnswer = ans //consensus reached
            }else{
                answerOccurrence.set(ans, newAnswerAmount)
            }
            playerManagerElement.setPlayerAnswer(playerNum, ans)
            
        }
    })

}

//updates answers on global vars and on screen
function updateAnswersFinal(){
    let answerOccurrence = new Set()
    let playerAnswers = new Map()
    

    playerData.forEach((player, playerNum) =>{

        let ans =  getAnswer("final", player.answer) //getAcceptableAnswers("final").has(player.answer) ? player.answer : undefined

        if(ans != undefined){
            answerOccurrence.add(ans)
            playerAnswers.set(ans, player.name)
            if(answerOccurrence.size == playerData.size){
                finalPlayerStanding = playerAnswers //consensus reached
            }

            playerManagerElement.setPlayerAnswer(playerNum, ans)
            
        }
    })
}

function addPauseIfQueued(currentTime){
    if(timeoutQueue.length > 0 && currentTime < roundEndTime && pauseEndTime == undefined){
        playerIndex = timeoutQueue[0]
        timeoutQueue.splice(0, 1)
        
        pauseEndTime = currentTime + (LENGTH_OF_TIMEOUT * 1000)
        roundEndTime += (LENGTH_OF_TIMEOUT * 1000)

        timerElement.displayHoldAlert(playerData.get(playerIndex).name)
    }
}
function removePause(){
    pauseEndTime = undefined
    timerElement.removeHoldAlert()
}
async function kickPlayer(playerNum){
    playerManagerElement.removePlayer(playerNum)
    await deletePlayerData(playerNum)
}

function isConsensus(answerType, consensusAnswer, finalPlayerStanding){
    if(answerType != "final" && consensusAnswer != undefined){
        return true
    }else if(answerType == "final" && finalPlayerStanding != undefined){
        return true
    }
    return false
}

function updateAnswers(answerType){
    switch(answerType){
        case "final":
            updateAnswersFinal()
            break
        case "kick":
            updateAnswersKick()
            break
        default:
            updateAnswersNormal(answerType)
    }
}

function updateFinalAnswerAmounts(remainingAmount){
    questionElement.setAnswers(calcFinalAnswers(remainingAmount))
}
async function endGame(playerStandings, winnings){
    if(playerStandings == undefined){
        finalPlayerStanding = new Map()
        playerData.forEach((player, pNum)=>{
            finalPlayerStanding.set(pNum.toString(), player.name)
        })
        finalPlayerStanding.set('4', kickedPlayer.name)
    }
    await fetch(BASEURL + 'setFinalData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            standings: {
                "first": [playerStandings.get('1'), winnings * FIRST_PLACE_MODIFIER],
                "second": [playerStandings.get('2'), winnings * SECOND_PLACE_MODIFIER],
                "third": [playerStandings.get('3'), winnings * THIRD_PLACE_MODIFIER],
                "fourth": [kickedPlayer.name, 0]
            }
        })
    })

    window.location.replace(BASEURL + 'leaderBoard')
}
async function startRound(curQ){
    await clearAnswers()
    await waitForContinue()
    await fetch(BASEURL + 'setRoundActive/true')
    roundStartTime = Date.now()

    timeoutQueue = []
    let roundLength = 0
    let award = 0
    switch(curQ.answerType){
        case "final":
            roundLength = (FINAL_ROUND_LENGTH * 1000)
            award = bankElement.intAmount
            break
        case "kick":
            roundLength = (KICK_ROUND_LENGTH * 1000)
            award = bankElement.intAmount
            break
        default:
            roundLength = (parseInt(curQ.time, 10) * 1000)
            award = curQ.award
    }

    roundEndTime = roundStartTime + roundLength
    let currentTime = roundStartTime
    roundActive = true
    consensusAnswer = undefined
    percentLeft = 1
    let percentLeftBeforePause = percentLeft
    let potentialWinnings = percentLeft * parseInt(award, 10)

    //round loop
    let roundInterval = setInterval(() =>{
        if(!roundActive){return}
        currentTime = Date.now()
        
        updateAnswers(curQ.answerType)
        if(isConsensus(curQ.answerType, consensusAnswer, finalPlayerStanding)){
            endRound()
            return
        }

        addPauseIfQueued(currentTime)

        if(pauseEndTime == undefined){
            percentLeft = (roundEndTime - currentTime) / roundLength > 0 ? (roundEndTime - currentTime) / roundLength : 0
            percentLeft = percentLeft > 0 ? percentLeft : 0
            percentLeftBeforePause = percentLeft

            potentialWinnings = percentLeft * parseInt(award, 10)
            
            timerElement.time = (percentLeft * roundLength)/1000
            timeBarElement.updateBar(percentLeft, potentialWinnings)
            
            if(curQ.answerType == "final"){updateFinalAnswerAmounts(potentialWinnings)}
            if(currentTime >= roundEndTime && curQ.answerType != "kick"){
                endRound()
                wrongAnswerCSS()
                return
            }
            
        }else{
            percentLeft = (pauseEndTime - currentTime) / LENGTH_OF_TIMEOUT

            timerElement.time = (percentLeft * LENGTH_OF_TIMEOUT)/1000

            if(currentTime >= pauseEndTime){removePause()}
        }
        
        
    }, UPDATE_INTERVAL)

    const endRound = () => {
        if(pauseEndTime != undefined){
            removePause()
            timerElement.time = (percentLeftBeforePause * roundLength)/1000
        }
        roundActive = false
        clearInterval(roundInterval)
        fetch(BASEURL + 'setRoundActive/false')
        switch(curQ.answerType){
            case "kick":
                winningsTableElement.setValues(potentialWinnings)
                questionElement.revealCorrectAnswers(consensusAnswer)
                bankElement.setAmount(potentialWinnings)
                kickPlayer(parseInt(consensusAnswer))
                winningsTableElement.display = true
                break
            case "final":
                endGame(finalPlayerStanding, potentialWinnings)
                break
            default:
                winningsTableElement.setValues(bankElement.intAmount, (bankElement.intAmount+potentialWinnings), (bankElement.intAmount/2))
                winningsTableElement.display = true
        }
        
        
    }
}

function revealRoundResults(correctAnswer){

    questionElement.revealCorrectAnswers(correctAnswer)

    if(consensusAnswer == correctAnswer){
        winningsTableElement.revealResult("win")
        bankElement.setAmount(winningsTableElement.intWin)
        console.log(winningsTableElement.intWin)
        console.log(bankElement.intAmount)
        console.log(bankElement.container.innerHTML)
        correctAnswerCSS()
    }else{
        winningsTableElement.revealResult("lose")
        bankElement.setAmount(winningsTableElement.intLose)
        wrongAnswerCSS()
    }
}

async function loadQuestionOnScreen(QuestionType){
    let numOfAnswers = QuestionType == "kick" ? 4 : 3

    await waitForContinue()
    questionElement.setQuestionDisplay(true)

    let idxToLetter = new Map([[0, 'a'], [1, 'b'], [2, 'c'], [3, 'd'],])
    for(let i = 0; i <numOfAnswers; i++){
        await waitForContinue()

        questionElement.displayAnswer(idxToLetter.get(i))
    }
}
async function resetGameDisplay(){
    await waitForContinue()
    resetBoard()
}
function forceGameoverIfFinalZero(Qtype){
    if(Qtype != "final"){return}
    if(bankElement.intAmount == 0){
        
        endGame(finalPlayerStanding, 0)
    }
}
async function main(){

    let gameActive = true
    while(gameActive){
        await fetch(BASEURL + 'setRoundActive/false')

        let currentQuestion = await getNextQuestion()
        
        forceGameoverIfFinalZero(currentQuestion.answerType)

        setQuestionData(currentQuestion)

        await loadQuestionOnScreen(currentQuestion.answerType)

        await startRound(currentQuestion)

        switch(currentQuestion.answerType){
            case "final":
                gameActive = false
                break
            case "single":
            case "double":
            case "order":
                await waitForContinue()
                revealRoundResults(currentQuestion.answer)
            case "kick":
                await resetGameDisplay()
                break
        }
        // if(currentQuestion.answerType != "kick"){await waitForContinue()}
        // if(currentRoundType != "final"){
        //     if(currentQuestion.answerType != "kick"){revealRoundResults(currentQuestion.answer)}
        //     await resetGameDisplay()
        // }else{break}
    }
    
    //serialize final data to json
    //send final data and get redirected to leaderboard
}
main()

