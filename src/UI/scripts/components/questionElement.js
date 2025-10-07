
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
    setAnswerColor(answerElement, borderColor, shadowColor){
        answerElement.style.border = "3px solid " + borderColor
        answerElement.style.boxShadow = shadowColor + " 0 0 10px 1px"
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
    }

    setQuestionDisplay(isDisplay){
        if(isDisplay){
            this.wrapper.style.animation = "moveUp 1s";
            this.wrapper.style.top = "400px";
        }else{
            this.resetQuestionCSS()
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

    
    setColor(borderColor, shadowColor, isJustPrompt){
        switch(isJustPrompt){
            case false:
                this.setAnswerColor(this.aBox, borderColor, shadowColor)
                this.setAnswerColor(this.bBox, borderColor, shadowColor)
                this.setAnswerColor(this.cBox, borderColor, shadowColor)
            case true:
                this.promptBox.style.border = "3px solid " + borderColor
                this.promptBox.style.boxShadow = shadowColor + " 0 0 10px 1px"
        }
    }
    resetQuestionCSS(){
        this.setColor(DEFAULT_COLOR, DEFAULT_Q_SHADOW, false)

        this.wrapper.style.animation = "";
        this.wrapper.style.top = "1200px";

        this.aBox.style.left = "200px"
        this.bBox.style.left = "200px"
        this.cBox.style.left = "200px"
        this.dBox.style.left = "200px"

        this.aBox.style.top = "120px"
        this.bBox.style.top = "210px"
        this.cBox.style.top = "300px"
        this.dBox.style.top = "390px"

        this.aBox.style.visibility = "hidden"
        this.bBox.style.visibility = "hidden" 
        this.cBox.style.visibility = "hidden" 
        this.dBox.style.visibility = "hidden" 

        this.aBox.style.animation = ""
        this.bBox.style.animation = ""
        this.cBox.style.animation = ""
        this.dBox.style.animation = ""
    }
    revealSingleAnswer(answerLetter){
        let answerElement = this.aBox
        switch(answerLetter){
            case 'a':
            case '1':
                answerElement = this.aBox
                break
            case 'b':
            case '2':
                answerElement = this.bBox
                break
            case 'c':
            case '3':
                answerElement = this.cBox
                break
            case 'd':
            case '4':
                answerElement = this.dBox
                break
        }
        answerElement.style.animation = "correctAnswers .5s";
        answerElement.style.left = "100px";
        this.setAnswerColor(answerElement, CORRECT_COLOR, CORRECT_Q_SHADOW)
    }
    revealOrderAnswers(answerOrderString){
        let answerOrder = Array.from(answerOrderString)

        if(answerOrder[0] == "b"){
            this.bBox.style.animation = "BtoA 1.5s";
            this.bBox.style.top = "120px";
        }else if(answerOrder[0] == "c"){
            this.cBox.style.animation = "CtoA 1.5s";
            this.cBox.style.top = "120px";
        }
    
        if(answerOrder[1] == "a"){
            this.aBox.style.animation = "AtoB 1.5s";
            this.aBox.style.top = "210px";
        }else if(answerOrder[1] == "c"){
            this.cBox.style.animation = "CtoB 1.5s";
            this.cBox.style.top = "210px";
        }
    
        if(answerOrder[2] == "a"){
            this.aBox.style.animation = "AtoC 1.5s";
            this.aBox.style.top = "300px";
        }else if(answerOrder[2] == "b"){
            this.bBox.style.animation = "BtoC 1.5s";
            this.bBox.style.top = "300px";
        }
        this.setAnswerColor(this.aBox, CORRECT_COLOR, CORRECT_Q_SHADOW)
        this.setAnswerColor(this.bBox, CORRECT_COLOR, CORRECT_Q_SHADOW)
        this.setAnswerColor(this.cBox, CORRECT_COLOR, CORRECT_Q_SHADOW)

    }
    revealCorrectAnswers(correctAnswer){
        console.log(correctAnswer)
        console.log(correctAnswer.length)
        switch(correctAnswer.length){
            case 1:
                this.revealSingleAnswer(correctAnswer)
                break
            case 2:
                this.revealSingleAnswer(correctAnswer[0])
                this.revealSingleAnswer(correctAnswer[1])
                break
            case 3:
                this.revealOrderAnswers(correctAnswer)
                break
        }
    }

}
