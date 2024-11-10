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
client.login(process.env.TOKEN);
let myGuild// = client.guilds.cache.get(process.env.DIS_SERVER_ID)


const ws = new WebSocket('wss://gateway.discord.gg/?v=6&encoding=json')

let audio
let numOfPlayers = 0
let players = new Map() //playerNumber -> playerObject
let UIDtoPlayerIndex = new Map() //playerUID -> player key in players
let isMuted = false //whether players are server muted

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
    console.log(connection)

    console.log(audio)
});

//TODO: add speaking polling



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
    console.log("success")

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
    const {t, event, op, d} = JSON.parse(data) //WARN: check if re-write works

    console.log("incoming op code: " + op)
    if (op == 10){
        const {heartbeat_interval} = d
        setInterval(() => {ws.send(JSON.stringify({op: 1, d: null}))}, heartbeat_interval)
    }
    if (t == 'MESSAGE_CREATE'){
        if(d.channel_id == process.env.DIS_TEXT_ID){
            if(numOfPlayers < 4 && !UIDtoPlayerIndex.has(d.author.id)){
                addNewPlayer(d)
            }else if(UIDtoPlayerIndex.has(d.author.id)){
                //TODO: add input formatting
                players.get(UIDtoPlayerIndex.get(d.author.id)).answer = d.content
            }
        }
    }
})

function getPlayerData(){
    console.log(players)
    return JSON.stringify(Array.from(players.entries()))
}

function deletePlayer(playerNumber){
    kickedPlayer = players.get(playerNumber)
    UIDtoPlayerIndex.delete(players.get(playerNumber).UID)
    players.delete(playerNumber)
}

function togglePlayerMute(){
    //WARN: make sure that map forEach is used right
    players.forEach((value) => {
        myGuild.members.edit(value.UID, {mute:!isMuted})
    })
    if(kickedPlayer != undefined){
        myGuild.members.edit(kickedPlayer.UID, {mute:!isMuted})
    }
    isMuted = !isMuted
}

export default {getPlayerData, deletePlayer, togglePlayerMute}