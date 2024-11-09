class bank{
    constructor(startingValue=0){
        this.container = document.getElementById("bank")
        this.value = startingValue

        this.amount = this.value
    }

    set amount(newAmt){
        this.container.innerHTML = formatCash(newAmt)
    }

}