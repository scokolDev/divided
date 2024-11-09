const BASEURL = "http://localhost:3000/"
const MAX_PLAYERS = 4 //players per game
const LENGTH_OF_TIMEOUT = 10 //seconds per timeout
const TAKEOVERS_PER_GAME = 2 
const STARTING_BANK_AMOUNT = 0

const KICK_ROUND_PROMPT = "vote to kick a player!"
const FINAL_ROUND_PROMPT = "choose which value you deserve!"


let currentRoundType = undefined
let consensusAnswer = undefined
let currentQuestion = undefined
let numberOfTakeovers = 0
let roundStartTime = undefined
let roundEndTime = undefined
let bankAmount = STARTING_BANK_AMOUNT //TODO: depricate
let potentialWinnings

const playerManagerElement = new playerManager()  //Watch out for possible error const
const timerElement = new timer() 
const TimeBarElement = new timeBar()  //Watch out for possible error const
const bankElement = new bank(STARTING_BANK_AMOUNT)  //Watch out for possible error const
const questionElement = new QuestionDisplay()  //Watch out for possible error const
