import WebSocket from 'ws'//
import express from 'express'
import { fileURLToPath } from 'url'
import path from 'path'
import fs from 'fs'//
import csv from 'csv-parser'
import multer from 'multer'
import discord from 'discord.js'
import dotEnv from 'dotenv'//
import { getVoiceConnection, joinVoiceChannel } from '@discordjs/voice'
import { connect } from 'http2'
import { allowedNodeEnvironmentFlags } from 'process'

const __fn = fileURLToPath(import.meta.url); // get the path to the file
const __project_dirname = path.dirname(path.dirname(__fn)) // get the name of the directory

const pfps_path = __project_dirname + "\\public\\assets\\img\\pfps"
const music_path = __project_dirname + "\\public\\assets\\music"
const question_dir_path = __project_dirname + '\\public\\assets\\questions'
const upload = multer({dest: question_dir_path + '\\'})

let questions_path
try{
    fs.readdir(question_dir_path, function(err, files){
        questions_path = question_dir_path + '\\' + files[0]
    })
}catch{
    questions_path = undefined
}

const uploadRouter = express.Router()

uploadRouter.post('/uploadcsv', upload.single('questions'), (req, res) => {
    console.log(req.file)

    //TODO: test and update code 
    questions_path = req.file.path
    
    fs.createReadStream(questions_path)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
            //console.log(results);
    });

    res.redirect('/main')
})

uploadRouter.get('/getNextQuestion', (req, res) => {
    let testQuestion = new Map()
    testQuestion.set('prompt', "what is 9 plus 10?")
    testQuestion.set('a', "20")
    testQuestion.set('b', "19")
    testQuestion.set('c', "21")
    testQuestion.set('answer', "c")
    testQuestion.set('answerType', "single")
    testQuestion.set('award', "20000")
    testQuestion.set('time', "40")

    res.status(200).json(JSON.stringify(Array.from(testQuestion)))
})

// get all default profile pictures from public/assets/pfps
let defaultPfps = []
fs.readdir(pfps_path, function(err, files){
    for(let i=0; i<files.length; i++){
        defaultPfps.push("/img/pfps/" + files[i])
    }
})

//get all end music options from public/assets/music
let endMusicFiles = []
fs.readdir(music_path, function(err, files){
    for(let i=0; i<files.length; i++){
        endMusicFiles.push(files[i])
    }
})

function getRandEndSongPath(req, res){
    res.status(200).json(endMusicFiles[Math.floor(Math.random() * endMusicFiles.length)])
}

function getRandPfp(){
    let randomPfpIdx = Math.floor(Math.random() * defaultPfps.length)
    PlayerAvatarPath = defaultPfps[randomPfpIdx]
    defaultPfps.splice(randomPfpIdx, 1)
    return PlayerAvatarPath
}
// //return path to random end song
// app.get('/endsong', (req, res) => { 
//     res.status(200).json(endMusicFiles[Math.floor(Math.random() * endMusicFiles.length)])
// })

// app.post("/question", (req, res) => {
//     console.log("---------")
//     const isExistingQuestions = fs.readFileSync(__dirname + '/questions.txt', 'utf8') != "";

//     const questionToAdd = isExistingQuestions ? ("\n" + JSON.stringify(req.body)) : JSON.stringify(req.body)
//     fs.appendFileSync(__dirname + '/questions.txt', questionToAdd, err => {
//           console.error(err || "written");
//       });
//     loadQuesions()
//     res.status(200).json((allQuestions.length - 1))
// })

let allQuestions = [{a: "test", b: "test", c: "test"}]
function isValidQuestion(questionIndex){
    return questionIndex >= 0 && questionIndex < allQuestions.length ? true : false
}

function getQuestion(questionIndex){
    return allQuestions[questionIndex]
}
function getRandQuestion(){
    return allQuestions[Math.floor(Math.random() * allQuestions.length)]
}

export default { isValidQuestion, getQuestion, getRandQuestion, getRandEndSongPath, uploadRouter, getRandPfp}
