const acceptableSingleAnswersMap = new Map([
    ["a", true],
    ["b", true],
    ["c", true],
    ["takeover", true],
])

const acceptableDoubleAnswersMap = new Map([
    ["ab", true],
    ["ac", true],
    ["bc", true],
    ["takeover", true],
])

const acceptableOrderAnswersMap = new Map([
    ["abc", true],
    ["acb", true],
    ["bac", true],
    ["bca", true],
    ["cab", true],
    ["cba", true],
    ["takeover", true],
])

const acceptableKickAnswersMap = new Map([
    ["1", true],
    ["2", true],
    ["3", true],
    ["4", true],
    ["timeout", true],
])

const acceptableFinalAnswersMap = new Map([
    ["1", true],
    ["2", true],
    ["3", true],
])

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