const acceptableSingleAnswersMap = new Map([
    ["a", "a"],
    ["b", "b"],
    ["c", "c"],
    ["takeover", "takeover"],
])

const acceptableDoubleAnswersMap = new Map([
    ["ab", "ab"],
    ["ba", "ab"],
    ["bc", "bc"],
    ["cb", "bc"],
    ["ac", "ac"],
    ["ca", "ac"],
    ["takeover", "takeover"],
])

const acceptableOrderAnswersMap = new Map([
    ["abc", "abc"],
    ["acb", "acb"],
    ["bac", "bac"],
    ["bca", "bca"],
    ["cab", "cab"],
    ["cba", "cba"],
    ["takeover", "takeover"],
])

const acceptableKickAnswersMap = new Map([
    ["1", "1"],
    ["2", "2"],
    ["3", "3"],
    ["4", "4"],
    ["timeout", "timeout"],
])

const acceptableFinalAnswersMap = new Map([
    ["1", "1"],
    ["2", "2"],
    ["3", "3"],
])

function getAnswer(questionType, inputAnswer){
    try{
        switch(questionType){
            case "single":
                return acceptableSingleAnswersMap.get(inputAnswer)
            case "double": 
                return acceptableDoubleAnswersMap.get(inputAnswer)
            case "order":
                return acceptableOrderAnswersMap.get(inputAnswer)
            case "kick":
                return acceptableKickAnswersMap.get(inputAnswer)
            case "end":
                return acceptableFinalAnswersMap.get(inputAnswer)
        }
    }catch{
        return undefined
    }
    
}


function calcFinalAnswers(remainingAmount){
    return new Map([
        ['1', formatCash((remainingAmount * FIRST_PLACE_MODIFIER).toFixed(2))],
        ['2', formatCash((remainingAmount * SECOND_PLACE_MODIFIER).toFixed(2))],
        ['3', formatCash((remainingAmount * THIRD_PLACE_MODIFIER).toFixed(2))],
    ])
}

//converts float to string money value with $ and commas. rounds to 2 places
//
//money: float dollar value
//output: formatted money string
const formatCash = (money) =>{
    let buffer = "";
    let decimal = "." + parseInt((money*10)%10) + parseInt((money*100)%10);
    let places = money != 0 ? Math.floor(Math.log10(money)): 0;
    for (let i = 0; i < places; i++) {
        buffer = parseInt((money/Math.pow(10, i))) % 10 + buffer;
        if((i+1) % 3 == 0 && i != 0){
            buffer = "," + buffer;
        }
    } 
    if(places < 0){
        buffer = "$0" + decimal;
    }else{
        buffer = "$" + parseInt((money/Math.pow(10, places))) % 10 + buffer + decimal;
    }
    
    return buffer;
}


// const Startflash = (element, delay1, color1, color2) => {
//     let counter = 0;
//     return setInterval(function timerColor () {
//         element.style.color = counter % 2 == 0 ? color1 : color2;
//         counter++;
//     }, delay1);
// }

function adjustTextToFillCon(container, initialFontSize, isVertical){
    let basefontsize = initialFontSize
    container.style.fontSize = basefontsize + "px"
    //console.log(container.getAttribute("class") + "t size readjust:" + container.scrollWidth + " " + 
    //container.clientWidth + " " + 
    //    container.style.fontSize)
    while ((!isVertical && container.scrollWidth > container.clientWidth) || (isVertical && container.scrollHeight > container.clientHeight)) {
        // if(basefontsize == 20){return}/////////////////////
        //console.log(container.getAttribute("id") + "t size readjust:" + container.scrollWidth + " " + 
        //container.clientWidth + " " + 
        //container.style.fontSize)
        container.style.fontSize = (basefontsize--) + "px";
    }
    //console.log(container.getAttribute("id") + "t size readjust:" + container.scrollWidth + " " + 
    //    container.clientWidth + " " + 
    //   container.style.fontSize)
    return basefontsize
}

function getAcceptableAnswers(questionType){
    switch(questionType){
        case "single":
            return acceptableSingleAnswersMap
        case "double":
            return acceptableDoubleAnswersMap
        case "order":
            return acceptableOrderAnswersMap
        case "kick":
            return acceptableKickAnswersMap
        case "final":
            return acceptableFinalAnswersMap
    }
}

async function waitForContinue(){
    let res
    let data
    do{
        res = await fetch(BASEURL + "waiting")
        data = await res.json()
    }while(!data.continue == true)

    return
}