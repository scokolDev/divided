import WebSocket from 'ws'
//import express from 'express'
import discord from 'discord.js'
import dotEnv from 'dotenv'
import pModel from './models/player.js'
//import IO from './file_IO.js'
import {joinVoiceChannel } from '@discordjs/voice'

dotEnv.config()

const client = new discord.Client({ intents: 641 });
client.login(process.env.TOKEN);

//const discordRouter = express.Router()
const ws = new WebSocket('wss://gateway.discord.gg/?v=6&encoding=json')
const handshakePayload = {
    op:2,
    d:{
        token: process.env.TOKEN,
        intents: 641,
        presence: {
            "activities": [{
                "name": "Divided!",
                "type": 0
            }],
            "status": "online",
            "since": 1,
            "afk": false
        },
        properties:{
            $os: 'windows',
            $browser:'firefox',
            $device: 'firefox'
        }
    }
}

let audio
let myGuild
let numOfPlayers = 0 
let players = new Map() //playerNumber -> playerObject
let UIDtoPlayerIndex = new Map() //playerUID -> player key in players
let isMuted = false //whether players are server muted
let kickedPlayer = undefined


client.once('ready', () => {
    
    myGuild = client.guilds.cache.get(process.env.DIS_SERVER_ID)

    const connection = joinVoiceChannel({
        channelId: process.env.DIS_CHANNEL_ID,
        guildId: myGuild.id,
        adapterCreator: myGuild.voiceAdapterCreator,
        selfDeaf: false,
        selfMute: false,
    });

    audio = connection.receiver.speaking

    setInterval(function(){
        players.forEach((player, playerNum) => {
            try{
                player.isSpeaking = (audio.users.get(player.UID) ? true : false)
            }catch(error){}
        })
    }, 50)
});

ws.on('open', function open(){
    ws.send(JSON.stringify(handshakePayload))
})

ws.on('close', function close(data){
    ws.send(JSON.stringify(handshakePayload))
    console.log("discord api ws closed - " + JSON.parse(data));
});

ws.on('error', function error(){
    console.log("error.");
});

function addNewPlayer(messageData){
    console.log("success")

    //user display name in game
    let author = messageData.member.nick
    if(author == null){
        author = messageData.author.global_name
    }
    if(author == null){
        author = messageData.author.username
    }

    //user avatar
    //////////let PlayerAvatarPath = IO.getRandPfp()//null
    // if(messageData.author.avatar != null){
    //     PlayerAvatarPath = "https://cdn.discordapp.com/avatars/" + messageData.author.id + '/' + messageData.author.avatar
    // }else{
    //     PlayerAvatarPath = IO.getRandPfp()
    // }

    let PID = messageData.author.id

    numOfPlayers++
    let playerNumber = numOfPlayers

    let newPlayer = new pModel.Player(playerNumber, author, PID, PlayerAvatarPath)
    players.set(playerNumber, newPlayer)
    UIDtoPlayerIndex.set(PID, playerNumber)
    
}

// function openAudioStream(userID){
//     const audio = connection.receiver.createStream(userID, { mode: 'pcm' });
// }
ws.on('message', function incoming(data){
    const {t, event, op, d} = JSON.parse(data)

    console.log("incoming op code: " + op)
    if (op == 10){
        const {heartbeat_interval} = d
        setInterval(() => {
            console.log("beat")
            ws.send(JSON.stringify({op: 1, d: null}))
        }, heartbeat_interval)
    }else if (op == 7){
        console.log("================================================================================================================================")
        ws.send(JSON.stringify(handshakePayload))
        //ws.send(JSON.stringify({op: 6, d: null}))
    }
    if (t == 'MESSAGE_CREATE'){
        console.log(d)
        if(d.channel_id == process.env.DIS_TEXT_ID){
            if(numOfPlayers < 4 && !UIDtoPlayerIndex.has(d.author.id) && kickedPlayer == undefined){
                addNewPlayer(d)
            }else if(UIDtoPlayerIndex.has(d.author.id)){
                players.get(UIDtoPlayerIndex.get(d.author.id)).answer = d.content.toLowerCase()
            }
        }
    }
})

client.on("messageCreate",function incoming(data){
    console.log("DISCORD.JS EVENT:")
    console.log(data)
})


//--------------------------------------routes--------------------------------------
// discordRouter.get('/toggleMute', (req, res) =>{ 
//     players.forEach((player) => {
//         myGuild.members.edit(player.UID, {mute:!isMuted})
//     })
//     if(kickedPlayer != undefined){
//         myGuild.members.edit(kickedPlayer.UID, {mute:!isMuted})
//     }
//     isMuted = !isMuted
//     res.sendStatus(200)
// })

// discordRouter.get('/playerData', (req, res) =>{ 
//     res.status(200).json(JSON.stringify(Array.from(players.entries())))
// })

// discordRouter.get('/clearAnswers', (req, res) =>{
//     players.forEach((player) => {
//         player.answer = undefined
//     })
//     res.sendStatus(200)
// })

// discordRouter.get('/kickPlayer/:playerNum', (req, res) =>{
//     let pNum = parseInt(req.params.playerNum)
//     kickedPlayer = players.get(pNum)
//     //console.log(kickedPlayer)
//     UIDtoPlayerIndex.delete(kickedPlayer.UID)
//     players.delete(pNum)
//     res.sendStatus(200)
// })

// export default {discordRouter}
//, deletePlayer, togglePlayerMute, clearAnswers