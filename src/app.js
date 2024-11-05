import WebSocket from 'ws'
import express from 'express'
import { fileURLToPath } from 'url'
import path from 'path'
import IO from "./file_IO.js"
import dis from "./discord_players.js"
import fs from 'fs'//
import discord from 'discord.js'
import dotEnv from 'dotenv'//
import { getVoiceConnection, joinVoiceChannel } from '@discordjs/voice'
import { connect } from 'http2'

// const IO = require("./file_IO")
console.log(IO)
const app = express()
const port = 3000

const __fn = fileURLToPath(import.meta.url); // get the resolved path to the file
const __project_dirname = path.dirname(path.dirname(__fn)) // get the name of the directory

//console.log(__dirname)
//app.use(express.json());/////
app.use(express.static(path.join(__project_dirname, 'public')));
app.use(IO.uploadRouter)



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


let longPollResponse
let LongPollStage
app.get("/", (req, res) =>{
    res.sendFile(__project_dirname + "\\public\\pages\\upload.html")
})
app.get("/main", (req, res) =>{
    res.sendFile(__project_dirname + "\\public\\pages\\index.html")
})

app.get('/nextStage', (req, res) =>{
    //bad request, client is not ready
    if(longPollResponse == undefined){
        res.sendStatus(400)
        return
    }

    longPollResponse.send(200).json({continue: true, moreData: undefined})
    res.sendStatus(200)
})
app.get('/waiting/:stage', (req, res) => {
    longPollResponse = res
    LongPollStage = req.params.stage
})
// app.get('/startGame', (req, res) => {
//     longPollResponse.send(200).json({continue: true, moreData: undefined})
//     res.sendStatus(200)
// })
// app.get('/reveal', (req, res) => {
//     longPollResponse.send(200).json({continue: true, moreData: undefined})
//     res.sendStatus(200)
// })
// app.get('/loadQuestion', (req, res) => {
    
// })
app.get('/selectQuestion/:QI?', (req, res) => {

    //bad request, client is not ready
    if(longPollResponse == undefined){
        res.sendStatus(400)
        return
    }


    let question
    const {QI} = req.params

    if(QI == undefined){
        question = IO.getRandQuestion()
    }
    else{
        if(QI.toLowerCase() == "final" || QI.toLowerCase() == "kick"){
            question = QI.toLowerCase()
        }else if(IO.isValidQuestion(QI)){
            question = IO.getQuestion(QI)
        }else{
            res.sendStatus(404)
            return
        }
    }
    

    longPollResponse.json({continue: false, moreData: question})
    res.sendStatus(200)
    
})


// const testingInt = setInterval(function(){
//     try{
//         players[0].isSpeaking = (audio.users.get(players[0].PID) ? true : false)
//         players[1].isSpeaking = (audio.users.get(players[1].PID) ? true : false)
//         players[2].isSpeaking = (audio.users.get(players[2].PID) ? true : false)
//         players[3].isSpeaking = (audio.users.get(players[3].PID) ? true : false)
//     }catch(error){}
// }, 50)

 

// function addPlayer(playerNum, playerName, displayName, playerID, avatarPath){
//     let newPlayer = new Player(playerNum, playerName, displayName, playerID, avatarPath)
//     players[playerNum-1] = newPlayer
//     playerMap.set(playerID, playerNum-1)
//     console.log(players[playerNum-1].name)
// }
// addPlayer(1, undefined, undefined, undefined, undefined)
// addPlayer(2, undefined, undefined, undefined, undefined)
// addPlayer(3, undefined, undefined, undefined, undefined)
// addPlayer(4, undefined, undefined, undefined, undefined)


// function loadQuesions(){
//     const data = fs.readFileSync(__dirname + '/questions.txt', 'utf8');
//     let presetQuestions = ['{"question": "final"}', '{"question": "kick"}']
//     let questionsFromFile = data.split("\n")
//     allQuestions = presetQuestions.concat(questionsFromFile)
//     console.log(allQuestions)
//     questionSelected = undefined
// }
// loadQuesions()

// function clearQSelection(){
//     questionSelected = undefined
// }

app.get('/playerData', (req, res) =>{ res.json(dis.getPlayerData())})
app.get('/endsong', (req, res) =>{IO.getRandEndSongPath(req, res)})

app.listen(port, () => console.log('server has started on port: ' + port))



