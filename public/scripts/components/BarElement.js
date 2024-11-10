
class timeBar {
    constructor(){
        
        //the bar which drains within the element
        this.bar = document.getElementById("bar")

        this.initHeight = this.bar.offsetHeight

        //element which connects bar element to numbox
        this.handle = document.getElementById("handle")

        //holds remaining cash value in round
        this.numBox = document.getElementById("num-box")
    }

    updateBar(percentLeft, remainingCash = undefined){
        this.numBox.innerHTML = remainingCash != undefined ? formatCash(remainingCash) : ""
        if(remainingCash != undefined){
            this.numBox.innerHTML = formatCash(remainingCash)
            this.numBox.style.fontSize = (50 - (parseInt(Math.log10(remainingCash), 10))*3) + "px"
        }else{
            this.numBox.innerHTML = ""
        }
        let modifier = percentLeft >= 0 ? percentLeft : 0
        let remainingHeight = this.initHeight * modifier;
        this.bar.style.height = remainingHeight + "px";
        this.bar.style.top = (this.initHeight-remainingHeight)-1 + "px";
        this.handle.style.top = (this.initHeight-remainingHeight)-10 + "px";
        this.numBox.style.top = this.initHeight-remainingHeight + "px";
    }

}



/////
// let tb = new timeBar()
// let left=1.00
// setInterval(() =>{
//     left = left-.01
//     tb.updateBar(left, 500)
// }, 100)