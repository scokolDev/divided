const baseURL = 'http://localhost:3000/'

var dynamicStyle = document.createElement('style');
document.getElementsByTagName('head')[0].appendChild(dynamicStyle);



// let Feddy = document.getElementById("trapQueen")
// let Fard = document.getElementById("Fard")
let endAudio = undefined

let kickedPlayer = undefined
let _MAX_PLAYERS = 4
let consensusAnswer = undefined
let takeoverCounter = 2 //number of takeovers per game
const initHoldTime = 10 //length of a timeout during kick round
let bankAmt = 0; //starting bank amount
// let numOfPlayers = 4

let cashAmt = 0;  //starting cashAmt on sand clock bar when page first loads
let time = 100; //starting timer amount when page first loads


let isCurrentlyPolling = false;
let potentialWin = 0
let potentialLose = 0
let cashStartTime;

let currentHoldTime = 0
let isruinning = false;
let isflashing = false;
let isFail = false
let isKickRound = false
let isFinalRound = false
let isHoldActive = false

let playerInterval
let lastTickTime = undefined
let pausedTime = 0
let isQuestionSelected = false
let lastSecondDisplayed

let startInt
let QuestionInt
let revealInt
let loadInt = undefined

let activePlayers = []
let playerTimeouts = [false, false, false, false]
let finalPlayerStanding = []
let finalPlayerAmounts = []

gameWrapper = document.getElementById("wrapper")
LBWrapper = document.getElementById("winningScreen")

LBPlayer1 = document.getElementById("LBPlayer1")
LBPlayer1Name = document.getElementById("LBPlayer1Name")
LBPlayer1Amount = document.getElementById("LBPlayer1Amount")

LBPlayer2 = document.getElementById("LBPlayer2")
LBPlayer2Name = document.getElementById("LBPlayer2Name")
LBPlayer2Amount = document.getElementById("LBPlayer2Amount")

LBPlayer3 = document.getElementById("LBPlayer3")
LBPlayer3Name = document.getElementById("LBPlayer3Name")
LBPlayer3Amount = document.getElementById("LBPlayer3Amount")

LBPlayer4 = document.getElementById("LBPlayer4")
LBPlayer4Name = document.getElementById("LBPlayer4Name")
LBPlayer4Amount = document.getElementById("LBPlayer4Amount")

winningImg1 = document.getElementById("winningImg1")
winningImg2 = document.getElementById("winningImg2")

const quesionBox = document.getElementById("quesionBox");
const prompt = document.getElementById("prompt");
const aAnswer = document.getElementById("aAnswer");
const bAnswer = document.getElementById("bAnswer");
const cAnswer = document.getElementById("cAnswer");
const dAnswer = document.getElementById("dAnswer");

const aletterContainer = document.getElementById("aletterContainer");
const bletterContainer = document.getElementById("bletterContainer");
const cletterContainer = document.getElementById("cletterContainer");

const ALetter = document.getElementById("A");
const BLetter = document.getElementById("B");
const CLetter = document.getElementById("C");
const DLetter = document.getElementById("D");

let currentQuestion = undefined
let isQuestionLoaded = false
let initialAmt = cashAmt
let initialTime = time

const QuestionConText = document.getElementById("QuestionConText");
const timer = document.getElementById("timer");
const holdAlert = document.getElementById("holdAlert")
const bank = document.getElementById("bank");

//sand clock
const bar = document.getElementById("bar");
let initHeight = bar.offsetHeight;
const handle = document.getElementById("handle");
const cashBox = document.getElementById("num-box");


//table elements
const win = document.getElementById("win");
const total = document.getElementById("total");
const lose = document.getElementById("lose");
let isTableDisplayed = false

//question answers
const aBox = document.getElementById("aBox");
const bBox = document.getElementById("bBox");
const cBox = document.getElementById("cBox");
const dBox = document.getElementById("dBox");

//answer box elements
const player1Box = document.getElementById("player1Box");
const player2Box = document.getElementById("player2Box");
const player3Box = document.getElementById("player3Box");
const player4Box = document.getElementById("player4Box");
const playerBoxElements = [player1Box, player2Box, player3Box, player4Box]

const player1Film = document.getElementById("player1Film");
const player2Film = document.getElementById("player2Film");
const player3Film = document.getElementById("player3Film");
const player4Film = document.getElementById("player4Film");
const playerFilmElements = [player1Film, player2Film, player3Film, player4Film]

const player1Name = document.getElementById("player1Name");
const player2Name = document.getElementById("player2Name");
const player3Name = document.getElementById("player3Name");
const player4Name = document.getElementById("player4Name");
const playerNameElements = [player1Name, player2Name, player3Name, player4Name]



const player1Answer = document.getElementById("player1Answer");
const player2Answer = document.getElementById("player2Answer");
const player3Answer = document.getElementById("player3Answer");
const player4Answer = document.getElementById("player4Answer");
const playerAnswerElements = [player1Answer, player2Answer, player3Answer, player4Answer]

