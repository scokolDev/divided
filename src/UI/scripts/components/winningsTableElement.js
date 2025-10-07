class winningsTable{
    constructor(){
        this.container = document.getElementById("table")

        this.dynamicStyle = document.getElementById("dynamicStyle")

        this.winContainer = document.getElementById("win")
        this.intWin = 0

        this.totalContainer = document.getElementById("total")
        this.intTotal = 0

        this.loseContainer = document.getElementById("lose")
        this.intLose = 0
    }

    setValues(total, win=undefined, lose=undefined){
        this.totalContainer.innerHTML = formatCash(total)
        this.intTotal = total

        if(win != undefined){
            this.winContainer.innerHTML = formatCash(win)
            this.loseContainer.innerHTML = formatCash(lose)
            this.intWin = win
            this.intLose = lose
        }else{
            this.loseContainer.style.visibility = "hidden"
            this.winContainer.style.visibility = "hidden"
        }
        
    }

    revealResult(resultType){
        let oldFont
        let newFont
        switch(resultType){
            case "win":
                this.totalContainer.style.visibility = "hidden"
                this.loseContainer.style.visibility = "hidden"
                this.winContainer.style.height = "90px" 
                this.winContainer.style.lineHeight = "80px" 
                this.winContainer.style.top = "91px"
                this.winContainer.style.left = "18px"
                this.winContainer.style.width =  "465px" 
                oldFont = this.winContainer.style.fontSize
                newFont = adjustTextToFillCon(this.winContainer, 70, false)
                this.winContainer.style.fontSize = oldFont
                var keyFrames = '\
                    @keyframes moveWin {\
                        0% {\
                            top:  22px;\
                            height: 55px;\
                            line-height: 45px;\
                            width: 306px;\
                            font-size: ' + oldFont + ';\
                            left: 102px;\
                        }\
                        100% {\
                            top: 91px;\
                            height: 90px;\
                            line-height: 80px;\
                            width: 465px;\
                            font-size: ' + newFont + 'px;\
                            left: 18px;\
                        }\
                    }\
                '
                //console.log("keyFrames: " + keyFrames)
                this.dynamicStyle.innerHTML = keyFrames
                
                this.winContainer.style.animation = "moveWin 1s";
                this.winContainer.style.fontSize = newFont + "px"
                break
            case "lose":
                this.totalContainer.style.visibility = "hidden"
                this.winContainer.style.visibility = "hidden"
                this.loseContainer.style.height = "90px" 
                this.loseContainer.style.lineHeight = "80px"
                this.loseContainer.style.width =  "465px" 
                this.loseContainer.style.top = "91px"
                this.loseContainer.style.left = "18px"
                
                oldFont = lose.style.fontSize
                newFont = adjustTextToFillCon(this.loseContainer, 70, false)
                this.loseContainer.style.fontSize = oldFont

                var keyFrames = '\
                    @keyframes moveLose {\
                        0% {\
                            top:  192px;\
                            height: 55px;\
                            line-height: 45px;\
                            width: 306px;\
                            font-size: ' + oldFont + ';\
                            left: 102px;\
                        }\
                        100% {\
                            top: 91px;\
                            height: 90px;\
                            line-height: 80px;\
                            width: 465px;\
                            font-size: ' + newFont + 'px;\
                            left: 18px;\
                        }\
                    }\
                '
                //console.log("keyFrames: " + keyFrames)
                this.dynamicStyle.innerHTML = keyFrames
                
                this.loseContainer.style.animation = "moveLose 1s";
                this.loseContainer.style.fontSize = newFont + "px"
                break
            case "total":
                return
        }
    }
    // setTableData(total, winning = undefined, losing = undefined){
    //     if(winning == undefined){
    //         this.winContainer.style.visibility = "hidden"
    //         this.loseContainer.style.visibility = "hidden"
    //         this.totalContainer.innerHTML = formatCash(total)
    //     }else{
    //         this.totalContainer.innerHTML = formatCash(total)
    //         this.winContainer.innerHTML = formatCash(winning)
    //         this.loseContainer.innerHTML = formatCash(losing)
    //     }
    // }
    set display(isDisplay){
        if(isDisplay){
            this.container.style.animation = "moveleft 1s";
            this.container.style.left = "175px";
            this.container.style.opacity = "1";
        }else{
            this.container.style.animation = "" //WARN: check to see if works
            this.container.style.left = "-200px"
            this.container.style.opacity = "0"
        }
    }

    resetTable(){
        this.winContainer.style.animation = "";
        this.winContainer.style.height = "55px" 
        this.winContainer.style.lineHeight = "45px"
        this.winContainer.style.width =  "306px" 
        this.winContainer.style.top = "22px"
        this.winContainer.style.left = "102px"
        this.winContainer.style.fontSize = "40px"

        this.loseContainer.style.animation = "";
        this.loseContainer.style.height = "55px" 
        this.loseContainer.style.lineHeight = "45px"
        this.loseContainer.style.width =  "306px" 
        this.loseContainer.style.top = "192px"
        this.loseContainer.style.left = "102px"
        this.loseContainer.style.fontSize = "40px"

        this.container.style.visibility = "visible"
        this.totalContainer.style.visibility = "visible"
        this.loseContainer.style.visibility = "visible"
        this.winContainer.style.visibility = "visible"
    }
}