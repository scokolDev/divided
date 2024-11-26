import express from 'express'
import { fileURLToPath } from 'url'
import path from 'path'
import fs from 'fs'//
import csv from 'csv-parser'
import multer from 'multer'

const __fn = fileURLToPath(import.meta.url); // get the path to the file
const __project_dirname = path.dirname(path.dirname(__fn)) // get the name of the directory

const pfps_path = __project_dirname + "\\public\\assets\\img\\pfps"
const music_path = __project_dirname + "\\public\\assets\\music"
const question_dir_path = __project_dirname + '\\public\\assets\\questions'
const upload = multer({dest: question_dir_path + '\\'}).single('questions')

let gameQuestions = []

const ioRouter = express.Router()

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

//fill the game questions with parsed data from first file in questions directory
function setGameQuestions(){
    gameQuestions = []
    let questions_path
    fs.readdir(question_dir_path, function(err, files){
        if(files.length < 1){return}
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
setGameQuestions()

//returns the path of a random image from the profile pictures directory
function getRandPfp(){
    let randomPfpIdx = Math.floor(Math.random() * defaultPfps.length)
    let PlayerAvatarPath = defaultPfps[randomPfpIdx]
    defaultPfps.splice(randomPfpIdx, 1)
    return PlayerAvatarPath
}


//--------------------------------------routes--------------------------------------

//upload a new questions file to server
ioRouter.post('/uploadQuestions', (req, res) => {
    fs.readdir(question_dir_path, function(err, files){
        //console.log(files[0])
        files.forEach((fileName) => {
            fs.rmSync(question_dir_path + '\\' + fileName)
        })
    })
    upload(req, res, () =>{
        //console.log(req.file)
        //questions_path = req.file.path
        setGameQuestions()
    })
    res.redirect('/main')
})

//respond with path to a random song from the music path
ioRouter.get('/endsong', (req, res) =>{
    res.status(200).json(endMusicFiles[Math.floor(Math.random() * endMusicFiles.length)])
})

//respond with the next question from the current game questions array
ioRouter.get('/getNextQuestion', (req, res) => {
    let curQuestion = gameQuestions.pop()
    res.status(200).json(curQuestion)
})

export default {ioRouter, getRandPfp}
