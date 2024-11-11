class bank{
    constructor(startingValue=0){
        this.container = document.getElementById("bank")
        this.value = startingValue

        this.intAmount = this.value
        this.amount = this.intAmount
    }

    set amount(newAmt){
        this.intAmount = newAmt
        this.container.innerHTML = formatCash(newAmt)
    }

}