function revealLeaderBoard(){
    endAudio.play()

    // setTimeout(function(){
    //     Fard.play()
    // }, Math.floor(Math.random() * 240000))

    LBPlayer4Name.innerHTML = activePlayers[kickedPlayer-1]
    LBPlayer4Amount.innerHTML = "$0.00"

    LBPlayer3Name.innerHTML = finalPlayerStanding[2]
    LBPlayer3Amount.innerHTML = finalPlayerAmounts[2]
    if(finalPlayerAmounts[2] == "$0.00"){
        let LB3Emojis = LBPlayer3.getElementsByClassName("LBemoji")
        LB3Emojis[0].innerHTML = "😭"
        LB3Emojis[1].innerHTML = "😭"
    }

    LBPlayer2Name.innerHTML = finalPlayerStanding[1]
    LBPlayer2Amount.innerHTML = finalPlayerAmounts[1]
    if(finalPlayerAmounts[1] == "$0.00"){
        let LB2Emojis = LBPlayer2.getElementsByClassName("LBemoji")
        LB2Emojis[0].innerHTML = "😭"
        LB2Emojis[1].innerHTML = "😭"
    }

    LBPlayer1Name.innerHTML = finalPlayerStanding[0]
    LBPlayer1Amount.innerHTML = finalPlayerAmounts[0]
    if(finalPlayerAmounts[0] == "$0.00"){
        let LB1Emojis = LBPlayer1.getElementsByClassName("LBemoji")
        LB1Emojis[0].innerHTML = "😭"
        LB1Emojis[1].innerHTML = "😭"
    }

    winningImg1.style.visibility = "visible"
    winningImg2.style.visibility = "visible"

    LBPlayer4.style.animation = "revealLBPlayer 3s"
    LBPlayer4.style.opacity = "1"

    setTimeout(function(){
        LBPlayer3.style.animation = "revealLBPlayer 3s"
        LBPlayer3.style.opacity = "1"
    }, 1500)
    

    setTimeout(function(){
        LBPlayer2.style.animation = "revealLBPlayer 3s"
        LBPlayer2.style.opacity = "1"
    }, 3000)
    

    setTimeout(function(){
        LBPlayer1.style.animation = "revealLBPlayer 3s"
        LBPlayer1.style.opacity = "1"
    }, 4500)
    
}


async function importRandSong(){
    let endMusicRes = await fetch(baseURL + "endsong")
    let endMusicFileName = await endMusicRes.json()

    endAudio = document.createElement('audio');
    audioSource = document.createElement('source');
    audioSource.setAttribute("type", "audio/mpeg")
    audioSource.setAttribute("src", "/music/" + endMusicFileName)
    endAudio.append(audioSource)
    document.getElementsByTagName('body')[0].appendChild(endAudio); 
}
importRandSong()

const speakingInt = setInterval(async function(){
    const res = await fetch(baseURL + "speaking")
    const data = await res.json()

    if(data.player1 == true){
        player1Box.style.border = "10px solid rgb(0, 255, 0)"
    }else{
        player1Box.style.border = "10px solid rgb(0, 0, 0)"
    }

    if(data.player2 == true){
        player2Box.style.border = "10px solid rgb(0, 255, 0)"
    }else{
        player2Box.style.border = "10px solid rgb(0, 0, 0)"
    }

    if(data.player3 == true){
        player3Box.style.border = "10px solid rgb(0, 255, 0)"
    }else{
        player3Box.style.border = "10px solid rgb(0, 0, 0)"
    }

    if(data.player4 == true){
        player4Box.style.border = "10px solid rgb(0, 255, 0)"
    }else{
        player4Box.style.border = "10px solid rgb(0, 0, 0)"
    }
}, 100)

//check if start command has been sent to the server
async function checkIfStarted(){
    const res = await fetch(baseURL + "isStart")
    
    const data = await res.json()
    console.log(data)
    if(data == true){
        clearInterval(startInt)
        start()
    }
}
async function listenForStart(){
    await fetch(baseURL + "clearAllSelections")
    startInt = setInterval(checkIfStarted, 50)
}

//check if question select command has been sent to the server
async function checkIfQuestionSelected(){
    const res = await fetch(baseURL + "getQuestionSelection")
    if(res.status != 201){
        const data = await res.json()
        console.log(data)
        qObj = JSON.parse(data)
        selectQuestion(qObj)
        console.log(loadInt)
        if(loadInt == undefined){
            listenForLoad()
        }
    }
}
async function listenForQuestion(){
    await fetch(baseURL + "clearAllSelections")
    QuestionInt = setInterval(checkIfQuestionSelected, 50)
}

//check if answer reveal command has been sent to the server
async function checkIfReveal(){
    const res = await fetch(baseURL + "isReveal")
    const data = await res.json()
    console.log(data)
    if(data == true){
        if(isFinalRound){
            revealLeaderBoard()
            clearInterval(revealInt)
        }else{
            revealCorrectAnswers()
            clearInterval(revealInt)
            listenForQuestion()
        }
        
    }
}
async function listenForReveal(){
    await fetch(baseURL + "clearAllSelections")
    if(!isKickRound){
        revealInt = setInterval(checkIfReveal, 50)
    }
}

//check if question load command has been sent to the server
async function checkIfLoaded(){
    const res = await fetch(baseURL + "isLoadQuestion")
    const data = await res.json()
    console.log(data)
    if(data == true){
        loadSelectedQuestion()
        clearInterval(loadInt)
        loadInt = undefined
        clearInterval(QuestionInt)
        listenForStart()
    }
}
async function listenForLoad(){
    await fetch(baseURL + "clearAllSelections")
    loadInt = setInterval(checkIfLoaded, 50)
}


