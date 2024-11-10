class timer{
    constructor(){
        this.container = document.getElementById("timer")

        this.holdAlert = document.getElementById("holdAlert")
    }

    set time(newTime){
        this.container.innerHTML = Math.ceil(newTime)
    }

    displayHoldAlert(playerName){
        this.holdAlert.innerHTML = "⏰" + playerName + "⏰"
        this.holdAlert.style.visibility = "visible"
    }
    removeHoldAlert(){
        this.holdAlert.innerHTML = ""
        this.holdAlert.style.visibility = "hidden"
    }

    flash(isFlash){
        if(isFlash){
            this.container.style.animation = "flicker .3s infinite"
        }else{
            this.container.style.animation = ""
        }
    }
}