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
const upload = multer({dest: question_dir_path + '\\'}).single('questions')

let gameQuestions = []

let questions_path
// try{
    // fs.readdir(question_dir_path, function(err, files){
    //     console.log(files[0])
    //     questions_path = question_dir_path + '\\' + files[0]
    // })
    // console.log(questions_path)

    // fs.createReadStream(questions_path)
    //     .pipe(csv())
    //     .on('data', (data) => gameQuestions.push(data));
    
    // gameQuestions = gameQuestions.reverse()
    // console.log(gameQuestions)
// }catch{
//     questions_path = undefined
// }

const uploadRouter = express.Router()

// function parseCSVQuestions(questionPath){
//     let isUploaded = false
//     while(!isUploaded){
//         fs.readdir(question_dir_path, function(err, files){
//                 if(files.size > 0){isUploaded = true}
//         })
//     }

//     fs.createReadStream(questions_path)
//         .pipe(csv())
//         .on('data', (data) => gameQuestions.push(data)).end(()=>{
//             console.log(gameQuestions)
//             gameQuestions = gameQuestions.reverse()
//             console.log(gameQuestions)
//         });
// }
function setGameQuestions(){
    gameQuestions = []
    let questions_path
    fs.readdir(question_dir_path, function(err, files){
        console.log(files[0])
        questions_path = question_dir_path + '\\' + files[0]

        fs.createReadStream(questions_path)
            .pipe(csv())
            .on('data', (data) => {
                gameQuestions.push(data)
            }).on('end', ()=>{
                gameQuestions = gameQuestions.reverse()
                console.log(gameQuestions)
            })
    })
}
uploadRouter.post('/uploadcsv', (req, res) => {
    fs.readdir(question_dir_path, function(err, files){
        console.log(files[0])
        files.forEach((fileName) => {
            fs.rmSync(question_dir_path + '\\' + fileName)
        })
        
    })

    upload(req, res, () =>{
        console.log(req.file)

        questions_path = req.file.path
        console.log(questions_path + "should come first")
        setGameQuestions()
    })
    

    //TODO: test and update code 
    

    //parseCSVQuestions(questions_path)
    // fs.createReadStream(questions_path)
    //     .pipe(csv())
    //     .on('data', (data) => gameQuestions.push(data)).end(()=>{
    //         console.log(gameQuestions)
    //         gameQuestions = gameQuestions.reverse()
    //         console.log(gameQuestions)
    //     });
    
    res.redirect('/main')
})

uploadRouter.get('/getNextQuestion', (req, res) => {
    // let testQuestion = new Map()
    // testQuestion.set('prompt', "what is 9 plus 10?")
    // testQuestion.set('a', "20")
    // testQuestion.set('b', "19")
    // testQuestion.set('c', "21")
    // testQuestion.set('answer', "cab")
    // testQuestion.set('answerType', "order")
    // testQuestion.set('award', "20000")
    // testQuestion.set('time', "40")
    let curQuestion = gameQuestions.pop()
    console.log(typeof(curQuestion))
    res.status(200).json(curQuestion)
    //res.status(200).json(JSON.stringify(Array.from(curQuestion)))
})

// get all default profile pictures from public/assets/pfps
let defaultPfps = []
fs.readdir(pfps_path, function(err, files){
    for(let i=0; i<files.length; i++){
        defaultPfps.push("/assets/img/pfps/" + files[i])
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
    let PlayerAvatarPath = defaultPfps[randomPfpIdx]
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