let currentQAnswerType
async function selectQuestion(QuestionObj){
    if(QuestionObj.question == "kick"){
        if(kickedPlayer == undefined){
            updateStartAmts(bankAmt, 60)
            fullBoardReset()
        
            const res = await fetch(baseURL + "displaynames")
            const data = await res.json()
        
            currentQuestion = "vote to kick a player"
            QuestionConText.innerHTML = "vote to kick a player";
            ALetter.innerHTML = "1"
            BLetter.innerHTML = "2"
            CLetter.innerHTML = "3"
            DLetter.innerHTML = "4"
            aAnswer.innerHTML = data.player1;
            adjustTextToFillCon(aAnswer, 40, false)

            bAnswer.innerHTML = data.player2;
            adjustTextToFillCon(bAnswer, 40, false)

            cAnswer.innerHTML = data.player3;
            adjustTextToFillCon(cAnswer, 40, false)

            dAnswer.innerHTML = data.player4;
            adjustTextToFillCon(dAnswer, 40, false)

            dBox.style.visibility = "visible"
            isQuestionSelected = true
            isQuestionLoaded = false
            isKickRound = true
            isFinalRound = false
            isFail = false
            pausedTime = 0
        }else{
            alert("erm...player has already been kicked WOMP WOMP")
            await fetch(baseURL + "clearQSelection")
            return
        }
    }else if(QuestionObj.question == "final"){
        if(kickedPlayer != undefined){
            updateStartAmts(bankAmt, 100)
            fullBoardReset()
        
            currentQuestion = "choose which value you deserve!"
            QuestionConText.innerHTML = "choose which value you deserve!";
            ALetter.innerHTML = "1"
            BLetter.innerHTML = "2"
            CLetter.innerHTML = "3"
            aAnswer.innerHTML = formatCash(bankAmt*.6);
            bAnswer.innerHTML = formatCash(bankAmt*.3);
            cAnswer.innerHTML = formatCash(bankAmt*.1);
            

            aAnswer.innerHTML = formatCash(bankAmt*.6);
            adjustTextToFillCon(aAnswer, 40, false)


            bAnswer.innerHTML = formatCash(bankAmt*.3);
            adjustTextToFillCon(bAnswer, 40, false)


            cAnswer.innerHTML = formatCash(bankAmt*.1);
            adjustTextToFillCon(cAnswer, 40, false)

            aAnswer.style.fontFamily = "FixedBold";
            bAnswer.style.fontFamily = "FixedBold";
            cAnswer.style.fontFamily = "FixedBold";
            isQuestionSelected = true
            isQuestionLoaded = false
            isKickRound = false
            isFinalRound = true
            isFail = false
            pausedTime = 0
        }else{
            alert("erm...it is not time brotha")
            await fetch(baseURL + "clearQSelection")
            return
        }
    }else{
        updateStartAmts(QuestionObj.value, QuestionObj.newTime)

        fullBoardReset()
        currentQAnswerType = QuestionObj.answerType
        currentQuestion = QuestionObj
        isQuestionSelected = true


        QuestionConText.innerHTML = QuestionObj.question;
        adjustTextToFillCon(QuestionConText, 40, true)


        aAnswer.innerHTML = QuestionObj.a;
        adjustTextToFillCon(aAnswer, 40, false)


        bAnswer.innerHTML = QuestionObj.b;
        adjustTextToFillCon(bAnswer, 40, false)


        cAnswer.innerHTML = QuestionObj.c;
        adjustTextToFillCon(cAnswer, 40, false)



        isQuestionLoaded = false
        isKickRound = false
        isFinalRound = false
        isFail = false
        pausedTime = 0
    }
}





function adjustTextToFillCon(container, initialFontSize, isVertical){
    let basefontsize = initialFontSize
    container.style.fontSize = basefontsize + "px"
    console.log(container.getAttribute("id") + "t size readjust:" + container.scrollWidth + " " + 
    container.clientWidth + " " + 
        container.style.fontSize)
    while ((!isVertical && container.scrollWidth > container.clientWidth) || (isVertical && container.scrollHeight > container.clientHeight)) {
        // if(basefontsize == 20){return}/////////////////////
        console.log(container.getAttribute("id") + "t size readjust:" + container.scrollWidth + " " + 
        container.clientWidth + " " + 
        container.style.fontSize)
        container.style.fontSize = (basefontsize--) + "px";
    }
    console.log(container.getAttribute("id") + "t size readjust:" + container.scrollWidth + " " + 
        container.clientWidth + " " + 
        container.style.fontSize)
    return basefontsize
}


//converts float to string money value with $ and commas. rounds to 2 places
//
//money: float dollar value
//output: formatted money string
const formatCash = (money) =>{
    let buffer = "";
    let decimal = "." + parseInt((money*10)%10) + parseInt((money*100)%10);
    let places = money != 0 ? Math.floor(Math.log10(money)): 0;
    for (let i = 0; i < places; i++) {
        buffer = parseInt((money/Math.pow(10, i))) % 10 + buffer;
        if((i+1) % 3 == 0 && i != 0){
            buffer = "," + buffer;
        }
    } 
    if(places < 0){
        buffer = "$0" + decimal;
    }else{
        buffer = "$" + parseInt((money/Math.pow(10, places))) % 10 + buffer + decimal;
    }
    
    return buffer;
}
// cashBox.innerHTML = formatCash(cashAmt);
bank.innerHTML = formatCash(bankAmt);
// adjustTextToFillCon(bank, 70, false)
// timer.innerHTML = time;

