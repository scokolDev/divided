function resetBoard(){
    boardBackground.style.background = "linear-gradient(320deg, #eb92e4, #000000, #63c9b4)"

    playerManagerElement.setPlayerColor("")
    questionElement.setColor(DEFAULT_COLOR, DEFAULT_Q_SHADOW, false)
    questionElement.setQuestionDisplay(false)
    timeBarElement.updateBar(1)
    timerElement.time = ""
    playerManagerElement.clearPlayerAnswers()
    
    winningsTableElement.resetTable()
    winningsTableElement.display = false
    
}

function takeoverBoardCSS(){
    boardBackground.style.background = "linear-gradient(320deg, " + TAKEOVER_COLOR + ", rgb(0,0,0), " + TAKEOVER_COLOR + ")"

    playerManagerElement.setPlayerColor(TAKEOVER_COLOR)
    questionElement.setColor(TAKEOVER_COLOR, TAKEOVER_Q_SHADOW, false)
    //setPlayerColor(TAKEOVER_COLOR)
}

function wrongAnswerCSS(){
    boardBackground.style.background = "linear-gradient(320deg, " + WRONG_COLOR + ", rgb(0,0,0), " + WRONG_COLOR + ")"

    playerManagerElement.setPlayerColor(WRONG_COLOR)
    questionElement.setColor(WRONG_COLOR, WRONG_Q_SHADOW, true)
}

function correctAnswerCSS(){
    boardBackground.style.background = "linear-gradient(320deg, " + CORRECT_COLOR + ", rgb(0,0,0), " + CORRECT_COLOR + ")"

    playerManagerElement.setPlayerColor(CORRECT_COLOR)
    questionElement.setColor(CORRECT_COLOR, CORRECT_Q_SHADOW, true)
}