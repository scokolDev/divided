const BASEURL = "http://localhost:3000/"


const MAX_PLAYERS = 4 //players per game
const LENGTH_OF_TIMEOUT = 10 //seconds per timeout
const TAKEOVERS_PER_GAME = 2 
const STARTING_BANK_AMOUNT = 0
const UPDATE_INTERVAL = 25 //how often screen is updated during an active round in ms (lower is faster)

const KICK_ROUND_LENGTH = 60
const FINAL_ROUND_LENGTH = 100

//prompt that is displayed in the question box during the kick and final round
const KICK_ROUND_PROMPT = "vote to kick a player!"
const FINAL_ROUND_PROMPT = "choose which value you deserve!"

//how much winnings each finalist gets from the ending bank total
const FIRST_PLACE_MODIFIER = .6 //e.g. first place gets 60% of final winnings
const SECOND_PLACE_MODIFIER = .3
const THIRD_PLACE_MODIFIER = .1

//-----STYLE-----

const DEFAULT_COLOR = "rgb(0, 255, 255)"
const DEFAULT_Q_SHADOW = "rgb(0, 0, 255)"

const CORRECT_COLOR = "rgb(0, 255, 0)"
const CORRECT_Q_SHADOW = "rgb(2,30,20)"

const WRONG_COLOR = "rgb(255, 0, 0)"
//const WRONG_Q_SHADOW = 

const TAKEOVER_COLOR = "rgb(255,165,0)"
const TAKEOVER_Q_SHADOW = "rgb(241, 90, 34)"


let currentRoundType = undefined
let consensusAnswer = undefined
let finalPlayerStanding = undefined
let currentQuestion = undefined
let numberOfTakeovers = 0
let timeoutQueue = []
let roundStartTime = undefined
let roundEndTime = undefined
let pauseEndTime = undefined
let bankAmount = STARTING_BANK_AMOUNT //TODO: depricate
let percentLeft

const playerManagerElement = new playerManager()
const timerElement = new timer() 
const timeBarElement = new timeBar()
const bankElement = new bank(STARTING_BANK_AMOUNT)
const winningsTableElement = new winningsTable()
const questionElement = new QuestionDisplay()
const boardBackground = document.getElementById("wrapper")
