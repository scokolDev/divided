import WebSocket from 'ws'
import express from 'express'
import { fileURLToPath } from 'url'
import path from 'path'
import fs from 'fs'
import discord from 'discord.js'
import dotEnv from 'dotenv'
import { getVoiceConnection, joinVoiceChannel } from '@discordjs/voice'
import { connect } from 'http2'

dotEnv.config()

const client = new discord.Client({ intents: 641 });
let myGuild
let audio

const app = express()
const port = 3000

const __fn = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__fn); // get the name of the directory
console.log(__dirname)
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let defaultPfps = []
fs.readdir(__dirname + "/public/img/pfps", function(err, files){
    for(let i=0; i<files.length; i++){
        defaultPfps.push("/img/pfps/" + files[i])
    }
})

let endMusicFiles = []
fs.readdir(__dirname + "/public/music", function(err, files){
    for(let i=0; i<files.length; i++){
        endMusicFiles.push(files[i])
    }
})

let players = []
const playerMap = new Map();
let numOfPlayers = 0

let playerIndex
let playerNames = []
let playerAnswers = []
let playerIDs = []
let isPlayerSpeaking = [false, false, false, false]
let playerAvatarPaths = []


let questionSelected = undefined

let isStart = false
let isReveal = false
let isLoad = false

let allQuestions = []

const ws = new WebSocket('wss://gateway.discord.gg/?v=6&encoding=json')
let interval = 0

let token = process.env.TOKEN
let discordServerID = process.env.DIS_SERVER_ID
let discordChannelID = process.env.DIS_CHANNEL_ID
let discordAnswerChannelID = process.env.DIS_TEXT_CHANNEL_ID

client.once('ready', () => {
    myGuild = client.guilds.cache.get(discordServerID)
    console.log(myGuild.voiceAdapterCreator)

    const connection = joinVoiceChannel({
        channelId: discordChannelID,
        guildId: myGuild.id,
        adapterCreator: myGuild.voiceAdapterCreator,
        selfDeaf: false,
        selfMute: false,
    });
    audio = connection.receiver.speaking


    console.log(audio)
});

client.login(token);


const testingInt = setInterval(function(){
    try{
        //console.log(players[0].PID)
        //console.log(new Date(audio.users.get(players[0].PID)))
        players[0].isSpeaking = (audio.users.get(players[0].PID) ? true : false)
        players[1].isSpeaking = (audio.users.get(players[1].PID) ? true : false)
        players[2].isSpeaking = (audio.users.get(players[2].PID) ? true : false)
        players[3].isSpeaking = (audio.users.get(players[3].PID) ? true : false)
        // for(j=0; j<4; j++){
            
        //     console.log("isSpeaking:" + players[j].isSpeaking)
        // }
    }catch(error){}
}, 50)

 
class Player {
    constructor(playerNum, playerName, displayName, playerID, avatarPath) {
      this.number = playerNum
      this.name = playerName
      this.displayName = displayName
      this.PID = playerID
      this.avatar = avatarPath
      this.answer = undefined
      this.isSpeaking = false
    }
  }
function addPlayer(playerNum, playerName, displayName, playerID, avatarPath){
    let newPlayer = new Player(playerNum, playerName, displayName, playerID, avatarPath)
    players[playerNum-1] = newPlayer
    playerMap.set(playerID, playerNum-1)
    console.log(players[playerNum-1].name)
}
addPlayer(1, undefined, undefined, undefined, undefined)
addPlayer(2, undefined, undefined, undefined, undefined)
addPlayer(3, undefined, undefined, undefined, undefined)
addPlayer(4, undefined, undefined, undefined, undefined)
// function getPlayerByID(playerNum, playerName, displayName, playerID, avatarPath){
//     let newPlayer = new Player(playerNum, playerName, displayName, playerID, avatarPath)
//     players[playerNum-1] = newPlayer
// }

//addPlayer(1, "scokol", "scokol", "playerID", "avatarPath")
//players[0].answer = "hi"
//console.log("players:------------------------" + players[0].answer)


function loadQuesions(){
    const data = fs.readFileSync(__dirname + '/questions.txt', 'utf8');
    let presetQuestions = ['{"question": "final"}', '{"question": "kick"}']
    let questionsFromFile = data.split("\n")
    allQuestions = presetQuestions.concat(questionsFromFile)
    console.log(allQuestions)
    questionSelected = undefined
}
loadQuesions()

