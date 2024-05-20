document.getElementById("submit").addEventListener('click', async function(){
    let inputQuestion = document.getElementById("question").value
    
    
    


    let inputCash = document.getElementById("cash").value
    if(inputCash < 0){
      alert("INVALID: Cash cannot be negative")
        return
    }

    let inputTime = document.getElementById("time").value
    if(inputTime < 0){
      alert("INVALID: Time cannot be negative")
        return
    }


    let inputType
    let inputAnswer = document.getElementById("answer").value
    let inputA = document.getElementById("optionA").value
    let inputB = document.getElementById("optionB").value
    let inputC = document.getElementById("optionC").value
  
    if(document.getElementById("double").checked){
      inputType = "double"
      if(inputAnswer.length != 2){
        alert("INVALID: double type selected, answer has " + inputAnswer.length + "characters (should have 2)")
        return
      }
    }
    else if(document.getElementById("order").checked){
      inputType = "order"
      if(inputAnswer.length != 3){
        alert("INVALID: order type selected, answer has " + inputAnswer.length + "characters (should have 3)")
        return
      }
    }else if(document.getElementById("single").checked){
      inputType = "single"
      if(inputAnswer.length != 1){
        alert("INVALID: single type selected, answer has " + inputAnswer.length + "characters (should have 1)")
        return
      }
    }else{
      alert("INVALID: answerType not selected")
      return
    }

    let questionObject = JSON.stringify({ 
        question: inputQuestion, 
        a: inputA,
        b: inputB,
        c: inputC,
        answerType: inputType,
        answer: inputAnswer,
        value: inputCash,
        newTime: inputTime,
    })
    console.log(questionObject)
    const res = await fetch('http://localhost:3000/question', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
          },
        body: JSON.stringify({ 
            question: inputQuestion, 
            a: inputA,
            b: inputB,
            c: inputC,
            answerType: inputType,
            answer: inputAnswer,
            value: inputCash,
            newTime: inputTime,
          })
      });

    const data = await res.json()
    alert("http://localhost:3000/selectQuestion/" + data.questionIndex)
})