const drainBar = (modifier) =>{
    let space = parseInt((initHeight)*(1-modifier));
    bar.style.height = space + "px";
    bar.style.top = initHeight-space + "px";
    handle.style.top = (initHeight-space)-10 + "px";
    cashBox.style.top = initHeight-space + "px";
}
const updateCash = (modifier) =>{
    //console.log(1-modifier)
    cashAmt = (initialAmt)*(1-modifier);
    // console.log("rahhh" + cashAmt)
    if(cashAmt < 0){cashAmt = 0;}
    // console.log(formatCash(cashAmt))
    cashBox.innerHTML = formatCash(cashAmt);
    if(isFinalRound){
        aAnswer.innerHTML = formatCash(cashAmt*.6);
        bAnswer.innerHTML = formatCash(cashAmt*.3);
        cAnswer.innerHTML = formatCash(cashAmt*.1);
    }
}
const Startflash = (element, delay1, color1, color2) => {
    let counter = 0;
    return setInterval(function timerColor () {
        element.style.color = counter % 2 == 0 ? color1 : color2;
        counter++;
    }, delay1);
}
const updateTimer = (newTime) =>{
    if(newTime < 4 && !isflashing){
        //timer.style.fontFamily = "bumber";
        flashInterval = Startflash(timer, 200, "red", "orange");
        isflashing=true;
    }
    timer.innerHTML = newTime;
    lastSecondDisplayed = newTime
    if(newTime < 1){
                let LastHeight = bar.offsetHeight;
                cashAmt = 0;
        updateCash(1);
        drainBar(1);
                bar.style.height = "0px";
                bar.style.top = bar.offsetTop+LastHeight + "px";
                handle.style.top = handle.offsetTop+LastHeight + "px";
                cashBox.style.top = cashBox.offsetTop+LastHeight + "px";
                console.log("timer stopped sand clock"); 
        isFail = true
        if(!isKickRound){
            pause();
        }
        if(isFinalRound){
            finalPlayerAmounts = ["$0.00", "$0.00", "$0.00"]
            for(i = 0; i < activePlayers.length; i++){
                if(i != kickedPlayer-1){
                    finalPlayerStanding.push(activePlayers[i])
                }
            }
            setUpLeaderBoard()
        }
        clearInterval(flashInterval);
        timer.style.color = "aqua"
    }
    //console.log(newTime)
}
const MainClock = () =>{
    if(!isFail && !isHoldActive){
        console.log("cashStartTime: ---------- "  + cashStartTime)
        let cur = Date.now();
        let elapsedTime = cur - cashStartTime
        let timeLeft = time - parseInt(elapsedTime/1000)
        let mod = elapsedTime/((initialTime)*1000)
        
        if(mod <= 1){
            updateCash(mod);
            drainBar(mod);
        }else{
            updateCash(1);
            drainBar(1);
        }

        updateTimer(timeLeft);
        lastTickTime = cur
    }
    

    if(isKickRound){
        updateKickAnswers()
    }else if(isFinalRound){
        updateFinalAnswers()
    }else{
        updateAnswers()
    }
}

function takeover(player){
    console.log("?????????????????" + playerAnswerElements[player-1].innerHTML + "?????????????????")
    if(playerAnswerElements[player-1].innerHTML.trim() != ""){
        pause()
        takeoverCounter--
        
        let takeoverAnswer = playerAnswerElements[player-1].innerHTML
        console.log("takeoverAnswer:============" + takeoverAnswer)
        consensusAnswer = takeoverAnswer

        for(let j = 0; j < 4; j++){
            playerAnswerElements[j].innerHTML = takeoverAnswer.toUpperCase()
            playerFilmElements[j].style.backgroundColor = "orange"
            // playerNameElements[j].style.backgroundColor = "orange"
        }
        //playerBoxElements[player-1].style.border = "10px solid rgb(255, 0, 0)"
        playerAnswerElements[player-1].innerHTML = "🙋‍♂️"
        //playerAnswerElements[player-1].style.backgroundImage = "url(/public/img/zog.png)"
        makeQuestionOrange()
        return true
    }
    return false
}

function verifyAnswer(answer){
    let maxLength
    switch(currentQAnswerType){
        case("single"):
        maxLength = 1
        break
        case("double"):
        maxLength = 2
        break
        case("order"):
        maxLength = 3
        break
    }
    if(answer == undefined){return false}
    if(answer.length != maxLength){
        if(answer == "TAKEOVER"){
            return true
        }
        return false
    }else{
        answerLetters = answer.split("")
        for(j = 0; j < answerLetters.length; j++){
            if(answerLetters[j] != 'A' && answerLetters[j] != 'B' && answerLetters[j] != 'C'){
                return false
            }
        }
        return true
    }
}

function sortStr(str){
    if(str.length == 2){
        sorted = []
        for(j = 0; j < str.length; j++){
            switch(str[j]){
                case("A"):
                sorted[0] = str[j]
                break
                case("B"):
                sorted[1] = str[j]
                break
                case("C"):
                sorted[2] = str[j]
                break
            }
        }
        return sorted.join("")
    }
    return str
}



function setUpLeaderBoard(){
    gameWrapper.style.display = "none"
    LBWrapper.style.display = "flex"
}

function formatAndVerify(str){
    let maxLength
    let buffer = ""
    
    switch(currentQAnswerType){
        case("single"):
        maxLength = 1
        break
        case("double"):
        maxLength = 2
        break
        case("order"):
        maxLength = 3
        break
    }

    if(str == undefined){return undefined}
    let answer = str.toUpperCase()
    if(answer.length != maxLength){
        if(answer == "TAKEOVER"){
            return "TAKEOVER"
        }
        return undefined
    }else{
        answerLetters = answer.split("")
        for(j = 0; j < answerLetters.length; j++){
            if(answerLetters[j] != 'A' && answerLetters[j] != 'B' && answerLetters[j] != 'C'){
                return undefined
            }else{
                buffer += answerLetters[j]
                console.log("letter:" + answerLetters[j] + "buffer:" + buffer)
            }
        }
        return buffer
    }
}
function formatAndVerifyKick(str, playerIndex){
    let maxLength = 1
    let availableAnswers = ["1", "2", "3", "4"]
    availableAnswers.splice(playerIndex, 1) 

    if(str == undefined){return undefined}
    let answer = str.toUpperCase()
    if(answer.length != maxLength){
        if(answer == "TIMEOUT"){
            return "TIMEOUT"
        }
        return undefined
    }else{
        answerChar = answer.substring(0, 1)
        switch(answerChar){
            case(availableAnswers[0]):
                return availableAnswers[0]
            case(availableAnswers[1]):
                return availableAnswers[1]
            case(availableAnswers[2]):
                return availableAnswers[2]
        }
    }
    return undefined
}
function formatAndVerifyFinal(str){
    let maxLength = 1
    
    if(str == undefined){return undefined}
    let answer = str.toUpperCase()
    if(answer.length != maxLength){
        return undefined
    }else{

        answerChar = answer.substring(0, 1)

        switch(answerChar){
            case("1"):
                return '1'
            case("2"):
                return '2'
            case("3"):
                return '3'
        }
    }
    return undefined
}

