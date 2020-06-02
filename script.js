let questions = [];

let myperviousbtn = document.getElementById("btn-1");
let mynextbtn = document.getElementById("btn-2");
let mysubmitbtn = document.getElementById("btn-3");

let results = [];

window.onload = () => {
    localStorage.questionIndex = 0;
    getQuestions_mock();
}

const getQuestions_mock = () => {

    fetch("https://api.covid19api.com/countries", {
        method: "GET"
    })
    .then(response => response.json())
    .then(resultJSON => {
        resultJSON = [{
            question: "What is 2*5?",
            choices: [2, 5, 10, 15, 20, 14],
            correctAnswer: 2
          }, {
            question: "What is 3*6?",
            choices: [3, 6, 9, 12, 18, 36],
            correctAnswer: 4
          }, {
            question: "What is 8*9?",
            choices: [72, 99, 108, 134, 156, 200],
            correctAnswer: 0
          }, {
            question: "What is 1*7?",
            choices: [4, 5, 6, 7, 8, 66],
            correctAnswer: 3
          }, {
            question: "What is 8*8?",
            choices: [20, 30, 40, 50, 64, 88],
            correctAnswer: 4
          }];

          questions = resultJSON;

          renderQuestion();
    })
    .catch(error => {
    })
    .finally(() => {
    })
}

const renderQuestion = () => {
    let questionToRender = questions[localStorage.questionIndex];
    
    //getting previous value (as this function will run when user presses the back button)
    let previousResult = null;
    if(results[localStorage.questionIndex]){
      previousResult = results[localStorage.questionIndex];
    }

    let questionNode = document.querySelector('.question');
    let optionsNode = document.querySelector('.options');

    // Now Rendering Question...

    questionNode.innerHTML = (Number(localStorage.questionIndex) + 1) + ") " + questionToRender.question;

    optionsNode.innerHTML = "";

    questionToRender.choices.forEach((choice, i) => {

        let liNode = document.createElement("li");

        let input = document.createElement("input");
        input.setAttribute('type', 'radio');
        input.setAttribute('name', 'option');
        input.setAttribute('index', i);
        
        if(previousResult && previousResult.answerGiven === i){
          input.checked = true;
        }

        let choiceNode = document.createElement("span");
        choiceNode.innerHTML = choice;

        liNode.appendChild(input);
        liNode.appendChild(choiceNode);

        optionsNode.appendChild(liNode);
    });
}

const goToPrevious = event => {
  if (localStorage.questionIndex >= 1){
    localStorage.questionIndex = Number(localStorage.questionIndex) - 1;
    renderQuestion();
  }
  
  if (localStorage.questionIndex === "0") { 
    myperviousbtn.setAttribute("id", "btn-1");
  }
 
  if (Number(localStorage.questionIndex) < questions.length - 1) {
    mysubmitbtn.style.display = "none";
    mynextbtn.style.display = "block";
  }
}

const goToNext = event => {

  let inputRadios = document.querySelectorAll("ul.options input[type=radio]");
  let errorDiv = document.getElementById("error");
  let answered = false;
  for(let i = 0 ; i < inputRadios.length ; i++){
    if(inputRadios[i].checked === true){ 
      answered = true;

      let currentQuestion = questions[localStorage.questionIndex];
      
      if(!results[localStorage.questionIndex]){
        if(i === currentQuestion.correctAnswer){
          results.push({
            answerGiven: i,
            isCorrect: true
          });
        }
        else{
          results.push({
            answerGiven: i,
            isCorrect: false
          });
        }
      }

      localStorage.questionIndex = Number(localStorage.questionIndex) + 1;
      
      if (Number(localStorage.questionIndex) < questions.length){
      renderQuestion();
      }

      errorDiv.innerHTML = "";
    }
  }

  
  if(answered === false){
    errorDiv.innerHTML = "Please Select An Answer";
    errorDiv.style.margin = "6px 0px";
  }

  if(localStorage.questionIndex >= 1){
    myperviousbtn.removeAttribute("id");
  }

  if(Number(localStorage.questionIndex) === questions.length - 1){
    mysubmitbtn.style.display = "block";
    mynextbtn.style.display = "none";
  }

}

const submit = event => {
  goToNext(event);
  document.querySelector('.question').style.display = "none";
  document.querySelector('.button-container').style.display = "none";
  document.querySelector('.options').style.display = "none";
  document.querySelector('.results').style.display = "";

  let total = results.length;
  document.getElementById("result-total").innerHTML = results.length;
  
  let x = 0;
  for(i = 0; i < results.length; i++){ debugger;
    let myAnswers = results[i].isCorrect;
    if(myAnswers === true){
      x++;
    }
    document.getElementById("result-correct").innerHTML = x;
  }
  
  let percentage = x*100/results.length;
  document.getElementById("success-rate").innerHTML = `${percentage}%`;

}

const tryagain = () =>{
  // localStorage.questionIndex = 0;
  // let questions = [];
  // let results = [];
  // localStorage.taymoor = 0;
  // getQuestions_mock();
  location.reload();
}