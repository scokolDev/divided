app.get('/clearQSelection', (req, res) => {
    clearQSelection()
    res.sendStatus(200)
})

app.get('/create', (req, res) => {
    res.redirect("create.html")
    res.status(200)
})

function clearAllApiCalls(){
    isStart = false
    isReveal = false
    isLoad = false
    clearQSelection()
}
app.get('/clearAllSelections', (req, res) => {
    clearAllApiCalls()
    res.sendStatus(200)
})





app.get('/answers', (req, res) => {
    res.status(200).json({player1: players[0].answer, player2: players[1].answer, player3: players[2].answer, player4: players[3].answer})
})

app.get('/names', (req, res) => {
    res.status(200).json({player1: players[0].name, player2: players[1].name, player3: players[2].name, player4: players[3].name})
})
app.get('/displaynames', (req, res) => {
    res.status(200).json({player1: players[0].displayName, player2: players[1].displayName, player3: players[2].displayName, player4: players[3].displayName})
})

app.get('/speaking', (req, res) => {
    res.status(200).json({player1: players[0].isSpeaking, player2: players[1].isSpeaking, player3: players[2].isSpeaking, player4: players[3].isSpeaking})
})

app.get('/avatars', (req, res) => {
    res.status(200).json({player1: players[0].avatar, player2: players[1].avatar, player3: players[2].avatar, player4: players[3].avatar})
})

app.get('/fullReset', (req, res) => {
    playerNames = []
    playerAnswers = []
    res.sendStatus(200)
})
app.get('/answerReset', (req, res) => {
    console.log("pluh")
    players[0].answer = undefined
    players[1].answer = undefined
    players[2].answer = undefined
    players[3].answer = undefined
    res.sendStatus(200)
})








app.get('/isStart', (req, res) => { 
    res.status(200).json(isStart)
})


app.get('/isReveal', (req, res) => {
    res.status(200).json(isReveal)
})


app.get('/isLoadQuestion', (req, res) => {
    res.status(200).json(isLoad)
})

app.get('/getQuestionSelection', (req, res) => {
    let retJSON
    let isSelected = false
    if(questionSelected != undefined){
        console.log("question index:" + questionSelected)
        retJSON = allQuestions[questionSelected]
        questionSelected = undefined
        isSelected = true
        console.log("question obj:" + retJSON)
    }
    isSelected ? res.status(200).json(retJSON) : res.sendStatus(201)
})