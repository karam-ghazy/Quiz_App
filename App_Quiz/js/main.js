//select span count questions
let countQuestions = document.querySelector(".count");
//select  bullets
let bullets = document.querySelector(".bullets");
//select spans bullets container
let bulletContainer = document.querySelector(".bullets .spans-container");
//select quiz-area
let quizArea = document.querySelector(".quiz-area");
//select answers-area
let answersArea = document.querySelector(".answers-area");
//select hidden div
let hiddenDiv = document.querySelector(".hidden");
//select submit button
let submitButton = document.querySelector(".submit-button");
//select result container
let result = document.querySelector(".result");
//select count-down
let count_Down = document.querySelector(".count-down");
//
let resetButton = document.querySelector(".reset-button");
//
let h4 = document.querySelector("h4");
//set options
let currentIndex = 0;
let rightAnswers = 0;
let countDownInterval;

//trigger the function
getCategoryName();

function getCategoryName() {
  //name category
  let name;
  //select the category of questions
  let categorys = document.querySelectorAll(".category ul li");
  categorys.forEach((category) => {
    category.addEventListener("click", () => {
      for (let i = 0; i < categorys.length; i++)
        categorys[i].classList.remove("chosen");
      category.classList.add("chosen");
      //set hidden to visible
      hiddenDiv.classList.add("visible");
      resetButton.style.display = "none";
      h4.style.display = "none";
      //initial state of current index on change category
      currentIndex = 0;
      rightAnswers = 0;
      result.innerHTML = "";
      ///
      resetButton.onclick = function () {
        currentIndex = 0;
        rightAnswers = 0;
        quizArea.style.display = "block";
        answersArea.style.display = "block";
        submitButton.style.display = "block";
        resetButton.style.display = "none";
        bullets.style.display = "flex";
        result.innerHTML = "";
        getQuestions(name);
      };
      // the name of the chosen category
      name = category.innerHTML.toLocaleLowerCase();
      getQuestions(name);
    });
  });
}

function getQuestions(categoryName) {
  let myResquest = new XMLHttpRequest();
  myResquest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let questionsObject = JSON.parse(this.responseText);

      let numQuestions = 0;

      if (categoryName == "js") numQuestions = 10;
      else if (categoryName == "css") numQuestions = 15;
      else numQuestions = 20;
      let randomQuestions;
      randomQuestions = shufle(questionsObject);
      //add number of questions to page
      countQuestions.innerHTML = `Question number: <span> ${
        currentIndex + 1
      } </span>
          from <span>${numQuestions}</span> `;

      createBullets(numQuestions);

      addQuestionsData(randomQuestions[currentIndex], numQuestions);

      // count down timer
      countDown(30, numQuestions);
      //check the answer
      submitButton.onclick = () => {
        //set the correct answer
        let rightAnswers = randomQuestions[currentIndex].correctAnswer;
        //increase currentindex by 1
        currentIndex++;
        //add number of next question
        if (currentIndex < numQuestions) {
          countQuestions.innerHTML = `Question number: <span> ${
            currentIndex + 1
          } </span>
          from <span>${numQuestions}</span> `;
        }
        //check between the chosen answer and the correct answer
        checkAnswer(rightAnswers, numQuestions);
        //add next question
        addQuestionsData(randomQuestions[currentIndex], numQuestions);
        //handle bullets span
        handleBullets();
        //count down timer
        countDown(30, numQuestions);
        if (currentIndex === numQuestions) {
          showResult(numQuestions);
        }
      };
    }
  };
  myResquest.open("GET", `./Questions/${categoryName}_questions.json`, true);
  myResquest.send();
}

function countDown(duration, count) {
  //to initial timer when  chane category
  clearInterval(countDownInterval);

  if (currentIndex < count) {
    countDownInterval = setInterval(function () {
      let min = parseInt(duration / 60);
      let sec = parseInt(duration % 60);

      min = min < 10 ? `0${min}` : min;
      sec = sec < 10 ? `0${sec}` : sec;
      count_Down.innerHTML = `${min}:${sec}`;

      if (--duration < 0) {
        clearInterval(countDownInterval);
        submitButton.click();
      }
    }, 1000);
  }
}

