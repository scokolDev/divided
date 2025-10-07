class bank{
    constructor(startingValue=0){
        this.container = document.getElementById("bank")
        this.container.innerHTML = formatCash(startingValue)
        //this.value = startingValue

        this.intAmount = startingValue
    }

    setAmount(newAmt){
        this.intAmount = newAmt
        this.container.innerHTML = formatCash(newAmt)
    }

}