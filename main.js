const countSpan = document.querySelector(".quiz-info .count span");
const bullets = document.querySelector(".bullets");
const bulletsSpanContainer = document.querySelector(".bullets .spans");
const quizArea = document.querySelector(".quiz-area");
const answersArea = document.querySelector(".answers-area");
const submitButton = document.querySelector(".submit-button");
const resultContainer = document.querySelector(".results");
const countDownElement = document.querySelector(".countdown");
let currentIndex = 0;
let rightAnswers = 0;
let countDownInterval;
function getQuestions() {
  fetch("html_questions.json")
    .then((result) => {
      let data = result.json();
      return data;
    })
    .then((data) => {
      createBullets(data.length);
      addQuestionData(data[currentIndex], data.length);
      countDown(5, data.length);
      submitButton.onclick = function () {
        let rihgtAnswer = data[currentIndex].right_answer;
        currentIndex++;
        checkAnswer(rihgtAnswer, data.length);
        quizArea.innerHTML = "";
        answersArea.innerHTML = "";
        addQuestionData(data[currentIndex], data.length);
        handleBullets();
        clearInterval(countDownInterval);
        countDown(5, data.length);
        showResults(data.length);
      };
    });
}
getQuestions();

function createBullets(num) {
  countSpan.innerHTML = num;
  for (let i = 0; i < num; i++) {
    const bullet = document.createElement("span");
    if (i === 0) {
      bullet.classList.add("on");
    }
    bulletsSpanContainer.appendChild(bullet);
  }
}
function addQuestionData(obj, count) {
  if (currentIndex < count) {
    const heading = document.createElement("h2");
    heading.textContent = obj.title;
    quizArea.appendChild(heading);
    for (let i = 1; i <= 4; i++) {
      const mainDiv = document.createElement("div");
      mainDiv.classList.add("answer");
      const radioInput = document.createElement("input");
      radioInput.name = "question";
      radioInput.type = "radio";
      radioInput.id = `answer_${i}`;
      radioInput.dataset.answer = obj[`answer_${i}`];
      if (i === 1) {
        radioInput.checked = true;
      }
      const label = document.createElement("label");
      label.setAttribute("for", `answer_${i}`);
      label.textContent = radioInput.dataset.answer;
      mainDiv.append(radioInput, label);
      answersArea.appendChild(mainDiv);
    }
  }
}

function checkAnswer(rAnswer, count) {
  const answers = document.getElementsByName("question");
  let choosenAnswer;
  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      choosenAnswer = answers[i].dataset.answer;
    }
  }
  if (rAnswer === choosenAnswer) {
    rightAnswers++;
  }
}

function handleBullets() {
  const bulletsSpans = document.querySelectorAll(".bullets .spans span");
  let arrayOfSpans = [...bulletsSpans];
  arrayOfSpans.forEach((span, index) => {
    if (currentIndex === index) {
      span.classList.add("on");
    }
  });
}

function showResults(count) {
  let results;
  if (currentIndex === count) {
    quizArea.remove();
    answersArea.remove();
    submitButton.remove();
    bullets.remove();
    if (rightAnswers > count / 2 && rightAnswers < count) {
      results = `<span class='good'>Good</span>, ${rightAnswers} From ${count}`;
    } else if (rightAnswers === count) {
      results = `<span class='perfect'>Perfect</span>, All Answers is True`;
    } else {
      results = `<span class='bad'>Bad</span>, ${rightAnswers} From ${count}`;
    }
    resultContainer.innerHTML = results;
    resultContainer.style.padding = "10px";
    resultContainer.style.backgroundColor = "#fff";
    resultContainer.style.marginTop = "10px";
  }
}

function countDown(duration, count) {
  if (currentIndex < count) {
    let minutes, seconds;
    countDownInterval = setInterval(() => {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);
      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;
      countDownElement.innerHTML = `${minutes}:${seconds}`;
      if (--duration < 0) {
        clearInterval(countDownInterval);
        submitButton.click();
      }
    }, 1000);
  }
}
