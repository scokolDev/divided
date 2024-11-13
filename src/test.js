import csv from "csv-parser"
import fs from 'fs'


let results = []

let path = "C:\\Users\\prepa\\OneDrive\\Documents\\code\\divided\\public\\assets\\questions"

// fs.createReadStream(path)
//         .pipe(csv())
//         .on('data', (data) => results.push(data))
//         .on('end', () => {
//             console.log(results);
// });
let gameQuestions = []

function setGameQuestions(){
    let questions_path
    fs.readdir(path, function(err, files){
        console.log(files[0])
        questions_path = path + '\\' + files[0]

        fs.createReadStream(questions_path)
            .pipe(csv())
            .on('data', (data) => {
                gameQuestions.push(data)
            }).on('end', ()=>{
                console.log(gameQuestions)
                gameQuestions = gameQuestions.reverse()
                console.log(gameQuestions)
            })
    })
}

getFirstFilePath()

console.log(gameQuestions)