function showResult(count) {
  quizArea.style.display = "none";
  answersArea.style.display = "none";
  submitButton.style.display = "none";
  resetButton.style.display = "block";
  bullets.style.display = "none";
  countQuestions.innerHTML = "";

  let messageResult;
  if (rightAnswers > count / 2 && rightAnswers < count)
    messageResult = `<span class="good"> Good </span>, You Answered ${rightAnswers} from ${count}  `;
  else if (rightAnswers == count)
    messageResult = `<span class="perfect"> Perfect </span>, All Is right `;
  else
    messageResult = `<span class="bad"> Bad </span>, You Answered ${rightAnswers} from ${count}  `;
  result.innerHTML = messageResult;
}

//craete bullets functions
function createBullets(num) {
  //create span bullets
  bulletContainer.innerHTML = "";
  for (let i = 1; i <= num; i++) {
    let spanbullet = document.createElement("span");
    spanbullet.id = `${i}`;
    if (i == 1) spanbullet.classList.add("on");
    //append bullet to container
    bulletContainer.appendChild(spanbullet);
  }
}

function handleBullets() {
  let bullets = document.querySelectorAll(".spans-container span");
  let spanArray = Array.from(bullets);
  spanArray.forEach((bullet, index) => {
    if (currentIndex == index) {
      bullet.classList.add("on");
    }
  });
}

function addQuestionsData(obj, count) {
  if (currentIndex < count) {
    //initial quiz-area state
    quizArea.innerHTML = "";
    //initial answer-area state
    answersArea.innerHTML = "";
    //create h2 question title
    let h2 = document.createElement("h2");
    //craete h2 text
    let h2Text = document.createTextNode(obj["title"]);
    //append h2 text to h2
    h2.appendChild(h2Text);
    //apend h2 to quiz-area
    quizArea.appendChild(h2);

    let answers = [];
    //add answers from obj to answers array
    for (let i = 1; i <= 4; i++) {
      answers.push(obj[`answer_${i}`]);
    }
    //random answers
    answers = shufle(answers);
    //create answers
    for (let i = 1; i <= 4; i++) {
      //create main div
      let mainDiv = document.createElement("div");
      //add class to main div
      mainDiv.classList.add("answer");
      //create radioInput chosen
      let radioInput = document.createElement("input");
      //add type + id + name + data-attribute
      radioInput.type = "radio";
      radioInput.name = "quetion";
      radioInput.id = `answer-${i}`;
      radioInput.dataset.answer = `${answers[i - 1]}`;
      if (i === 1) radioInput.checked = true;
      //create label for input
      let label = document.createElement("label");
      label.htmlFor = `answer-${i}`;
      //craete text label
      let labelText = document.createTextNode(`${answers[i - 1]}`);
      //append text to label
      label.appendChild(labelText);

      //append input + label to main div
      mainDiv.appendChild(radioInput);
      mainDiv.appendChild(label);

      //append main div to answers-area
      answersArea.appendChild(mainDiv);
    }
  }
}

function checkAnswer(rAnswer, count) {
  let answers = document.getElementsByName("quetion");
  let chosenAnswer;

  for (let i = 0; i < 4; i++) {
    if (answers[i].checked) {
      chosenAnswer = answers[i].dataset.answer;
    }
  }

  if (rAnswer === chosenAnswer) {
    rightAnswers++;
  }
}

function shufle(array) {
  //current index , temp element, random index
  let current = array.length,
    temp,
    random;

  //loop on array
  while (current > 0) {
    // random index
    random = Math.floor(Math.random() * current);

    //decrease current
    current--;
    // 1- temp element = curent element
    temp = array[current];
    // 2- current element = random element
    array[current] = array[random];
    // 3- random element = get element from temp
    array[random] = temp;
  }
  return array;
}