function kickPlayer(playerIndex){
    playerBoxElements[playerIndex-1].style.visibility = "hidden"
    kickedPlayer = playerIndex
    
    let answerBox
    switch(playerIndex){
        case("1"):
            answerBox = "a"
            break
        case("2"):
            answerBox = "b"
            break
        case("3"):
            answerBox = "c"
            break
        case("4"):
            answerBox = "d"
            break
    }
    revealSingleAnswers(answerBox)

    
    
    listenForQuestion()
}

async function updateAnswers() {
    if(isCurrentlyPolling){
        return
    }
    isCurrentlyPolling = true
    const res = await fetch(baseURL + "answers")
    const data = await res.json()

    let contestantAnswers = [data.player1, data.player2, data.player3, data.player4]

    let isAllAnswered = true
    for(i = 0; i < contestantAnswers.length; i++){

        if(kickedPlayer == undefined || (kickedPlayer != undefined && i+1 != kickedPlayer)){

            if(playerAnswerElements[i].innerHTML != contestantAnswers[i]){
                contestantAnswers[i] = formatAndVerify(contestantAnswers[i])

                console.log("formatted:" + contestantAnswers[i])

                if(contestantAnswers[i] != undefined){
                    if(currentQAnswerType == "double"){contestantAnswers[i] = sortStr(contestantAnswers[i])}
                    if(contestantAnswers[i].length > 3 && kickedPlayer == undefined){
                        if(takeoverCounter > 0){
                            if(takeover(i+1)){
                                return
                            }
                        }else{
                            if(playerAnswerElements[i].innerHTML != ""){
                                contestantAnswers[i] = playerAnswerElements[i].innerHTML
                            }else{
                                isAllAnswered = false
                            }
                        }
                    }else{
                        playerAnswerElements[i].innerHTML = contestantAnswers[i]
                    }
                }else{
                    
                    if(playerAnswerElements[i].innerHTML != ""){
                        contestantAnswers[i] = playerAnswerElements[i].innerHTML
                    }else{
                        isAllAnswered = false
                    }
                }
            }
        }
    }

    if(kickedPlayer != undefined){
        contestantAnswers.splice(kickedPlayer-1, 1) 
    }

    if(isAllAnswered){
        let setAnswers = new Set(contestantAnswers)
        console.log("setAnswers:" + setAnswers)
        if(setAnswers.size == 1){
            consensusAnswer = contestantAnswers[0]
            pause()
            return
        }
    }
    
    console.log(contestantAnswers)
    isCurrentlyPolling = false
}
async function updateKickAnswers() {
    if(isCurrentlyPolling){
        return
    }
    isCurrentlyPolling = true
    const res = await fetch(baseURL + "answers")
    const data = await res.json()

    const contestantAnswers = [data.player1, data.player2, data.player3, data.player4]

    let answeredUsers = [false, false, false, false]
    for(i = 0; i < contestantAnswers.length; i++){

        if(playerAnswerElements[i].innerHTML != contestantAnswers[i]){
            contestantAnswers[i] = formatAndVerifyKick(contestantAnswers[i], i)
            
            if(contestantAnswers[i] != undefined){
                if(contestantAnswers[i].length > 1){
                    if(playerAnswerElements[i].innerHTML.trim != ""){ 
                        contestantAnswers[i] = playerAnswerElements[i].innerHTML
                    }else{contestantAnswers[i] = undefined}
                    if(!playerTimeouts[i] && !isHoldActive){
                        playerTimeouts[i] = true
                        hold(i)
                    }
                }else{
                    playerAnswerElements[i].innerHTML = contestantAnswers[i]
                    answeredUsers[i] = true
                }
            }else {
                if(playerAnswerElements[i].innerHTML != ""){
                    contestantAnswers[i] = playerAnswerElements[i].innerHTML
                    answeredUsers[i] = true
                }
            }
        }else{answeredUsers[i] = true}
    }
    
    if(answeredUsers[0] && answeredUsers[1] && answeredUsers[2]){
        if(contestantAnswers[0] == contestantAnswers[1] && contestantAnswers[1] == contestantAnswers[2]){
            kickPlayer(contestantAnswers[0])
            pause()
            return
        }
    } 
    if(answeredUsers[0] && answeredUsers[1] && answeredUsers[3]){
        if(contestantAnswers[0] == contestantAnswers[1] && contestantAnswers[1] == contestantAnswers[3]){
            kickPlayer(contestantAnswers[0])
            pause()
            return
        }
    }
    if(answeredUsers[1] && answeredUsers[2] && answeredUsers[3]){
        if(contestantAnswers[1] == contestantAnswers[2] && contestantAnswers[2] == contestantAnswers[3]){
            kickPlayer(contestantAnswers[1])
            pause()
            return
        }
    }
    if(answeredUsers[0] && answeredUsers[2] && answeredUsers[3]){
        if(contestantAnswers[0] == contestantAnswers[2] && contestantAnswers[2] == contestantAnswers[3]){
            kickPlayer(contestantAnswers[0])
            pause()
            return
        }
    }
    console.log(answeredUsers)
    console.log(contestantAnswers)
    isCurrentlyPolling = false
}
async function updateFinalAnswers() {
    if(isCurrentlyPolling){
        return
    }
    isCurrentlyPolling = true
    const res = await fetch(baseURL + "answers")
    const data = await res.json()

    const contestantAnswers = [data.player1, data.player2, data.player3, data.player4]

    let isAllAnswered = true
    for(i = 0; i < contestantAnswers.length; i++){

        if(i != kickedPlayer-1){

                if(playerAnswerElements[i].innerHTML != contestantAnswers[i]){
                    contestantAnswers[i] = formatAndVerifyFinal(contestantAnswers[i])
                    
                    if(contestantAnswers[i] != undefined){
                        playerAnswerElements[i].innerHTML = contestantAnswers[i]
                    }else{
                        if(playerAnswerElements[i].innerHTML != ""){
                            contestantAnswers[i] = playerAnswerElements[i].innerHTML
                        }else{
                            isAllAnswered = false
                        }
                    }
                }
        }
    }

    let finalAmounts = [aAnswer.innerHTML, bAnswer.innerHTML, cAnswer.innerHTML]
    for(i = 0; i < contestantAnswers.length; i++){
        if(i != kickedPlayer-1){
            console.log("finalPlayerStanding[" +  parseInt(contestantAnswers[i])-1 + "] = "  + activePlayers[i])
            console.log("finalPlayerAmounts[" +  parseInt(contestantAnswers[i])-1 + "] = "  + finalAmounts[contestantAnswers[i]])
            finalPlayerStanding[parseInt(contestantAnswers[i])-1] = activePlayers[i]

            finalPlayerAmounts[parseInt(contestantAnswers[i])-1] = finalAmounts[parseInt(contestantAnswers[i]-1)]
        }
    }

    contestantAnswers.splice(kickedPlayer-1, 1)

    if(isAllAnswered){
        
        let setAnswers = new Set(contestantAnswers)
        if(setAnswers.size == 3){
            pause()
            
            console.log(finalPlayerStanding)
            console.log(finalPlayerAmounts)
            setUpLeaderBoard()
            return
        }
    }
    
    isCurrentlyPolling = false
}



