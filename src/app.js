//import express from 'express'
import { fileURLToPath } from 'url'
import path from 'path'
import IO from "./file_IO.js"
import dis from "./discord_players.js"
import bodyParser from "body-parser"


// const IO = require("./file_IO")
//console.log(IO)
//const app = express()
//const port = 3000

const __fn = fileURLToPath(import.meta.url); // get the resolved path to the file
const __project_dirname = path.dirname(path.dirname(__fn)) // get the name of the directory

app.use(express.static(path.join(__project_dirname, 'public')));
app.use(bodyParser.json())
app.use(IO.ioRouter)
app.use(dis.discordRouter)

let isRoundActive = false
let longPollResponse
let finalData = {
    first: [ 'bobfilligen', 23427.449759999996 ],
    second: [ 'grungus', 11713.724879999998 ],
    third: [ 'Rob', 3904.57496 ],
    fourth: [ 'tylerdaboss123', 0 ]
}

    //undefined

app.get("/", (req, res) => {
    res.sendFile(__project_dirname + "\\public\\pages\\upload.html")
})

app.get("/main", (req, res) => {
    res.sendFile(__project_dirname + "\\public\\pages\\index.html")
})

app.get('/leaderBoard', (req, res) => {
    res.sendFile(__project_dirname + "\\public\\pages\\leaderBoard.html")
})

app.get('/setRoundActive/:newValue', (req, res) =>{
    isRoundActive = req.params.newValue === 'true' ? true : false
    res.sendStatus(200)
})

app.get('/continue', (req, res) =>{
    console.log(isRoundActive)
    if(!isRoundActive){
        //bad request, client is not ready
        if(longPollResponse == undefined){
            res.sendStatus(400)
            return
        }

        longPollResponse.status(200).json({continue: true, moreData: undefined})
        longPollResponse = undefined
    }
    res.sendStatus(200)
})

// app.get('/nextQuestion', (req, res) =>{
//     longPollResponse = res
// })

app.get('/waiting', (req, res) => {
    longPollResponse = res
})

app.post('/setFinalData', (req, res) => {
    finalData = req.body.standings
    console.log(finalData)
    res.sendStatus(200)
})

app.get('/leaderBoardData', (req, res) => {
    console.log(finalData)
    res.status(200).json(JSON.stringify(finalData))
})

app.listen(port, () => console.log('server has started on port: ' + port))



