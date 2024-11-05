import WebSocket from 'ws'//
import express from 'express'
import { fileURLToPath } from 'url'
import path from 'path'
import fs from 'fs'//
import discord from 'discord.js'
import dotEnv from 'dotenv'//
import pModel from './player.js'
import IO from './file_IO.js'
import { getVoiceConnection, joinVoiceChannel } from '@discordjs/voice'
import { connect } from 'http2'

dotEnv.config()

const client = new discord.Client({ intents: 641 });
const ws = new WebSocket('wss://gateway.discord.gg/?v=6&encoding=json')

let myGuild
let audio
let numOfPlayers = 0
let players = new Array(4)
let playerMap = new Map()


// const __token = 
// let discordChannelID = 
// let discordAnswerChannelID = process.env.DIS_TEXT_CHANNEL_ID

client.once('ready', () => {
    myGuild = client.guilds.cache.get(process.env.DIS_SERVER_ID)
    console.log(myGuild.voiceAdapterCreator)

    const connection = joinVoiceChannel({
        channelId: process.env.DIS_CHANNEL_ID,
        guildId: myGuild.id,
        adapterCreator: myGuild.voiceAdapterCreator,
        selfDeaf: false,
        selfMute: false,
    });
    audio = connection.receiver.speaking


    console.log(audio)
});

client.login(process.env.TOKEN);

let payload = {
    op:2,
    d:{
        token: process.env.TOKEN,
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

function addNewPlayer(messageData){

    //user display name in game
    let author = messageData.author.username
    if(author == null){
        author = messageData.author.global_name
    }

    //user avatar
    let PlayerAvatarPath = null
    if(messageData.author.avatar != null){
        PlayerAvatarPath = "https://cdn.discordapp.com/avatars/" + messageData.author.id + '/' + messageData.author.avatar
    }else{
        PlayerAvatarPath = IO.getRandPfp()
    }

    let newPlayer = pModel.Player((playerNum, author, messageData.author.id, PlayerAvatarPath))
    numOfPlayers++
    players[numOfPlayers] = newPlayer
    playerMap[messageData.author.id] = numOfPlayers
}

// function openAudioStream(userID){
//     const audio = connection.receiver.createStream(userID, { mode: 'pcm' });
// }
ws.on('message', function incoming(data){
    let payload = JSON.parse(data)
    const {t, event, op, d} = payload
    console.log("zopcode: " + op)
    if (op == 10){
            const {heartbeat_interval} = d
            interval = heartbeat(heartbeat_interval)
    }
    console.log(t)
    switch(t){
        case 'MESSAGE_CREATE':  
            console.log("player1: " + players[0].name + " - " +
            "player2: " + players[1].name + " - " +
            "player3: " + players[2].name + " - " +
            "player4: " + players[3].name

            )
            if(d.channel_id == discordAnswerChannelID){
                if(numOfPlayers < 4 && !playerMap.has(d.author.id)){
                    addNewPlayer(d)
                }else if(playerMap.has(d.author.id)){
                    let IndexofPlayer = playerMap.get(d.author.id)
                    players[IndexofPlayer].answer = d.content
                    console.log(players[IndexofPlayer].name + ": " + players[IndexofPlayer].answer)
                }
            }
    }
})


const heartbeat = (ms) => {
    return setInterval(() => {
            ws.send(JSON.stringify({op: 1, d: null}))
    }, ms)
}

function getPlayerData(){
    return players
}

export default {getPlayerData}