//////////////////////////////playback///////////////////////////////////
async function start(){
    clearInterval(playerInterval)
    await resetAnswers()
    if(isQuestionLoaded){
        if(!isruinning){
            cashStartTime = Date.now();
            testint = setInterval(MainClock);
            isruinning = true;
        }
    }else{
        alert("erm...no question is loaded")
    }
}

const pause = () =>{
    if(isruinning){
        if(isHoldActive){
            breakhold()
        }
        console.log("pause stopped sand clock"); 
        clearInterval(testint);
        isruinning = false;
        loadTable()
        isCurrentlyPolling = false
        listenForReveal()
    }else{
        alert("erm...gotta start the game before u pause it")
    }
}


function breakhold(){
    isHoldActive = false
    holdAlert.style.visibility = "hidden"
    clearInterval(holdInt)
    timer.innerHTML = lastSecondDisplayed
}

function UpdateHoldTimer(){
    currentHoldTime--
    if(currentHoldTime == 0){
        isHoldActive = false
        pausedTime = (Date.now() - lastTickTime)
        cashStartTime += pausedTime
        holdAlert.style.visibility = "hidden"
        clearInterval(holdInt)
    }else{
        timer.innerHTML = currentHoldTime;
    }
}
function displayHoldAlert(playerIndex){
    holdAlert.innerHTML = "⏰" + playerNameElements[playerIndex].innerHTML + "⏰"
    holdAlert.style.visibility = "visible"
}
function hold(playerIndex){
    if(isKickRound){
        if(isflashing){
            clearInterval(flashInterval)
            timer.style.color = aqua
        }
        currentHoldTime = initHoldTime
        isHoldActive = true
        timer.innerHTML = currentHoldTime
        displayHoldAlert(playerIndex)
        holdInt = setInterval(UpdateHoldTimer,1000)
    }else{
        alert("erm...gotta start the game before u pause it")
    }
};//hold_Btn.addEventListener("click", hold);

const loadTable = () =>{
    
    if(isKickRound){
        bankAmt = cashAmt
        bank.innerHTML = formatCash(bankAmt)
        adjustTextToFillCon(bank, 70, false)
        if(isFail){
            lose.innerHTML = formatCash(cashAmt);
            lose.style.opacity = "1"
            wrongAnswerCSS()
        }else{
            total.innerHTML = formatCash(cashAmt);
            adjustTextToFillCon(total, 70, false)

            lose.style.visibility = "hidden"
            win.style.visibility = "hidden"
        }
        
        

        table.style.animation = "moveleft 1s";
        table.style.left = "175px";
        table.style.opacity = "1";
        isTableDisplayed = true

    }else if(!isFinalRound){
        potentialWin = cashAmt+bankAmt
        win.innerHTML = formatCash(potentialWin);
        adjustTextToFillCon(win, 40, false)


        total.innerHTML = formatCash(bankAmt);
        adjustTextToFillCon(total, 70, false)
        
        potentialLose = bankAmt == 0 ?  0 : bankAmt/2
        lose.innerHTML = formatCash(potentialLose);

        adjustTextToFillCon(lose, 40, false)

        table.style.animation = "moveleft 1s";
        table.style.left = "175px";
        table.style.opacity = "1";
        isTableDisplayed = true

        if(isFail){
            clearInterval(revealInt)
            listenForQuestion()
            revealCorrectAnswers()
        }
    }
    
};

////////////////////////////////////////////////////////////////////////////////////////////////////////


// let testTable = document.createElement("button")
// testTable.innerHTML = "test table"
// testTable.setAttribute('class', "button");
// testTable.addEventListener('click', loadTable)
// // buttonList.appendChild(testTable);



////////////////////////////////////////////////////////////////////////////////////////////////////////


//showTable_Btn.addEventListener("click", loadTable);


//hideTable_Btn.addEventListener("click", hideTable);