function clearQSelection(){
    questionSelected = undefined
}
app.get('/clearQSelection', (req, res) => {
    clearQSelection()
    res.sendStatus(200)
})

app.get('/endsong', (req, res) => {
    let numOfSongs = endMusicFiles.length

    let randomIndex = Math.floor(Math.random() * numOfSongs)

    res.status(200).json(endMusicFiles[randomIndex])
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


app.post("/question", (req, res) => {
    console.log("---------")
    const isExistingQuestions = fs.readFileSync(__dirname + '/questions.txt', 'utf8') != "";

    const questionToAdd = isExistingQuestions ? ("\n" + JSON.stringify(req.body)) : JSON.stringify(req.body)
    fs.appendFileSync(__dirname + '/questions.txt', questionToAdd, err => {
          console.error(err || "written");
      });
    loadQuesions()
    //console.log("after adding question" + allQuestions)
    res.status(200).json((allQuestions.length - 1))
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




app.get('/selectQuestion/:QI', (req, res) => {
    clearQSelection()

    let validSelection = false
    const {QI} = req.params
    if(QI.toLowerCase() == "final"){
        questionSelected = 0
        validSelection = true
    }else if(QI.toLowerCase() == "kick"){
        questionSelected = 1
        validSelection = true
    }else if(parseInt(QI) < allQuestions.length){
        questionSelected = parseInt(QI)
        validSelection = true
    }
    validSelection ? res.sendStatus(200) : res.sendStatus(201)
    
})


app.get('/startGame', (req, res) => {
    isStart = true
    res.sendStatus(200)
})
app.get('/isStart', (req, res) => { 
    res.status(200).json(isStart)
})

app.get('/reveal', (req, res) => {
    isReveal = true
    res.sendStatus(200)
})
app.get('/isReveal', (req, res) => {
    res.status(200).json(isReveal)
})

app.get('/loadQuestion', (req, res) => {
    isLoad = true
    res.sendStatus(200)
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

app.listen(port, () => console.log('server has started on port: 3000'))








let payload = {
    op:2,
    d:{
        token: token,
        intents: 641,
        properties:{
            $os: 'windows',
            $browser:'firefox',
            $device: 'firefox'
        }
    }
}

ws.on('open', function open(){
    ws.send(JSON.stringify(payload))
})

ws.on('close', function close(data){
    let payload = JSON.parse(data)
    console.log(payload);
});

ws.on('error', function error(){
    console.log("error.");
});

// function openAudioStream(userID){
//     const audio = connection.receiver.createStream(userID, { mode: 'pcm' });
// }
ws.on('message', function incoming(data){
    let payload = JSON.parse(data)
    const {t, event, op, d} = payload
    console.log("zopcode: " + op)
    switch(op){
        case 10:
            const {heartbeat_interval} = d
            interval = heartbeat(heartbeat_interval)
            break
        case 11:
            console.log("heartbeat recieved, connection persists")
            break
    }
    console.log(t)
    switch(t){
        case 'MESSAGE_CREATE':  
            console.log("player1: " + players[0].name + " - " +
            "player2: " + players[1].name + " - " +
            "player3: " + players[2].name + " - " +
            "player4: " + players[3].name

            )
            console.log(d)
            if(d.channel_id == discordAnswerChannelID){
                let author = d.author.username
                let content = d.content
                if(numOfPlayers < 4 && !playerMap.has(d.author.id)){
                    numOfPlayers++
                    let pNumber = numOfPlayers
                    let PlayerAvatarPath = null
                    if(d.author.avatar != null){
                        PlayerAvatarPath = "https://cdn.discordapp.com/avatars/" + d.author.id + '/' + d.author.avatar
                    }else{
                        let randomPfpIdx = Math.floor(Math.random() * defaultPfps.length)
                        PlayerAvatarPath = defaultPfps[randomPfpIdx]
                        defaultPfps.splice(randomPfpIdx, 1)
                    }
                    addPlayer(pNumber, author, d.author.global_name, d.author.id, PlayerAvatarPath)

                }else{
                    let IndexofPlayer = playerMap.get(d.author.id)
                    players[IndexofPlayer].answer = content
                    console.log(players[IndexofPlayer].name + ": " + players[IndexofPlayer].answer)
                }
            }
    }
})


const heartbeat = (ms) => {
    console.log("ms: " + ms)
    return setInterval(() => {
            ws.send(JSON.stringify({op: 1, d: null}))
            console.log("sent heartbeat")
    }, ms)
}
