
class QuestionDisplay {
    constructor(){
        //entire question element
        this.wrapper = document.getElementById("quesionBox");

        //element which hold question prompt
        this.promptBox = document.getElementById("prompt");
        this.promptText = document.getElementById("QuestionConText");

        //question answers
        this.aBox = document.getElementById("aBox");
        this.bBox = document.getElementById("bBox");
        this.cBox = document.getElementById("cBox");
        this.dBox = document.getElementById("dBox");

        //text within answer box
        this.aAnswerText = document.getElementById("aAnswer");
        this.bAnswerText = document.getElementById("bAnswer");
        this.cAnswerText = document.getElementById("cAnswer");
        this.dAnswerText = document.getElementById("dAnswer");

        //used to change answer choices from abcd to 1234
        this.ALetter = document.getElementById("A");
        this.BLetter = document.getElementById("B");
        this.CLetter = document.getElementById("C");
        this.DLetter = document.getElementById("D");

        this.answerLetterToElement = new Map([
            ['a',  [this.ALetter, this.aAnswerText]],
            ['1',  [this.ALetter, this.aAnswerText]],
            ['b',  [this.BLetter, this.bAnswerText]],
            ['2',  [this.BLetter, this.bAnswerText]],
            ['c',  [this.CLetter, this.cAnswerText]],
            ['3',  [this.CLetter, this.cAnswerText]],
            ['d',  [this.DLetter, this.dAnswerText]],
            ['4',  [this.DLetter, this.dAnswerText]],
        ])
    }

    setAnswerLetters(type){
        let answerLetters
        switch(type){
            case "number":
                answerLetters = ['1', '2', '3', '4']
            case "letter":
                answerLetters = ['a', 'b', 'c', 'd']
        }
        this.ALetter.innerHTML = answerLetters[0]
        this.BLetter.innerHTML = answerLetters[1]
        this.CLetter.innerHTML = answerLetters[2]
        this.DLetter.innerHTML = answerLetters[3]
    }

    setQuestionData(prompt, answersMap){
        this.promptText.innerHTML = prompt;
        adjustTextToFillCon(this.promptText, 40, true)

        this.setAnswers(answersMap)
    }

    setAnswers(answersMap){
        answersMap.forEach((answerText, answerLetter) => {
            let answerElements = this.answerLetterToElement.get(answerLetter)
            answerElements[1].innerHTML = answerText;
            adjustTextToFillCon(answerElements[1], 40, false)

            answerElements[0].innerHTML = answerLetter
            
        });
        // this.aAnswerText.innerHTML = aAnswer;
        // adjustTextToFillCon(this.aAnswerText, 40, false)

        // this.bAnswerText.innerHTML = bAnswer;
        // adjustTextToFillCon(this.bAnswerText, 40, false)

        // this.cAnswerText.innerHTML = cAnswer;
        // adjustTextToFillCon(this.cAnswerText, 40, false)

        // if(dAnswer){
        //     this.dAnswerText.innerHTML = dAnswer;
        //     adjustTextToFillCon(this.dAnswerText, 40, false)
        // }
    }

    setQuestionDisplay(isDisplay){
        if(isDisplay){
            this.wrapper.style.animation = "moveUp 1s";
            this.wrapper.style.top = "400px";
        }else{
            this.wrapper.style.animation = "";
            this.wrapper.style.top = "1080px";
            this.aBox.style.visibility = "hidden"
            this.bBox.style.visibility = "hidden" 
            this.cBox.style.visibility = "hidden" 
            this.dBox.style.visibility = "hidden"   
        }
    }


    displayAnswer(answerLetter){
        switch(answerLetter){
            case 'a': 
                this.aBox.style.visibility = "visible"
                break
            case 'b': 
                this.bBox.style.visibility = "visible"                
                break
            case 'c': 
                this.cBox.style.visibility = "visible"                
                break
            case 'd': 
                this.dBox.style.visibility = "visible"                
                break
        }
    }

    makeColor(color){
        let borderColor //TODO: add default colors
        let shadowColor //
        switch(color){
            case "orange":
                borderColor = "rgb(255, 255, 0)"
                shadowColor = "rgb(241, 90, 34)"

        }
        this.promptBox.style.border = "3px solid " + borderColor;
        this.aBox.style.border = "3px solid " + borderColor;
        this.bBox.style.border = "3px solid " + borderColor;
        this.cBox.style.border = "3px solid " + borderColor;
        this.promptBox.style.boxShadow = shadowColor + " 0 0 10px 1px";
        this.aBox.style.boxShadow = shadowColor + " 0 0 10px 1px";
        this.bBox.style.boxShadow = shadowColor + " 0 0 10px 1px";
        this.cBox.style.boxShadow = shadowColor + " 0 0 10px 1px";
    }

}

// let questionElement = new QuestionDisplay()
// questionElement.setQuestionData("test prompt", "answer1", "answer2", "answer3")
// questionElement.setQuestionDisplay(true)

// setTimeout(() =>{
//     questionElement.displayAnswer('a')
// }, 2000)

// setTimeout(() =>{
//     questionElement.displayAnswer('b')
// }, 4000)

// setTimeout(() =>{
//     questionElement.displayAnswer('c')
// }, 6000)

// setTimeout(() =>{
//     questionElement.displayAnswer('d')
// }, 8000)