//////////////////////////////stage buttons//////////////////////////////
const hideTable = () =>{
    if(isTableDisplayed){
        // table.style.animation = "moveRight 1s";
        table.style.left = "-200px";
        table.style.opacity = "0";
        isTableDisplayed = false

        win.style.animation = "";
        win.style.height = "55px" 
        win.style.lineHeight = "45px"
        win.style.width =  "306px" 
        win.style.top = "22px"
        win.style.left = "102px"
        win.style.fontSize = "40px"

        lose.style.animation = "";
        lose.style.height = "55px" 
        lose.style.lineHeight = "45px"
        lose.style.width =  "306px" 
        lose.style.top = "192px"
        lose.style.left = "102px"
        lose.style.fontSize = "40px"

        total.style.visibility = "visible"
        lose.style.visibility = "visible"
        win.style.visibility = "visible"
    }
}
function resetAnswerDisplay(){
    for(i = 0; i < playerAnswerElements.length; i++){
        playerFilmElements[i].style.backgroundColor = ""//"rgb(0, 255, 242)"
        playerAnswerElements[i].innerHTML = ""
    }
}
function resetBar () {
    bar.style.height = "592px";
    bar.style.top = "-1px";
    handle.style.top = "-10px";
    cashBox.style.top = "0px"
}
function resetQuestionCSS(){
    aBox.style.left = "200px";
    bBox.style.left = "200px";
    cBox.style.left = "200px";
    dBox.style.left = "200px";
    aBox.style.border = "3px solid rgb(0, 255, 234)";
    bBox.style.border = "3px solid rgb(0, 255, 234)";
    cBox.style.border = "3px solid rgb(0, 255, 234)";
    dBox.style.border = "3px solid rgb(0, 255, 234)";
    aBox.style.color = "rgb(255,255,255)";
    bBox.style.color = "rgb(255,255,255)";
    cBox.style.color = "rgb(255,255,255)";
    dBox.style.color = "rgb(255,255,255)";
    aBox.style.animation = "";
    bBox.style.animation = "";
    cBox.style.animation = "";
    dBox.style.animation = "";
    ALetter.innerHTML = "a"
    BLetter.innerHTML = "b"
    CLetter.innerHTML = "c"
    prompt.style.border = "3px solid rgb(0, 255, 234)";
    prompt.style.boxShadow = "rgb(0, 0, 255) 0 0 10px 1px";
    aBox.style.boxShadow = "rgb(0, 0, 255) 0 0 10px 1px";
    bBox.style.boxShadow = "rgb(0, 0, 255) 0 0 10px 1px";
    cBox.style.boxShadow = "rgb(0, 0, 255) 0 0 10px 1px";
    dBox.style.boxShadow = "rgb(0, 0, 255) 0 0 10px 1px";
    aBox.style.top = "120px";
    bBox.style.top = "210px";
    cBox.style.top = "300px";
    dBox.style.top = "390px";
    aAnswer.style.fontFamily = "VegMeister";
    bAnswer.style.fontFamily = "VegMeister";
    cAnswer.style.fontFamily = "VegMeister";

    dBox.style.visibility = "hidden"
    quesionBox.style.top = "1080px";
    quesionBox.style.animation = "";
}
function fullBoardReset(){
    resetBar();
    resetQuestionCSS()
    hideTable()
    resetAnswerDisplay()
    gameWrapper.style.background = "linear-gradient(320deg, #eb92e4, #000000, #63c9b4)"
    timer.style.color = "aqua";
}
function updateStartAmts(newCash, newTime){
    if(isruinning == true){
        pause();
    }
    cashAmt = newCash;
    initialAmt = newCash
    time = newTime;
    initialTime = newTime;

    timer.innerHTML = time;
    adjustTextToFillCon(timer, 70, false)

    cashBox.innerHTML = formatCash(cashAmt);
    adjustTextToFillCon(cashBox, 40, false)
}


async function pollForNames(){
    console.log("playerInterval set:" + !playerInterval)
    activePlayers = []
    const res = await fetch(baseURL + "displaynames")
    const data = await res.json()

    const names = [data.player1, data.player2, data.player3, data.player4]

    const imgRes = await fetch(baseURL + "avatars")
    const imgData = await imgRes.json()

    const avatars = [imgData.player1, imgData.player2, imgData.player3, imgData.player4]

    for(i=0; i<4; i++){
        if(names[i] != undefined){
            playerNameElements[i].innerHTML = names[i]
            let bgImageStr = "url(" + avatars[i] +")"
            playerBoxElements[i].style.backgroundImage = bgImageStr
            adjustTextToFillCon(playerNameElements[i], 55, false)
            console.log(i + ":  " + playerNameElements[i].style.fontSize)
            activePlayers.push(names[i])
        }
    }
    if(activePlayers.length == _MAX_PLAYERS){//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////start looking for question when n people join the game 
        clearInterval(playerInterval)
        console.log("playerInterval cleared:" + !playerInterval)
        listenForQuestion()
    }
    console.log("-=---------" + activePlayers)
    
};
playerInterval = setInterval(pollForNames, 1000)
console.log("playerInterval set:" + !playerInterval)

async function resetAnswers(){
    await fetch(baseURL + "answerReset")
}



function makeAnswerGreen(answer){
    answer.style.color = "rgb(0,255,0)";
    answer.style.border = "3px solid rgb(0,255,0)";
    answer.style.boxShadow = "rgb(2,30,20) 0 0 10px 1px";
}

