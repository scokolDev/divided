class takeoverDisplay{
    constructor(){
        this.display = document.getElementById("takeoverDisplay")
        this.display.style.backgroundColor = TAKEOVER_COLOR
        this.display.innerHTML = `Takeovers: \n\n ${TAKEOVERS_PER_GAME}`
    }
    set remainingTakeovers(remaining){
        this.display.innerHTML = `Takeovers:\n${remaining}`
    }
}