function revealSingleAnswers(answer){
    let correctAnswer;
    if(answer == "a"){correctAnswer = aBox;}
    if(answer == "b"){correctAnswer = bBox;}
    if(answer == "c"){correctAnswer = cBox;}
    if(answer == "d"){correctAnswer = dBox;}
    correctAnswer.style.animation = "correctAnswers .5s";
    correctAnswer.style.left = "100px";
    makeAnswerGreen(correctAnswer);
}
function revealdoubleAnswers(first, second){
    revealSingleAnswers(first);
    revealSingleAnswers(second);
}
function revealOrderAnswers(first, second, third){
    if(first == "b"){
        bBox.style.animation = "BtoA 1.5s";
        bBox.style.top = "120px";
    }else if(first == "c"){
        cBox.style.animation = "CtoA 1.5s";
        cBox.style.top = "120px";
    }

    if(second == "a"){
        aBox.style.animation = "AtoB 1.5s";
        aBox.style.top = "210px";
    }else if(second == "c"){
        cBox.style.animation = "CtoB 1.5s";
        cBox.style.top = "210px";
    }

    if(third == "a"){
        aBox.style.animation = "AtoC 1.5s";
        aBox.style.top = "300px";
    }else if(third == "b"){
        bBox.style.animation = "BtoC 1.5s";
        bBox.style.top = "300px";
    }
    makeAnswerGreen(aBox);
    makeAnswerGreen(bBox);
    makeAnswerGreen(cBox);
}
function rightAnswerCSS(){
    for(i = 0; i < playerBoxElements.length; i++){
        playerFilmElements[i].style.backgroundColor = "green"
        // playerAnswerElements[i].style.backgroundColor = "green"
        // playerNameElements[i].style.backgroundColor = "green"
    }
    total.style.visibility = "hidden"
    lose.style.visibility = "hidden"
    win.style.height = "90px" 
    win.style.lineHeight = "80px" 
    win.style.top = "91px"
    win.style.left = "18px"
    win.style.width =  "465px" 
    let oldFont = win.style.fontSize
    let newFont = adjustTextToFillCon(win, 70, false)
    win.style.fontSize = oldFont
    var keyFrames = '\
        @keyframes moveWin {\
            0% {\
                top:  22px;\
                height: 55px;\
                line-height: 45px;\
                width: 306px;\
                font-size: ' + oldFont + ';\
                left: 102px;\
            }\
            100% {\
                top: 91px;\
                height: 90px;\
                line-height: 80px;\
                width: 465px;\
                font-size: ' + newFont + 'px;\
                left: 18px;\
            }\
        }\
    '
    console.log("keyFrames: " + keyFrames)
    dynamicStyle.innerHTML = keyFrames
    // setTimeout(function(){win.style.animation = "moveWin 1s";},1000)
    
    win.style.animation = "moveWin 1s";
    win.style.fontSize = newFont + "px"
    
    
    gameWrapper.style.background = "linear-gradient(320deg, #00ff00, #000000, #00ff00)"
}
function wrongAnswerCSS(){
    for(i = 0; i < playerBoxElements.length; i++){
        playerFilmElements[i].style.backgroundColor = "red"
    }
    total.style.visibility = "hidden"
    win.style.visibility = "hidden"
    lose.style.height = "90px" 
    lose.style.lineHeight = "80px"
    lose.style.width =  "465px" 
    lose.style.top = "91px"
    lose.style.left = "18px"
    let oldFont = lose.style.fontSize
    let newFont = adjustTextToFillCon(lose, 70, false)
    lose.style.fontSize = oldFont
    var keyFrames = '\
        @keyframes moveLose {\
            0% {\
                top:  192px;\
                height: 55px;\
                line-height: 45px;\
                width: 306px;\
                font-size: ' + oldFont + ';\
                left: 102px;\
            }\
            100% {\
                top: 91px;\
                height: 90px;\
                line-height: 80px;\
                width: 465px;\
                font-size: ' + newFont + 'px;\
                left: 18px;\
            }\
        }\
    '
    console.log("keyFrames: " + keyFrames)
    dynamicStyle.innerHTML = keyFrames
    
    lose.style.animation = "moveLose 1s";
    lose.style.fontSize = newFont + "px"
    
    
    gameWrapper.style.background = "linear-gradient(320deg, #ff0000, #000000, #ff0000)"
}
function revealCorrectAnswers(){
    if(isTableDisplayed && !isKickRound && !isFinalRound){
        if(currentQAnswerType == "single"){
            revealSingleAnswers(currentQuestion.answer);
        }else if(currentQAnswerType == "double"){
            revealdoubleAnswers(currentQuestion.answer[0], currentQuestion.answer[1])
        }else if(currentQAnswerType == "order"){
            revealOrderAnswers(currentQuestion.answer[0], currentQuestion.answer[1], currentQuestion.answer[2]);
        }
        if(consensusAnswer != undefined && currentQuestion.answer.toLowerCase() == consensusAnswer.toLowerCase() && !isFail){
            bankAmt = potentialWin
            bank.innerHTML = formatCash(potentialWin);
            adjustTextToFillCon(bank, 70, false)

            rightAnswerCSS()
        }else{
            bankAmt = potentialLose
            bank.innerHTML = formatCash(potentialLose);
            adjustTextToFillCon(bank, 70, false)

            
            wrongAnswerCSS()
        }
    }else{
        alert("erm...cant do that")
    }
}

function loadSelectedQuestion(){
    if(isQuestionSelected){
        quesionBox.style.animation = "moveUp 1s";
        quesionBox.style.top = "400px";
        isQuestionLoaded = true
    }else{
        alert("erm...no question is selected")
    }
}

function makeQuestionOrange(){
    prompt.style.border = "3px solid rgb(255, 255, 0)";
    aBox.style.border = "3px solid rgb(255, 255, 0)";
    bBox.style.border = "3px solid rgb(255, 255, 0)";
    cBox.style.border = "3px solid rgb(255, 255, 0)";
    prompt.style.boxShadow = "rgb(241, 90, 34) 0 0 10px 1px";
    aBox.style.boxShadow = "rgb(241, 90, 34) 0 0 10px 1px";
    bBox.style.boxShadow = "rgb(241, 90, 34) 0 0 10px 1px";
    cBox.style.boxShadow = "rgb(241, 90, 34) 0 0 10px 1px";
}

